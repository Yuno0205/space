"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Headphones, BookOpen, Mic, Pencil, BookText, BarChart2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function EnglishDashboard() {
  const skills = [
    {
      name: "Listening",
      icon: Headphones,
      progress: 65,
      href: "/english/listening",
      color: "from-blue-500/20 to-transparent",
      borderColor: "border-blue-500/20",
    },
    {
      name: "Speaking",
      icon: Mic,
      progress: 45,
      href: "/english/speaking",
      color: "from-green-500/20 to-transparent",
      borderColor: "border-green-500/20",
    },
    {
      name: "Reading",
      icon: BookOpen,
      progress: 70,
      href: "/english/reading",
      color: "from-purple-500/20 to-transparent",
      borderColor: "border-purple-500/20",
    },
    {
      name: "Writing",
      icon: Pencil,
      progress: 50,
      href: "/english/writing",
      color: "from-yellow-500/20 to-transparent",
      borderColor: "border-yellow-500/20",
    },
    {
      name: "Vocabulary",
      icon: BookText,
      progress: 60,
      href: "/english/vocabulary",
      color: "from-red-500/20 to-transparent",
      borderColor: "border-red-500/20",
    },
  ];

  // It's better to format dates dynamically or fetch them in English if possible.
  // For this example, I'll translate them directly.
  const recentActivities = [
    { id: 1, name: "Listening Practice - Business Meeting", date: "2 hours ago", score: "8/10" },
    { id: 2, name: "Vocabulary Quiz - Technology Terms", date: "Yesterday", score: "15/20" },
    { id: 3, name: "Reading Comprehension - Science Article", date: "2 days ago", score: "90%" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                Skills Overview
              </CardTitle>
              <CardDescription>Track your learning progress in each skill</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className={`border ${skill.borderColor}`}>
                      <CardHeader className={`pb-2 bg-gradient-to-r ${skill.color}`}>
                        <CardTitle className="text-lg flex items-center">
                          <skill.icon className="mr-2 h-5 w-5" />
                          {skill.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <Progress value={skill.progress} className="h-2 mb-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">{skill.progress}%</span>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            <Button variant="link" asChild className="p-0 h-auto">
                              <Link href={skill.href}>Practice</Link>
                            </Button>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Your recently completed exercises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-center p-3 rounded-md border border-white/10 bg-white/5"
                  >
                    <div>
                      <p className="font-medium">{activity.name}</p>
                      <p className="text-sm text-gray-400">{activity.date}</p>
                    </div>
                    <div className="text-sm font-medium">{activity.score}</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View all activities
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Learning Goals</CardTitle>
              <CardDescription>Your English learning objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Daily Goal</p>
                    <p className="text-sm">15/20 minutes</p>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">New Vocabulary</p>
                    <p className="text-sm">8/10 words</p>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">Exercises Completed</p>
                    <p className="text-sm">3/5 exercises</p>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Adjust Goals
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
