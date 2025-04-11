"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, Tag, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type BlogPost = {
  id: number
  title: string
  excerpt: string
  slug: string
  date: string
  readTime: string
  categories: string[]
  image?: string
}

export function BlogList({ category }: { category?: string }) {
  const [searchQuery, setSearchQuery] = useState("")

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Cách học tiếng Anh hiệu quả với phương pháp Spaced Repetition",
      excerpt: "Khám phá cách áp dụng phương pháp lặp lại ngắt quãng để ghi nhớ từ vựng tiếng Anh lâu dài và hiệu quả.",
      slug: "cach-hoc-tieng-anh-hieu-qua-voi-phuong-phap-spaced-repetition",
      date: "2025-04-10",
      readTime: "5 phút",
      categories: ["tiếng-anh", "phương-pháp-học"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      title: "Tổng hợp các nguồn học React miễn phí chất lượng cao",
      excerpt:
        "Danh sách các tài liệu, khóa học và video hướng dẫn miễn phí giúp bạn học React từ cơ bản đến nâng cao.",
      slug: "tong-hop-cac-nguon-hoc-react-mien-phi-chat-luong-cao",
      date: "2025-04-05",
      readTime: "7 phút",
      categories: ["lập-trình", "react", "frontend"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "Cách tôi đã cải thiện kỹ năng nghe tiếng Anh trong 30 ngày",
      excerpt:
        "Chia sẻ trải nghiệm và phương pháp giúp tôi cải thiện đáng kể khả năng nghe tiếng Anh chỉ trong một tháng.",
      slug: "cach-toi-da-cai-thien-ky-nang-nghe-tieng-anh-trong-30-ngay",
      date: "2025-03-28",
      readTime: "10 phút",
      categories: ["tiếng-anh", "kinh-nghiệm"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 4,
      title: "Tìm hiểu về Next.js App Router và Server Components",
      excerpt:
        "Khám phá những tính năng mới của Next.js App Router và cách sử dụng Server Components để tối ưu hiệu suất.",
      slug: "tim-hieu-ve-nextjs-app-router-va-server-components",
      date: "2025-03-20",
      readTime: "8 phút",
      categories: ["lập-trình", "nextjs", "react"],
      image: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 5,
      title: "5 phương pháp ghi nhớ từ vựng tiếng Anh hiệu quả",
      excerpt: "Tổng hợp các kỹ thuật ghi nhớ từ vựng tiếng Anh giúp bạn mở rộng vốn từ nhanh chóng và bền vững.",
      slug: "5-phuong-phap-ghi-nho-tu-vung-tieng-anh-hieu-qua",
      date: "2025-03-15",
      readTime: "6 phút",
      categories: ["tiếng-anh", "từ-vựng", "phương-pháp-học"],
      image: "/placeholder.svg?height=400&width=600",
    },
  ]

  // Filter posts by category if provided
  const filteredByCategory = category ? blogPosts.filter((post) => post.categories.includes(category)) : blogPosts

  // Filter posts by search query
  const filteredPosts = searchQuery
    ? filteredByCategory.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.categories.some((cat) => cat.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : filteredByCategory

  // Get all unique categories
  const allCategories = Array.from(new Set(blogPosts.flatMap((post) => post.categories))).sort()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
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
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post, index) => (
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
                          <CardTitle className="text-xl">{post.title}</CardTitle>
                          <CardDescription className="flex items-center text-sm space-x-4">
                            <span className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(post.date).toLocaleDateString("vi-VN")}
                            </span>
                            <span className="flex items-center">
                              <Clock className="mr-1 h-3 w-3" />
                              {post.readTime}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-400">{post.excerpt}</p>
                        </CardContent>
                        <CardFooter>
                          <div className="flex flex-wrap gap-2">
                            {post.categories.map((cat) => (
                              <Badge key={cat} variant="outline" className="text-xs">
                                <Tag className="mr-1 h-3 w-3" />
                                {cat.replace(/-/g, " ")}
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
                      <Badge variant={category === cat ? "default" : "outline"} className="text-xs cursor-pointer">
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
                  {blogPosts.slice(0, 3).map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                      <div className="group">
                        <h3 className="font-medium group-hover:text-white transition-colors">{post.title}</h3>
                        <p className="text-sm text-gray-400">{new Date(post.date).toLocaleDateString("vi-VN")}</p>
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
  )
}
