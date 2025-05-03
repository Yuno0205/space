import { FadeIn } from "@/components/animations/fade-in"
import { BlogList } from "@/components/blog/blog-list"

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <FadeIn>
        <h1 className="text-3xl font-bold mb-2">Chủ đề: {decodeURIComponent(params.category)}</h1>
        <p className="text-gray-400 mb-8">Các bài viết về {decodeURIComponent(params.category)}</p>
      </FadeIn>

      <BlogList category={params.category} />
    </div>
  )
}
