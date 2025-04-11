import { BlogPost } from "@/components/blog/blog-post"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <BlogPost slug={params.slug} />
    </div>
  )
}
