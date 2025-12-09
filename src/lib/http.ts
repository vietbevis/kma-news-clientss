import qs from "qs";

type Primitive = string | number | boolean;

type ParamsValue = Primitive | ParamsValue[] | { [key: string]: ParamsValue };

export type HttpParams = Record<string, ParamsValue>;

export interface HttpRequestConfig {
  baseURL?: string;
  url?: string;
  headers?: Record<string, string>;
  params?: HttpParams;
  timeout?: number;
  withCredentials?: boolean;
  method?: string;
  body?: any;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  skipAuthRefresh?: boolean;
}

export interface NextFetchRequestConfig {
  revalidate?: number | false;
  tags?: string[];
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: HttpRequestConfig;
}

export interface HttpError extends Error {
  data?: any;
  status?: number;
  statusText?: string;
  config: HttpRequestConfig;
  code?: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AuthConfig {
  isAuthError: (error: HttpError) => boolean;
  refreshToken: () => Promise<RefreshTokenResponse>;
  getToken: () =>
    | Promise<RefreshTokenResponse | null>
    | RefreshTokenResponse
    | null;
  setToken: (token: RefreshTokenResponse) => Promise<void> | void;
}

export type HttpInterceptorFulfilled<T> = (value: T) => T | Promise<T>;
export type HttpInterceptorRejected = (error: HttpError) => any;

export interface HttpInterceptorManager<T> {
  use(
    fulfilled?: HttpInterceptorFulfilled<T>,
    rejected?: HttpInterceptorRejected
  ): number;
  eject(id: number): void;
  forEach(
    fn: (handler: {
      fulfilled?: HttpInterceptorFulfilled<T>;
      rejected?: HttpInterceptorRejected;
    }) => void
  ): void;
}

export interface HttpClientInstance {
  defaults: HttpRequestConfig;
  interceptors: {
    request: HttpInterceptorManager<HttpRequestConfig>;
    response: HttpInterceptorManager<HttpResponse>;
  };
  request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>>;
  get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  head<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  options<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;
  setAuthConfig: (config: AuthConfig) => void;
}

export enum HttpErrorCode {
  NETWORK_ERROR = "NETWORK_ERROR",
  TIMEOUT_ERROR = "TIMEOUT_ERROR",
  AUTH_ERROR = "AUTH_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  CLIENT_ERROR = "CLIENT_ERROR",
  ABORTED = "ABORTED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

class InterceptorManager<T> implements HttpInterceptorManager<T> {
  private handlers: Array<{
    fulfilled?: HttpInterceptorFulfilled<T>;
    rejected?: HttpInterceptorRejected;
  } | null> = [];

  use(
    fulfilled?: HttpInterceptorFulfilled<T>,
    rejected?: HttpInterceptorRejected
  ): number {
    this.handlers.push({ fulfilled, rejected });
    return this.handlers.length - 1;
  }

  eject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  forEach(
    fn: (handler: {
      fulfilled?: HttpInterceptorFulfilled<T>;
      rejected?: HttpInterceptorRejected;
    }) => void
  ): void {
    for (const handler of this.handlers) {
      if (handler !== null) {
        fn(handler);
      }
    }
  }
}

const isAbsoluteURL = (url: string): boolean =>
  /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);

const combineURLs = (baseURL: string, relativeURL: string): string =>
  relativeURL
    ? `${baseURL.replace(/\/+$/, "")}/${relativeURL.replace(/^\/+/, "")}`
    : baseURL;

const buildURL = (url: string, params?: HttpParams): string => {
  const queryString = qs.stringify(params);
  const finalUrl = new URL(url);
  finalUrl.search = queryString;
  return finalUrl.href;
};

class HttpClient implements HttpClientInstance {
  defaults: HttpRequestConfig;
  interceptors: {
    request: HttpInterceptorManager<HttpRequestConfig>;
    response: HttpInterceptorManager<HttpResponse>;
  };
  private authConfig: AuthConfig | null = null;
  private refreshTokenPromise: Promise<RefreshTokenResponse> | null = null;

  constructor(config?: HttpRequestConfig) {
    this.defaults = {
      baseURL: "",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      timeout: 30000,
      withCredentials: false,
      ...config,
    };

    this.interceptors = {
      request: new InterceptorManager<HttpRequestConfig>(),
      response: new InterceptorManager<HttpResponse>(),
    };
  }

