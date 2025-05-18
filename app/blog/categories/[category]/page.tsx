import { FadeIn } from "@/components/animations/fade-in";
import { BlogList } from "@/components/Blog/blog-list";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  // await params trước khi destructure
  const { category } = await params;

  const decoded = decodeURIComponent(category);

  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-2">Chủ đề: {decoded}</h1>
        <p className="text-gray-400 mb-8">Các bài viết về {decoded}</p>
      </FadeIn>

      <BlogList initialPosts={[]} category={category} />
    </div>
  );
}
