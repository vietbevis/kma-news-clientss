import z from "zod";

const envConfigSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
  NEXT_PUBLIC_REVALIDATE_SECRET: z.string(),
  NEXT_PUBLIC_IMAGE_URL: z.string(),
});

const configProject = envConfigSchema.safeParse({
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_REVALIDATE_SECRET: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
  NEXT_PUBLIC_IMAGE_URL: process.env.NEXT_PUBLIC_IMAGE_URL,
});

if (!configProject.success) {
  console.error(configProject.error.message);
  throw new Error("Các khai báo biến môi trường không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
