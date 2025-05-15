// app/not-found.tsx
"use client";

import React from "react";
import Link from "next/link";
import Lottie, { LottieComponentProps } from "lottie-react";
import { motion } from "framer-motion";
import notFoundAnimationData from "@/public/animations/not-found.json";
import { Orbitron } from "next/font/google";
import { cn } from "@/lib/utils";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: "400",
});

const NotFoundPage: React.FC = () => {
  const lottieOptions: LottieComponentProps = {
    animationData: notFoundAnimationData,
    loop: true,
    autoplay: true,
  };

  const ufoVariants = {
    initial: { scale: 0.8, opacity: 0, y: 20 },
    animate: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
        delay: 0.2,
      },
    },
    hover: {
      y: [-5, 5, -5],
      transition: {
        y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
      },
    },
  };

  const contentVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-full w-full bg-black text-white font-sans p-6 text-center",
        orbitron.className
      )}
    >
      <motion.div
        className="w-56 h-56 md:w-72 md:h-72 mb-6"
        variants={ufoVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <Lottie {...lottieOptions} style={{ width: "100%", height: "100%" }} />
      </motion.div>

      <motion.h1
        className="text-3xl md:text-4xl font-semibold text-gray-100 mb-3"
        variants={contentVariants}
        initial="initial"
        animate="animate"
      >
        Hmm, looks like you&apos;ve slipped into another dimension.
      </motion.h1>

      <motion.p
        className="text-base md:text-lg text-gray-400 mb-8 max-w-xs md:max-w-sm"
        variants={contentVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        This planet doesn&apos;t seem to be initialized yet...
      </motion.p>

      <motion.div
        variants={contentVariants}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          href="/"
          className="px-5 py-2.5 bg-white text-black font-medium rounded-md shadow-sm
                     hover:bg-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75
                     transition-colors duration-200 ease-in-out transform hover:scale-105"
        >
          Go home?
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
