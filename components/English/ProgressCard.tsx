// components/English/ProgressCard.tsx

import React from "react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ProgressCardComponent = ({ current, total }: { current: number; total: number }) => {
  const progressPercentage = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-black dark:text-white">Tiến độ của bạn</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={progressPercentage}
            className="h-3 rounded-full bg-gray-200 dark:bg-gray-700 [&>div]:bg-black dark:[&>div]:bg-white"
            aria-label={`Tiến độ: ${current + 1} trên ${total} từ đã hoàn thành`}
          />
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 text-right">
            {current + 1} / {total} từ
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ProgressCard = React.memo(ProgressCardComponent);
