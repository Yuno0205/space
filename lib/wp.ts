export async function fetchPosts() {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  const response = await fetch(
    url || "https://public-api.wordpress.com/wp/v2/sites/mainhathao195.wordpress.com/posts",
    {
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  return response.json();
}
