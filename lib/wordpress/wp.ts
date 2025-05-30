import { IWordpressPost } from "@/types/post";

export async function fetchPosts({
  page = 1,
  perPage = 10,
  categories = [],
  search = "",
}: {
  page?: number;
  perPage?: number;
  categories?: number[];
  search?: string;
} = {}): Promise<IWordpressPost[]> {
  const url = process.env.NEXT_PUBLIC_WP_API_URL;

  if (!url) {
    console.warn("NEXT_PUBLIC_WP_API_URL is not defined. Using default URL.");
  }

  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (categories.length > 0) {
    params.append("categories", categories.join(","));
  }

  if (search) {
    params.append("search", search);
  }

  const endpoint =
    url || "https://public-api.wordpress.com/wp/v2/sites/mainhathao195.wordpress.com/posts";
  const apiUrl = `${endpoint}${endpoint.includes("?") ? "&" : "?"}_embed&${params.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 * 24 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data: IWordpressPost[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

export async function fetchPostBySlug(slug: string): Promise<IWordpressPost | undefined> {
  const url = process.env.NEXT_PUBLIC_WP_API_URL;

  if (!url) {
    console.warn("NEXT_PUBLIC_WP_API_URL is not defined. Using default URL.");
  }

  try {
    const baseUrl =
      url || "https://public-api.wordpress.com/wp/v2/sites/mainhathao195.wordpress.com/posts";
    const endpoint = `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}_embed&slug=${slug}`;

    const response = await fetch(endpoint, {
      next: { revalidate: 0 },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status} ${response.statusText}`);
    }

    const data: IWordpressPost[] = await response.json();
    // API returns an array, return undefined if no posts found
    return data.length > 0 ? data[0] : undefined;
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    throw error;
  }
}
