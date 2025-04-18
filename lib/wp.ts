// lib/wp.ts
const WP_API_URL = "http://yuno-blog.local/graphql";

export async function fetchWP(query: string) {
  const res = await fetch(WP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();

  if (json.errors) {
    console.error(json.errors);
    throw new Error("Failed to fetch from WordPress GraphQL");
  }

  return json.data;
}
