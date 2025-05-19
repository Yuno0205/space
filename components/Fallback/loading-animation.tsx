"use client";

import spaceshipAnimationData from "@/public/animations/spaceship.json"; // Đường dẫn tới file JSON
import { AnimatePresence, motion } from "framer-motion";
import { LottieComponentProps } from "lottie-react";
import React from "react";

const LoadingAnimation: React.FC = () => {
  const lottieOptions: LottieComponentProps = {
    animationData: spaceshipAnimationData,
    loop: true,
    autoplay: true,
  };

  const spaceshipVariants = {
    initial: { y: 10, opacity: 0 }, // Bắt đầu với opacity 0 và hơi dịch xuống
    animate: {
      y: [-5, 5, -5], // Di chuyển nhẹ lên xuống
      opacity: 1,
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        opacity: {
          // Animation cho opacity khi xuất hiện
          duration: 0.5,
          ease: "easeOut",
        },
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 5 }, // Bắt đầu với opacity 0 và hơi dịch xuống
    animate: {
      opacity: [0.6, 1, 0.6], // Thay đổi opacity để tạo hiệu ứng "thở"
      y: 0,
      transition: {
        opacity: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        y: {
          // Animation cho y khi xuất hiện
          duration: 0.5,
          ease: "easeOut",
          delay: 0.1, // Delay nhẹ so với Lottie
        },
      },
    },
  };

  return (
    // AnimatePresence không thực sự cần thiết ở đây vì loading.tsx sẽ bị unmount bởi Next.js
    // nhưng để lại cũng không sao.
    <AnimatePresence>
      <motion.div
        className="flex flex-col items-center justify-center h-full w-full dark:bg-black bg-cover bg-center text-gray-200 font-inter p-5 relative overflow-hidden"
        role="status"
        aria-live="polite"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }} // Thời gian fade in/out ngắn
      >
        <motion.div
          className="w-48 h-48 md:w-52 md:h-52 mb-8"
          variants={spaceshipVariants}
          initial="initial" // Sẽ lấy từ spaceshipVariants.initial
          animate="animate" // Sẽ lấy từ spaceshipVariants.animate
        >
          {/* <Lottie {...lottieOptions} style={{ width: "100%", height: "100%" }} /> */}
          Loading
        </motion.div>

        <motion.p
          className="text-lg md:text-xl tracking-wider text-gray-700 dark:text-gray-400"
          variants={textVariants}
          initial="initial" // Sẽ lấy từ textVariants.initial
          animate="animate" // Sẽ lấy từ textVariants.animate
        >
          Traveling to new space...
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingAnimation;
