"use client"

import { motion } from "framer-motion"
import { BookOpen, Brain, Clock, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function LearningProgress() {
  const courses = [
    { id: 1, name: "React Advanced Concepts", progress: 65, totalHours: 24, completedHours: 15.6 },
    { id: 2, name: "Data Structures & Algorithms", progress: 40, totalHours: 36, completedHours: 14.4 },
    { id: 3, name: "Machine Learning Fundamentals", progress: 25, totalHours: 48, completedHours: 12 },
  ]

  const totalStudyHours = 42
  const weeklyGoal = 15
  const weeklyProgress = Math.min(100, (totalStudyHours / weeklyGoal) * 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Tổng thời gian học</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" />
                {totalStudyHours} giờ
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Mục tiêu tuần này</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Target className="mr-2 h-5 w-5 text-gray-400" />
                {weeklyGoal} giờ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={weeklyProgress} className="h-2" />
              <p className="text-xs text-gray-400 mt-2">{Math.round(weeklyProgress)}% hoàn thành</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Khóa học đang học</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-gray-400" />
                {courses.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Chủ đề đã học</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Brain className="mr-2 h-5 w-5 text-gray-400" />
                12
              </CardTitle>
            </CardHeader>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ khóa học</CardTitle>
            <CardDescription>Theo dõi tiến độ các khóa học đang học</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-gray-400">
                      {course.completedHours}/{course.totalHours} giờ
                    </p>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-gray-400">{course.progress}% hoàn thành</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
