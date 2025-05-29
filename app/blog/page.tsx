import { FadeIn } from "@/components/animations/fade-in";
import { BlogList } from "@/components/blog/blog-list";
import { fetchPosts } from "@/lib/wp"; // Import IWordpressPost và fetchPosts
import { IWordpressPost } from "@/types/post";

export default async function BlogPage() {
  let postsData: IWordpressPost[] = []; // Đổi tên rawPosts thành postsData cho rõ ràng hơn
  try {
    postsData = await fetchPosts();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return <div>Failed to load posts. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
      </FadeIn>

      <BlogList initialPosts={postsData} />
    </div>
  );
}
