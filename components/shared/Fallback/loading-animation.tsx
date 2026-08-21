"use client";

import spaceshipAnimationData from "@/public/animations/spaceship.json";
import { motion, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { LottieComponentProps } from "lottie-react";

// Dynamic import component Lottie
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const spaceshipVariants: Variants = {
  initial: { y: 10, opacity: 0 },
  animate: {
    y: [-5, 5, -5],
    opacity: 1,
    transition: {
      y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      opacity: { duration: 0.5, ease: "easeOut" },
    },
  },
};

const textVariants: Variants = {
  initial: { opacity: 0, y: 5 },
  animate: {
    opacity: [0.6, 1, 0.6],
    y: 0,
    transition: {
      opacity: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      y: { duration: 0.5, ease: "easeOut", delay: 0.1 },
    },
  },
};

const LoadingAnimation = () => {
  const lottieOptions: LottieComponentProps = {
    animationData: spaceshipAnimationData,
    loop: true,
    autoplay: true,
  };

  // Chỉ render Lottie ở client để tránh lỗi hydration
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center dark:bg-black bg-white text-gray-200 font-inter p-5"
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
  );
};

export default LoadingAnimation;