  setAuthConfig(config: AuthConfig): void {
    this.authConfig = config;
  }

  async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const requestConfig = {
      ...this.defaults,
      ...config,
    };

    if (this.authConfig && !requestConfig.skipAuthRefresh) {
      const token = await this.authConfig.getToken();
      if (token) {
        requestConfig.headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${token.accessToken}`,
        };
      }
    }

    try {
      let chain = Promise.resolve(requestConfig);
      this.interceptors.request.forEach(({ fulfilled, rejected }) => {
        chain = chain.then(fulfilled, rejected);
      });
      const finalConfig = await chain;

      const finalUrl = this.buildFinalUrl(finalConfig);

      const { fetchOptions, controller } = this.createFetchOptions(finalConfig);

      const { timeoutPromise, timeoutId } = this.createTimeoutPromise<T>(
        finalConfig,
        controller
      );

      const fetchPromise = this.executeFetch<T>(
        finalUrl,
        fetchOptions,
        timeoutId,
        finalConfig
      );

      const responsePromise = timeoutPromise
        ? Promise.race([fetchPromise, timeoutPromise])
        : fetchPromise;

      const responseObj = await responsePromise;
      let responseChain = Promise.resolve(responseObj);
      this.interceptors.response.forEach(({ fulfilled, rejected }) => {
        responseChain = responseChain.then(fulfilled, rejected);
      });

      return await responseChain;
    } catch (error) {
      const httpError = this.normalizeError(error as Error, requestConfig);

      if (
        this.authConfig &&
        !config.skipAuthRefresh &&
        this.authConfig.isAuthError(httpError)
      ) {
        try {
          const newToken = await this.refreshAuthToken();

          const newRequestConfig: HttpRequestConfig = {
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${newToken.accessToken}`,
            },
            skipAuthRefresh: true,
          };

