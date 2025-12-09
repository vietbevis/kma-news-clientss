"use client";

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "react-share";

type ShareButtonProps = {
  url: string;
  iconSize?: number;
  type: "facebook" | "twitter" | "linkedin" | "email";
};

export default function ShareButton({
  url,
  iconSize = 24,
  type,
}: ShareButtonProps) {
  switch (type) {
    case "facebook":
      return (
        <FacebookShareButton url={url}>
          <FacebookIcon size={iconSize} round />
        </FacebookShareButton>
      );
    case "twitter":
      return (
        <TwitterShareButton url={url}>
          <TwitterIcon size={iconSize} round />
        </TwitterShareButton>
      );
    case "linkedin":
      return (
        <LinkedinShareButton url={url}>
          <LinkedinIcon size={iconSize} round />
        </LinkedinShareButton>
      );
    case "email":
      return (
        <EmailShareButton url={url}>
          <EmailIcon size={iconSize} round />
        </EmailShareButton>
      );
    default:
      return null;
  }
}
