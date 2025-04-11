"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Calendar, Clock, Tag, ArrowLeft, Bookmark, Share2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FadeIn } from "@/components/animations/fade-in"

type BlogPostData = {
  id: number
  title: string
  content: string
  slug: string
  date: string
  readTime: string
  categories: string[]
  image?: string
  author: {
    name: string
    avatar: string
  }
}

export function BlogPost({ slug }: { slug: string }) {
  // In a real app, you would fetch the post data based on the slug
  // This is just mock data for demonstration
  const post: BlogPostData = {
    id: 1,
    title: "Cách học tiếng Anh hiệu quả với phương pháp Spaced Repetition",
    content: `
      <p>Phương pháp Spaced Repetition (lặp lại ngắt quãng) là một kỹ thuật học tập hiệu quả dựa trên nghiên cứu khoa học về cách não bộ ghi nhớ thông tin. Thay vì học dồn một lúc nhiều từ vựng và không bao giờ ôn lại, phương pháp này khuyến khích việc ôn tập theo các khoảng thời gian được tính toán cẩn thận.</p>
      
      <h2>Nguyên lý hoạt động</h2>
      
      <p>Khi bạn học một từ mới, não bộ sẽ lưu giữ thông tin đó trong bộ nhớ ngắn hạn. Nếu không được ôn tập, thông tin sẽ dần bị quên đi. Tuy nhiên, nếu bạn ôn tập đúng thời điểm - ngay trước khi bạn sắp quên - não bộ sẽ tăng cường kết nối thần kinh và chuyển thông tin vào bộ nhớ dài hạn.</p>
      
      <p>Phương pháp Spaced Repetition tận dụng "đường cong quên" của Hermann Ebbinghaus để xác định thời điểm tối ưu cho việc ôn tập:</p>
      
      <ul>
        <li>Ôn tập lần đầu: sau 1 ngày</li>
        <li>Ôn tập lần hai: sau 3 ngày</li>
        <li>Ôn tập lần ba: sau 7 ngày</li>
        <li>Ôn tập lần bốn: sau 14 ngày</li>
        <li>Ôn tập lần năm: sau 30 ngày</li>
      </ul>
      
      <h2>Các công cụ hỗ trợ</h2>
      
      <p>Có nhiều ứng dụng và phần mềm giúp bạn áp dụng phương pháp này một cách dễ dàng:</p>
      
      <ul>
        <li><strong>Anki</strong>: Phần mềm thẻ ghi nhớ mã nguồn mở, cho phép tạo bộ thẻ tùy chỉnh và tự động lên lịch ôn tập.</li>
        <li><strong>Quizlet</strong>: Nền tảng học tập với nhiều tính năng tương tác, bao gồm chế độ học tập ngắt quãng.</li>
        <li><strong>Memrise</strong>: Ứng dụng học ngôn ngữ với thuật toán lặp lại thông minh và nội dung đa phương tiện.</li>
      </ul>
      
      <h2>Cách áp dụng hiệu quả</h2>
      
      <p>Để tối ưu hóa việc học với phương pháp Spaced Repetition, bạn nên:</p>
      
      <ol>
        <li>Chia nhỏ nội dung học thành các phần dễ tiêu hóa</li>
        <li>Học đều đặn mỗi ngày, thay vì học dồn</li>
        <li>Tập trung vào những từ khó nhớ</li>
        <li>Kết hợp với các phương pháp ghi nhớ khác như liên tưởng, hình ảnh hóa</li>
        <li>Sử dụng trong ngữ cảnh thực tế</li>
      </ol>
      
      <p>Với sự kiên trì và áp dụng đúng phương pháp, Spaced Repetition có thể giúp bạn ghi nhớ từ vựng tiếng Anh hiệu quả hơn đến 90% so với các phương pháp học truyền thống.</p>
    `,
    slug: "cach-hoc-tieng-anh-hieu-qua-voi-phuong-phap-spaced-repetition",
    date: "2025-04-10",
    readTime: "5 phút",
    categories: ["tiếng-anh", "phương-pháp-học"],
    image: "/placeholder.svg?height=400&width=800",
    author: {
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=100&width=100",
    },
  }

  // Related posts (in a real app, you would fetch related posts)
  const relatedPosts = [
    {
      id: 3,
      title: "Cách tôi đã cải thiện kỹ năng nghe tiếng Anh trong 30 ngày",
      slug: "cach-toi-da-cai-thien-ky-nang-nghe-tieng-anh-trong-30-ngay",
      date: "2025-03-28",
    },
    {
      id: 5,
      title: "5 phương pháp ghi nhớ từ vựng tiếng Anh hiệu quả",
      slug: "5-phuong-phap-ghi-nho-tu-vung-tieng-anh-hieu-qua",
      date: "2025-03-15",
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <FadeIn>
        <Link href="/blog" className="flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách bài viết
        </Link>
      </FadeIn>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="overflow-hidden">
          {post.image && (
            <div className="w-full h-64 relative">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }}></div>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-3xl">{post.title}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.author.avatar})` }}
                  ></div>
                </div>
                <span>{post.author.name}</span>
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
            <div className="flex flex-wrap gap-2 mt-2">
              {post.categories.map((cat) => (
                <Link key={cat} href={`/blog/categories/${cat}`}>
                  <Badge variant="outline" className="text-xs cursor-pointer">
                    <Tag className="mr-1 h-3 w-3" />
                    {cat.replace(/-/g, " ")}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }}></div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-white/10 pt-6">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex items-center">
                <Bookmark className="mr-2 h-4 w-4" />
                Lưu bài viết
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Share2 className="mr-2 h-4 w-4" />
                Chia sẻ
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Bài viết liên quan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {relatedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="block">
                  <div className="group">
                    <h3 className="font-medium group-hover:text-white transition-colors">{post.title}</h3>
                    <p className="text-sm text-gray-400">{new Date(post.date).toLocaleDateString("vi-VN")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
