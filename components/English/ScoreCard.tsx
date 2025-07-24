// components/English/ScoreCard.tsx

import React from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Bước 1: Định nghĩa component gốc với một cái tên rõ ràng
const ScoreCardComponent = ({
  score,
  total,
  onRestart,
}: {
  score: number;
  total: number;
  onRestart: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">🎉 Hoàn thành!</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Bạn đã làm xong bài luyện nghe.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold text-black dark:text-white">
          {score} / {total}
        </div>
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg w-1/2">
            <div className="font-semibold text-gray-600 dark:text-gray-400">Độ chính xác</div>
            <div className="text-lg font-bold text-black dark:text-white">
              {total > 0 ? Math.round((score / total) * 100) : 0}%
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button
          onClick={onRestart}
          className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Làm lại
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);

export const ScoreCard = React.memo(ScoreCardComponent);
