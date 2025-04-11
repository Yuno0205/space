"use client"

import { motion } from "framer-motion"
import { BookMarked, Code, ExternalLink, FileText, Link2, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Resource = {
  id: number
  title: string
  url: string
  type: "article" | "video" | "code" | "document" | "link"
  tags: string[]
}

export function ResourceCollection() {
  const resources: Resource[] = [
    {
      id: 1,
      title: "Next.js App Router: Comprehensive Guide",
      url: "https://nextjs.org/docs",
      type: "article",
      tags: ["nextjs", "react", "frontend"],
    },
    {
      id: 2,
      title: "Advanced React Patterns",
      url: "https://example.com/react-patterns",
      type: "video",
      tags: ["react", "patterns", "advanced"],
    },
    {
      id: 3,
      title: "Framer Motion Animation Examples",
      url: "https://github.com/example/framer-motion-examples",
      type: "code",
      tags: ["animation", "framer-motion", "react"],
    },
    {
      id: 4,
      title: "System Design Interview Preparation",
      url: "https://example.com/system-design.pdf",
      type: "document",
      tags: ["interview", "system-design", "architecture"],
    },
    {
      id: 5,
      title: "TypeScript Handbook",
      url: "https://www.typescriptlang.org/docs/",
      type: "link",
      tags: ["typescript", "javascript", "documentation"],
    },
  ]

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "code":
        return <Code className="h-4 w-4" />
      case "document":
        return <BookMarked className="h-4 w-4" />
      case "link":
        return <Link2 className="h-4 w-4" />
      default:
        return <Link2 className="h-4 w-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.7 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Bộ sưu tập tài liệu</CardTitle>
          <CardDescription>Tài liệu và nguồn học tập đã lưu trữ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.map((resource) => (
              <motion.div
                key={resource.id}
                whileHover={{ x: 5 }}
                className="p-4 rounded-md border border-white/10 bg-white/5 flex justify-between items-start"
              >
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="mr-2 text-gray-400">{getResourceIcon(resource.type)}</span>
                    <h3 className="font-medium">{resource.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="icon" asChild className="ml-2 flex-shrink-0">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
