import { FadeIn } from "@/components/animations/fade-in";
import { BlogList } from "@/components/blog/blog-list";

import { fetchPosts } from "@/lib/wp";

export interface IBlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  categories: number[];
  image: string;
  tags: number[];
}

export default async function BlogPage() {
  let rawPosts = [];
  try {
    rawPosts = await fetchPosts();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return <div>Failed to load posts. Please try again later.</div>;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const posts: IBlogPost[] = rawPosts.map((post: any) => ({
    id: post.id,
    title: post.title.rendered,
    excerpt: post.excerpt.rendered,
    slug: post.slug,
    date: post.date,
    categories: post.categories,
    image: post.jetpack_featured_media_url,
    tags: post.tags,
  }));

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
      </FadeIn>

      <BlogList initialPosts={posts} />
    </div>
  );
}