          return this.request<T>(newRequestConfig);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
        }
      }

      let errorChain: any = Promise.reject(httpError);
      this.interceptors.response.forEach(({ rejected }) => {
        if (rejected) errorChain = errorChain.catch(rejected);
      });

      throw await errorChain;
    }
  }

  private normalizeError(error: Error, config: HttpRequestConfig): HttpError {
    const httpError = error as HttpError;
    httpError.config = config;

    if (error.name === "AbortError") {
      httpError.code = HttpErrorCode.TIMEOUT_ERROR;
      httpError.message =
        httpError.message || `Request timed out after ${config.timeout}ms`;
    } else if (httpError.status) {
      if (httpError.status >= 500) {
        httpError.code = HttpErrorCode.SERVER_ERROR;
      } else if (httpError.status >= 400) {
        httpError.code = HttpErrorCode.CLIENT_ERROR;

        if (httpError.status === 401) {
          httpError.code = HttpErrorCode.AUTH_ERROR;
        }
      }
    } else if (error.message && error.message.includes("fetch")) {
      httpError.code = HttpErrorCode.NETWORK_ERROR;
      httpError.message = "Network error occurred";
    } else {
      httpError.code = HttpErrorCode.UNKNOWN_ERROR;
    }

    return httpError;
  }

  private async refreshAuthToken(): Promise<RefreshTokenResponse> {
    if (!this.refreshTokenPromise && this.authConfig) {
      this.refreshTokenPromise = this.authConfig
        .refreshToken()
        .then(async (token) => {
          if (this.authConfig) {
            await this.authConfig.setToken(token);
          }
          this.refreshTokenPromise = null;
          return token;
        })
        .catch((error) => {
          this.refreshTokenPromise = null;
          throw error;
        });
    }

    return (
      this.refreshTokenPromise ||
      Promise.reject(new Error("Auth config not set"))
    );
  }

  private buildFinalUrl(config: HttpRequestConfig): string {
    let finalUrl = "";
    if (config.url) {
      finalUrl = isAbsoluteURL(config.url)
        ? config.url
        : config.baseURL
        ? combineURLs(config.baseURL, config.url)
        : config.url;
    } else {
      finalUrl = config.baseURL || "";
    }

    return buildURL(finalUrl, config.params);
  }

  private createFetchOptions(config: HttpRequestConfig): {
    fetchOptions: RequestInit;
    controller: AbortController | null;
  } {
    const controller =
      config.timeout && config.timeout > 0 ? new AbortController() : null;

    let signal = config.signal;
    if (controller?.signal) {
      if (signal) {
        signal.addEventListener("abort", () => controller.abort());
      } else {
        signal = controller.signal;
      }
    }

    const fetchOptions: RequestInit = {
      method: config.method ? config.method.toUpperCase() : "GET",
      headers: config.headers as HeadersInit,
      credentials: config.withCredentials ? "include" : "same-origin",
      signal,
      cache: config.cache,
      next: config.next as any,
    };

    if (fetchOptions.method !== "GET" && fetchOptions.method !== "HEAD") {
      if (config.body !== undefined) {
        if (
          typeof config.body === "string" ||
          config.body instanceof FormData ||
          config.body instanceof Blob ||
          config.body instanceof URLSearchParams ||
          config.body instanceof ReadableStream
        ) {
          fetchOptions.body = config.body;
        } else {
          fetchOptions.body = JSON.stringify(config.body);
        }
      }
    }

    return { fetchOptions, controller };
  }

  private createTimeoutPromise<T>(
    config: HttpRequestConfig,
    controller: AbortController | null
  ): {
    timeoutPromise: Promise<HttpResponse<T>> | null;
    timeoutId: ReturnType<typeof setTimeout> | null;
  } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let timeoutPromise: Promise<HttpResponse<T>> | null = null;

    if (config.timeout && config.timeout > 0) {
      timeoutPromise = new Promise<HttpResponse<T>>((_, reject) => {
        timeoutId = setTimeout(() => {
          if (controller) controller.abort();
          const error = new Error(
            `Timeout of ${config.timeout}ms exceeded`
          ) as HttpError;
          error.config = config;
          error.code = HttpErrorCode.TIMEOUT_ERROR;
          reject(error);
        }, config.timeout);
      });
    }

    return { timeoutPromise, timeoutId };
  }

  private async executeFetch<T>(
    url: string,
    options: RequestInit,
    timeoutId: ReturnType<typeof setTimeout> | null,
    config: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      if (timeoutId) {
        const originalSignal = options.signal;
        if (originalSignal) {
          originalSignal.addEventListener("abort", () => {
            if (timeoutId) clearTimeout(timeoutId);
          });
        }
      }

      const response = await fetch(url, options);

      if (timeoutId) clearTimeout(timeoutId);

      let data: T;
      const contentType = response.headers.get("content-type");

      if (contentType?.includes("application/json")) {
        data = await response.json();
      } else if (contentType?.includes("application/octet-stream")) {
        const blob = await response.blob();
        data = blob as unknown as T;
      } else if (contentType?.includes("text/")) {
        data = (await response.text()) as unknown as T;
      } else {
        try {
          data = await response.json();
        } catch (e) {
          data = (await response.text()) as unknown as T;
        }
      }

      const responseObj: HttpResponse<T> = {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        config: config,
      };

      if (response.ok) {
        return responseObj;
      } else {
        const error = new Error(
          response.statusText || `Request failed with status ${response.status}`
        ) as HttpError;
        error.config = config;
        error.status = response.status;
        error.statusText = response.statusText;
        error.data = data;

        if (error.status >= 500) {
          error.code = HttpErrorCode.SERVER_ERROR;
        } else if (error.status >= 400) {
          error.code = HttpErrorCode.CLIENT_ERROR;
          if (error.status === 401) {
            error.code = HttpErrorCode.AUTH_ERROR;
          }
        }

        throw error;
      }
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);

      if ((error as HttpError).status) {
        throw error;
      }

      const httpError = error as HttpError;

      if (!httpError.config) {
        httpError.config = config;
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        httpError.code = HttpErrorCode.NETWORK_ERROR;
        httpError.message = "Network error occurred";
      } else if (error instanceof DOMException && error.name === "AbortError") {
        httpError.code = HttpErrorCode.TIMEOUT_ERROR;
        httpError.message = `Request aborted after ${config.timeout}ms`;
      }

      throw httpError;
    }
  }

  get<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: "GET" });
  }

  delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: "DELETE" });
  }

  head<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: "HEAD" });
  }

  options<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({ ...config, url, method: "OPTIONS" });
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: "POST",
      body: data,
    });
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: "PUT",
      body: data,
    });
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: "PATCH",
      body: data,
    });
  }
}

const http = new HttpClient();

export function createHttpClient(
  config?: HttpRequestConfig
): HttpClientInstance {
  return new HttpClient(config);
}

export default http;
