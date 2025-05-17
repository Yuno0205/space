"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: string;
};

// Sample tasks in English for demonstration
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Complete React Hooks exercises",
    completed: true,
    priority: "high",
    dueDate: "2025-04-15",
  },
  {
    id: 2,
    title: "Read Next.js App Router documentation",
    completed: false,
    priority: "medium",
    dueDate: "2025-04-20",
  },
  {
    id: 3,
    title: "Work on the final course project",
    completed: false,
    priority: "high",
    dueDate: "2025-05-10",
  },
  { id: 4, title: "Research Framer Motion animations", completed: false, priority: "low" },
];

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks); // Use English initial tasks
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: newTask,
          completed: false,
          priority: "medium", // Default priority for new tasks
        },
      ]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-blue-500 hover:bg-blue-600"; // A default color
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    // Basic date formatting, you might want to use a library like date-fns for more robust formatting
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      // Using en-US locale for date
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Task Manager</CardTitle>
          <CardDescription>Track and manage your learning tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Add new task..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className="flex-1"
            />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button onClick={addTask} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>

          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md border",
                  task.completed ? "bg-muted/50 border-muted" : "bg-background border-border"
                )}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button onClick={() => toggleTask(task.id)} className="flex-shrink-0">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex-1">
                    <p
                      className={cn("font-medium", task.completed && "line-through text-gray-400")}
                    >
                      {task.title}
                    </p>
                    {task.dueDate && (
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={cn("text-xs capitalize", getPriorityColor(task.priority))}>
                    {task.priority} {/* Display priority directly */}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="text-sm text-gray-400">
          {tasks.filter((t) => t.completed).length} / {tasks.length} tasks completed
        </CardFooter>
      </Card>
    </motion.div>
  );
}
