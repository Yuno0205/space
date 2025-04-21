import { BlogPost } from "@/components/blog/blog-post";
import { IBlogPost } from "../page";

export type Post = IBlogPost & {
  content: string;
  readTime: string;
};

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const response = await fetch(
    `https://public-api.wordpress.com/wp/v2/sites/mainhathao195.wordpress.com/posts?slug=${slug}`,
    { next: { revalidate: 3600 } }
  );
  const posts = await response.json();
  const data = posts[0]; // Get the first post (slug is unique)

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
    title: title.rendered, // Assuming title is an object with a "rendered" property
    excerpt: excerpt.rendered, // Assuming excerpt is an object with a "rendered" property
    slug: postSlug,
    date,
    categories,
    image,
    tags,
    content: content?.rendered || "", // Use content.rendered if available, fallback to an empty string
    readTime: `${Math.ceil((content?.rendered || "").length / 200)} min read`, // Calculate read time
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <BlogPost post={post} />
    </div>
  );
}
