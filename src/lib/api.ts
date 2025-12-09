import envConfig from "@/config/env-config";
import { createHttpClient } from "./http";

const baseUrl = envConfig.NEXT_PUBLIC_API_ENDPOINT;

const api = createHttpClient({ baseURL: baseUrl, cache: "force-cache" });
export default api;
