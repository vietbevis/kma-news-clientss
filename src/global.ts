import { routing } from "@/i18n/routing";
import messages from "../messages/en.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}

export interface LinkProps {
  id: number;
  text: string;
  href: string;
  isExternal: boolean;
}

export interface ImageProps {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
  width: number;
  height: number;
}

export interface LogoProps {
  logoText: string;
  image: ImageProps;
  href: string;
}

export interface TagProps {
  text: string;
  color: string;
  slug: string;
}

export interface ArticlesProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  shortDescription: string;
  slug: string;
  thumbnail: ImageProps;
  tag: TagProps;
}

export interface EventProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  name: string;
  shortDescription: string;
  description: string;
  slug: string;
  startDate: string;
  endDate: string;
  location: string;
  organizer: string;
  speakers: string;
  thumbnail: ImageProps;
  tag: TagProps;
  insertToPage: Omit<NavigationProps, "navigations">[];
  relatedEvents: EventProps[];
}

export interface NavigationProps {
  text: string;
  slug: string;
  navigations: NavigationProps[];
  navigation: NavigationProps | null;
}

export interface SemesterProps {
  id: number;
  documentId: string;
  semester: number;
  subjects: SubjectProps[];
}

export interface SubjectProps {
  id: number;
  documentId: string;
  name: string;
  credits: number;
  subjectType: SubjectTypeProps;
}

export interface SubjectTypeProps {
  id: number;
  documentId: string;
  type: string;
  color: string;
}

export interface NavigationItemProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  text: string;
  slug: string;
  navigations: Omit<NavigationProps, "navigations">[];
  navigation: NavigationProps | null;
  singlePageContent: string;
  pageType: "news" | "staff" | "events" | "single";
}

export interface ArticleItemProps {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  shortDescription: string;
  slug: string;
  thumbnail: ImageProps;
  tag: TagProps;
  content: string;
  insertToPage: Omit<NavigationProps, "navigations">[];
  relatedArticles: ArticlesProps[];
  author: AuthorProps;
}

export interface AuthorProps {
  name: string;
  email: string;
  username: string;
  position: string;
  displayName: string;
  avatar: ImageProps;
}

export interface StaffProps {
  id: number;
  documentId: string;
  name: string;
  username: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  web: string;
  displayName: string;
  avatar: ImageProps;
  socialLinks: SocialLinkProps[];
  blockDescription: BlockDescriptionProps[];
}

export interface CardProps {
  header: string;
  description: string;
  link: LinkProps;
}

export type Platform =
  | "Twitter"
  | "Facebook"
  | "LinkedIn"
  | "Instagram"
  | "Github"
  | "Youtube";

export interface SocialLinkProps {
  link: LinkProps;
  platform: Platform;
}

export interface ContactProps {
  email: string;
  googleMap: string;
  location: string;
  phoneNumber: string;
  socialLinks: SocialLinkProps[];
}

export interface CopyRightProps {
  text: string;
  links: LinkProps[];
}

export type QuickLinksProps = NavigationProps[];

type ComponentType =
  | "blocks.common-block"
  | "blocks.semester-block"
  | "elements.block-description";
type BlockVariant =
  | "news"
  | "events"
  | "trainning"
  | "cooperation"
  | "alumni"
  | "slider";

interface Base<
  T extends ComponentType,
  D extends object = Record<string, unknown>
> {
  id: number;
  __component?: T;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  data?: D;
}

export type Block =
  | SliderBlockProps
  | NewsBlockProps
  | EventBlockProps
  | TrainingBlockProps
  | CooperationBlockProps
  | AlumniBlockProps
  | SemesterBlockProps
  | BlockDescriptionProps;

export interface CommonBlock<T extends BlockVariant>
  extends Base<"blocks.common-block"> {
  variants: BlockVariant;
  title: string;
  summary: string | null;
  link: LinkProps;
  isBackgroundHighlight: boolean;
  backgroundImage: ImageProps;
  isLinkFullWidth: boolean;
  articles: ArticlesProps[];
}

export interface SemesterBlockProps extends Base<"blocks.semester-block"> {
  title: string;
  semesters: SemesterProps[];
}

export interface BlockDescriptionProps
  extends Base<"elements.block-description"> {
  title: string;
  content: string;
}
export interface SliderBlockProps extends CommonBlock<"slider"> {
  articles: ArticlesProps[];
}
export interface NewsBlockProps extends CommonBlock<"news"> {
  articles: ArticlesProps[];
}
export interface EventBlockProps extends CommonBlock<"events"> {
  articles: ArticlesProps[];
  backgroundImage: ImageProps;
}
export interface TrainingBlockProps extends CommonBlock<"trainning"> {
  articles: ArticlesProps[];
}
export interface CooperationBlockProps extends CommonBlock<"cooperation"> {
  articles: ArticlesProps[];
}
export interface AlumniBlockProps extends CommonBlock<"alumni"> {
  articles: ArticlesProps[];
}
