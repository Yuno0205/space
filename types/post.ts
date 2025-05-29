export interface IWordpressPost {
  id: number;
  title: { rendered: string };
  excerpt: { rendered: string };
  slug: string;
  date: string;
  categories?: number[];
  jetpack_featured_media_url?: string;
  tags?: number[];
  content: { rendered: string };
}
