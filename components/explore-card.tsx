"use client"

import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent } from "@/components/ui/card"

interface ExploreCardProps {
  title: string
  description: string
  image: string
  delay?: number
}

export function ExploreCard({ title, description, image, delay = 0 }: ExploreCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: delay }}
    >
      <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
        <Card className="bg-black border border-white/10 overflow-hidden group">
          <div className="relative h-48 overflow-hidden">
            <Image
              src={image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
              {title}
              <motion.div
                initial={{ scale: 0 }}
                whileHover={{ scale: 1.2, rotate: 45 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </h3>
            <p className="text-gray-400">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
