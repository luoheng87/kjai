export type AiToolPreview = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  logoUrl: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  rating: number;
  clickCount: number;
  likeCount: number;
  websiteUrl: string;
  affiliateSuffix: string | null;
  promoCode: string | null;
  isFeatured: boolean;
};

export type AiToolDetail = AiToolPreview & {
  description: string | null;
  content: string | null;
  priceRange: string | null;
};

export type ListingPreview = {
  id: string;
  type: "demand" | "service";
  title: string;
  description: string;
  budget: string | null;
  deliveryTime: string | null;
  authorName: string | null;
  createdAt: Date;
};

export type ListingDetail = ListingPreview & {
  contactWechat: string | null;
  contactWhatsapp: string | null;
  contactTelegram: string | null;
};

export type ForumPostPreview = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  authorName: string | null;
  createdAt: Date;
};

export type ForumPostDetail = ForumPostPreview & {
  comments: {
    id: string;
    content: string;
    authorName: string | null;
    createdAt: Date;
  }[];
};

export type ArticlePreview = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  isPremium: boolean;
  publishedAt: Date | null;
};

export type ArticleDetail = ArticlePreview & {
  content: string;
  coverUrl: string | null;
  viewCount: number;
};

export type EventPreview = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string | null;
  startsAt: Date;
};

export type EventDetail = EventPreview & {
  externalTicketUrl: string | null;
  useInternalForm: boolean;
};
