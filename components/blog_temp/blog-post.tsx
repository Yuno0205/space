"use client";

import { Post } from "@/app/blog/[slug]/page";
import { FadeIn } from "@/components/animations/fade-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DOMPurify from "dompurify";
import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, Calendar, Clock, Share2, Tag } from "lucide-react";
import Link from "next/link";

export function BlogPost({ post }: { post: Post }) {
  console.log("Post data:", post); // Log the post data to check its structure

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn>
        <Link href="/blog" className="flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog List
        </Link>
      </FadeIn>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="overflow-hidden">
          {post.image && (
            <div className="w-full h-64 relative">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              ></div>
            </div>
          )}
          <CardHeader>
            <CardTitle
              className="text-3xl"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }}
            />
            <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
              {/* Author */}
              {/* <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.author.avatar})` }}
                  ></div>
                </div>
                <span>{post.author.name}</span>
              </div> */}
              <div className="flex flex-wrap gap-2 mt-2">
                {post.categories.map((cat) => (
                  <Link key={cat} href={`/blog/categories/${cat}`}>
                    <Badge variant="outline" className="text-xs cursor-pointer">
                      <Tag className="mr-1 h-3 w-3" />
                      {String(cat).replace(/-/g, " ")} {/* Convert cat to a string */}
                    </Badge>
                  </Link>
                ))}
              </div>
              <span className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                {new Date(post.date).toLocaleDateString("vi-VN")}
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {post.readTime}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            ></div>
          </CardContent>

          <CardFooter className="flex justify-between border-t border-white/10 pt-6">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Bookmark className="mr-2 h-4 w-4" />
                Save Post
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
