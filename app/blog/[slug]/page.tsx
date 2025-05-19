import { BlogPost } from "@/components/blog/blog-post";
import { IBlogPost } from "../page";
import { fetchPostBySlug } from "@/lib/wp";

export type Post = IBlogPost & {
  content: string;
  readTime: string;
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const data = await fetchPostBySlug(slug); // Get the first post (slug is unique)

  if (!data) {
    return <div>Post not found</div>;
  }

  // Destructure properties
  const {
    id,
    title,
    excerpt,
    slug: postSlug,
    date,
    categories,
    jetpack_featured_media_url: image,
    content,
    tags,
  } = data;

  // Create a new object with only the required properties
  const post: Post = {
    id,
    title: title?.rendered || "",
    excerpt: excerpt?.rendered || "",
    slug: postSlug,
    date,
    categories,
    image,
    tags,
    content: content?.rendered || "", // Use content.rendered if available, fallback to an empty string
    readTime: `${Math.ceil((content?.rendered || "").length / 1000)} min read`, // Calculate read time
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <BlogPost post={post} />
    </div>
  );
}
