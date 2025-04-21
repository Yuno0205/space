import { FadeIn } from "@/components/animations/fade-in";
import { BlogList } from "@/components/blog/blog-list";
import { fetchPosts } from "@/lib/wp";
import { stripHtml } from "string-strip-html";

export interface IBlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  categories: number[]; // Hoặc string[] nếu categories là chuỗi
  image: string;
  tags: number[]; // Hoặc string[] nếu tags là chuỗi
}

export default async function BlogPage() {
  const rawPosts = await fetchPosts();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const posts = rawPosts.map((post) => ({
    ...post,
    title: stripHtml(post.title.rendered),
    excerpt: stripHtml(post.excerpt.rendered),
  }));

  console.log("Processed posts data:", posts);

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
      </FadeIn>

      <BlogList initialPosts={posts} />
    </div>
  );
}
