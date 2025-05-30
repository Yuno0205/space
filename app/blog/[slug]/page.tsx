import { BlogPost } from "@/components/blog/blog-post";

import { fetchPostBySlug } from "@/lib/wordpress/wp";
import "./styles/blog.scss";
import { IWordpressPost } from "@/types/post";

export type Post = IWordpressPost & {
  readTime: string;
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const data = await fetchPostBySlug(slug);

  if (!data) {
    return <div>Post not found</div>;
  }

  const post: Post = {
    ...data,
    readTime: `${Math.ceil((data.content.rendered || "").length / 1000)} min read`, // Calculate read time
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <BlogPost post={post} />
    </div>
  );
}
