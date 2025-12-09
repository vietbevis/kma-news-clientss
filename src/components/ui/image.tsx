/* eslint-disable no-restricted-imports */
/* eslint-disable @next/next/no-img-element */
import envConfig from "@/config/env-config";
import { ImageProps } from "@/global";
import NextImage, { ImageProps as NextImageProps } from "next/image";

const checkImageUrl = (url: string) => {
  if (!url) return "";

  return url;
};

export default function Image({
  image,
  ...props
}: { image: ImageProps } & Omit<
  NextImageProps,
  "src" | "alt" | "width" | "height"
>) {
  if (!image) {
    return (
      <NextImage
        src={"/placeholder.svg"}
        alt="placeholder"
        {...props}
        width={500}
        height={500}
      />
    );
  }

  return (
    <img
      {...props}
      src={checkImageUrl(image.url)}
      alt={image.alternativeText || image.url}
      width={image.width}
      height={image.height}
    />
  );
}
