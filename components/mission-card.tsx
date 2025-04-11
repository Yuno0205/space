"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MissionCardProps {
  title: string
  status: "Active" | "Preparing" | "Completed"
  progress: number
  description: string
  delay?: number
}

export function MissionCard({ title, status, progress, description, delay = 0 }: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{title}</h3>
              <Badge
                variant={status === "Active" ? "default" : status === "Preparing" ? "outline" : "secondary"}
                className={status === "Active" ? "bg-primary text-primary-foreground" : ""}
              >
                {status}
              </Badge>
            </div>
            <p className="text-muted-foreground mb-4">{description}</p>
            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              ></motion.div>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <motion.span
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: delay + 0.6 }}
              >
                {progress}%
              </motion.span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
