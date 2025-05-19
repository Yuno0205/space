"use client";

import spaceshipAnimationData from "@/public/animations/spaceship.json";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieComponentProps } from "lottie-react";

// Dynamic import component Lottie
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LoadingAnimation = () => {
  const lottieOptions: LottieComponentProps = {
    animationData: spaceshipAnimationData,
    loop: true,
    autoplay: true,
  };

  // (Phần variants giữ nguyên)
  const spaceshipVariants = {
    initial: { y: 10, opacity: 0 },
    animate: {
      y: [-5, 5, -5],
      opacity: 1,
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        opacity: {
          duration: 0.5,
          ease: "easeOut",
        },
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0, y: 5 },
    animate: {
      opacity: [0.6, 1, 0.6],
      y: 0,
      transition: {
        opacity: {
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        y: {
          duration: 0.5,
          ease: "easeOut",
          delay: 0.1,
        },
      },
    },
  };

  // (Optional) Dùng state để đảm bảo chỉ render Lottie ở client
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col items-center justify-center h-full w-full dark:bg-black bg-cover bg-center text-gray-200 font-inter p-5 relative overflow-hidden"
        role="status"
        aria-live="polite"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-48 h-48 md:w-52 md:h-52 mb-8"
          variants={spaceshipVariants}
          initial="initial"
          animate="animate"
        >
          {/* Chỉ render Lottie khi isClient là true */}
          {isClient && <Lottie {...lottieOptions} style={{ width: "100%", height: "100%" }} />}
        </motion.div>

        <motion.p
          className="text-lg md:text-xl tracking-wider text-gray-700 dark:text-gray-400"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          Traveling to new space...
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingAnimation;
