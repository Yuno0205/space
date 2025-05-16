"use client";

import { motion } from "framer-motion";
import { BookOpen, Brain, Clock, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LearningProgress() {
  const courses = [
    { id: 1, name: "React Advanced Concepts", progress: 65, totalHours: 24, completedHours: 15.6 },
    {
      id: 2,
      name: "Data Structures & Algorithms",
      progress: 40,
      totalHours: 36,
      completedHours: 14.4,
    },
    {
      id: 3,
      name: "Machine Learning Fundamentals",
      progress: 25,
      totalHours: 48,
      completedHours: 12,
    },
  ];

  const totalStudyHours = 42;
  const weeklyGoal = 15;
  const weeklyProgress = Math.min(100, (totalStudyHours / weeklyGoal) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Study Time</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-400" />
                {totalStudyHours} hours
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
              <CardDescription>This Week`&apos;`s Goal</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Target className="mr-2 h-5 w-5 text-gray-400" />
                {weeklyGoal} hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={weeklyProgress} className="h-2" />
              <p className="text-xs text-gray-400 mt-2">{Math.round(weeklyProgress)}% completed</p>
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
              <CardDescription>Courses in Progress</CardDescription>
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
              <CardDescription>Topics Covered</CardDescription>
              <CardTitle className="text-2xl flex items-center">
                <Brain className="mr-2 h-5 w-5 text-gray-400" />
                12 {/* This is currently a hardcoded value */}
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
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Track the progress of your ongoing courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-gray-400">
                      {course.completedHours}/{course.totalHours} hours
                    </p>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-gray-400">{course.progress}% completed</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
