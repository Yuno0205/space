"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import type { LottieComponentProps } from "lottie-react";
import spaceshipAnimationData from "@/public/animations/spaceship.json";

// Dynamic import component Lottie
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LoadingSpinner = () => {
  const lottieOptions: LottieComponentProps = {
    animationData: spaceshipAnimationData,
    loop: true,
    autoplay: true,
  };

  const spaceshipVariants = {
    initial: { y: 0, opacity: 0.8 },
    animate: {
      y: [-5, 5, -5],
      opacity: [0.8, 1, 0.8],
      transition: {
        y: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
        opacity: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    },
  };

  const textVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="flex flex-col items-center justify-center h-full bg-[url('/assets/images/stars_bg.jpg')] text-gray-200 font-inter p-5 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-48 h-48 md:w-52 md:h-52 mb-8"
          variants={spaceshipVariants}
          initial="initial"
          animate="animate"
        >
          {/* Kiểm tra typeof window trước khi render Lottie nếu cần cẩn thận hơn,
              nhưng ssr: false thường là đủ */}
          {typeof window !== "undefined" && (
            <Lottie {...lottieOptions} style={{ width: "100%", height: "100%" }} />
          )}
        </motion.div>

        <motion.p
          className="text-lg md:text-xl tracking-wider"
          variants={textVariants}
          initial="initial"
          animate="animate"
        >
          Đang du hành đến không gian mới...
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingSpinner;
