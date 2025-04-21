"use client";

import { IBlogPost } from "@/app/blog/page";
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
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Calendar, Search, Tag } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DOMPurify from "dompurify";

type BlogListProps = {
  initialPosts: IBlogPost[];
  category?: string;
};

export function BlogList({ initialPosts, category }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<IBlogPost[]>(initialPosts);

  useEffect(() => {
    // Lọc bài viết theo từ khóa tìm kiếm
    const filteredPosts = initialPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.categories.some((cat) => String(cat).toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setBlogPosts(filteredPosts);
  }, [searchQuery, initialPosts]);

  // Filter posts by category if provided
  const filteredByCategory = category
    ? blogPosts.filter((post) => post.categories.map(String).includes(category))
    : blogPosts;

  // Get all unique categories
  const allCategories = Array.from(
    new Set(initialPosts.flatMap((post) => post.categories.map(String)))
  ).sort();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white/5">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white/5 border-white/10"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          {filteredByCategory.length > 0 ? (
            filteredByCategory.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="overflow-hidden hover:border-white/30 transition-colors">
                    <div className="md:flex">
                      {post.image && (
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${post.image})` }}
                          ></div>
                        </div>
                      )}
                      <div className={post.image ? "md:w-2/3" : "w-full"}>
                        <CardHeader>
                          <CardTitle
                            className="text-xl"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }}
                          />
                          <CardDescription className="flex items-center text-sm space-x-4">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(post.date).toLocaleDateString("vi-VN")}
                            </span>
                            {/* <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {Math.ceil(post.excerpt.length / 200)} phút đọc
                            </span> */}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p
                            className="text-gray-400"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.excerpt) }}
                          />
                        </CardContent>
                        <CardFooter>
                          <div className="flex flex-wrap gap-2">
                            {post.categories.map((cat) => (
                              <Badge key={cat} variant="outline" className="text-xs">
                                <Tag className="mr-1 h-3 w-3" />
                                {String(cat).replace(/-/g, " ")}
                              </Badge>
                            ))}
                          </div>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p>Không tìm thấy bài viết nào phù hợp.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Chủ đề</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <Link key={cat} href={`/blog/categories/${cat}`}>
                      <Badge
                        variant={category === cat ? "default" : "outline"}
                        className="text-xs cursor-pointer"
                      >
                        {cat.replace(/-/g, " ")}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Bài viết gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {initialPosts.slice(0, 3).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                      <div className="group">
                        <h3 className="font-medium group-hover:text-white transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {new Date(post.date).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/blog">Xem tất cả bài viết</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
