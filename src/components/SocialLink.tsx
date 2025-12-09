import { SocialLinkProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

export default function SocialLink(data: SocialLinkProps) {
  switch (data.platform) {
    case "Facebook":
      return (
        <Link
          key={data.link.id}
          href={data.link.href}
          target={data.link.isExternal ? "_blank" : undefined}
          rel={data.link.isExternal ? "noopener noreferrer" : undefined}
          className="w-10 h-10 bg-primary/10 p-2 text-white hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
          aria-label={data.link.text}
        >
          <Facebook className="w-5 h-5" />
        </Link>
      );
    case "Instagram":
      return (
        <Link
          key={data.link.id}
          href={data.link.href}
          target={data.link.isExternal ? "_blank" : undefined}
          rel={data.link.isExternal ? "noopener noreferrer" : undefined}
          className="w-10 h-10 bg-primary/10 p-2 text-white hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
          aria-label={data.link.text}
        >
          <Instagram className="w-5 h-5" />
        </Link>
      );
    case "Twitter":
      return (
        <Link
          key={data.link.id}
          href={data.link.href}
          target={data.link.isExternal ? "_blank" : undefined}
          rel={data.link.isExternal ? "noopener noreferrer" : undefined}
          className="w-10 h-10 bg-primary/10 p-2 text-white hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
          aria-label={data.link.text}
        >
          <Twitter className="w-5 h-5" />
        </Link>
      );
    case "LinkedIn":
      return (
        <Link
          key={data.link.id}
          href={data.link.href}
          target={data.link.isExternal ? "_blank" : undefined}
          rel={data.link.isExternal ? "noopener noreferrer" : undefined}
          className="w-10 h-10 bg-primary/10 p-2 text-white hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
          aria-label={data.link.text}
        >
          <Linkedin className="w-5 h-5" />
        </Link>
      );
    case "Youtube":
      return (
        <Link
          key={data.link.id}
          href={data.link.href}
          target={data.link.isExternal ? "_blank" : undefined}
          rel={data.link.isExternal ? "noopener noreferrer" : undefined}
          className="w-10 h-10 bg-primary/10 p-2 text-white hover:bg-primary/20 rounded-full flex items-center justify-center transition-colors"
          aria-label={data.link.text}
        >
          <Youtube className="w-5 h-5" />
        </Link>
      );
    default:
      return null;
  }
}
