import { FadeIn } from "@/components/animations/fade-in";
import { BlogList } from "@/components/blog/blog-list";
import { fetchPosts } from "@/lib/wp";

export default async function BlogPage() {
  const posts = await fetchPosts();
  console.log(posts);

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
      </FadeIn>

      <BlogList />
    </div>
  );
}
