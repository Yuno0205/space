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
} = {}) {
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
  const apiUrl = `${endpoint}${endpoint.includes("?") ? "&" : "?"}${params.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
