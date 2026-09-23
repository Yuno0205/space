"use client";

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
import { IWordpressPost } from "@/types/post";
import { motion } from "framer-motion";
import { Calendar, Search, Tag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type BlogListProps = {
  initialPosts: IWordpressPost[];
  category?: string;
};

function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"');
}

export function BlogList({ initialPosts, category }: BlogListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedSearchQuery = searchQuery.toLowerCase().trim();

  const blogPosts = initialPosts.filter(
    (post) =>
      stripHtml(post.title.rendered).toLowerCase().includes(normalizedSearchQuery) ||
      stripHtml(post.excerpt.rendered).toLowerCase().includes(normalizedSearchQuery) ||
      post.categories?.some((cat) => String(cat).toLowerCase().includes(normalizedSearchQuery))
  );

  const filteredByCategory = category
    ? blogPosts.filter((post) => post.categories?.map(String).includes(category))
    : blogPosts;

  const allCategories = Array.from(
    new Set(initialPosts.flatMap((post) => post.categories?.map(String)))
  ).sort();

  return (
    <div className="space-y-6">
      {/* ... phần search và categories ... */}
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
                placeholder="Search for articles..."
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
                      {post.jetpack_featured_media_url && (
                        <div className="md:w-1/3 h-48 md:h-auto relative">
                          <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: `url(${post.jetpack_featured_media_url})` }}
                          ></div>
                        </div>
                      )}
                      <div className={post.jetpack_featured_media_url ? "md:w-2/3" : "w-full"}>
                        <CardHeader>
                          <CardTitle className="text-xl">
                            {stripHtml(post.title.rendered)}
                          </CardTitle>
                          <CardDescription className="flex items-center text-sm space-x-4">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(post.date).toLocaleDateString("vi-VN")}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-400">{stripHtml(post.excerpt.rendered)}</div>
                        </CardContent>
                        <CardFooter>
                          <div className="flex flex-wrap gap-2">
                            {post.categories?.map((cat) => (
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
                <p>No matching articles found.</p>
              </CardContent>
            </Card>
          )}
        </div>
        {/* Sidebar categories và recent posts */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((cat) => (
                    <Link key={cat} href={`/blog/categories/${cat}`}>
                      <Badge
                        variant={category === cat ? "default" : "outline"}
                        className="text-xs cursor-pointer"
                      >
                        {cat?.replace(/-/g, " ")}
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
                <CardTitle>Recent Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {initialPosts.slice(0, 3).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                      <div className="group">
                        <h3 className="font-medium group-hover:text-white transition-colors">
                          {stripHtml(post.title.rendered)}
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
                  <Link href="/blog">View all posts</Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
