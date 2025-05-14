"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { motion } from "framer-motion";

export default function SpaceLoading() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-white">
      {/* Modern grid background */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[linear-gradient(#000_1px,transparent_1px),linear-gradient(90deg,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* Lottie Animation */}
      <div className="absolute left-1/2 top-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 transform">
        <DotLottieReact src="/animations/spaceship.json" loop autoplay />
      </div>

      {/* Loading text and progress */}
      <div className="absolute bottom-20 left-0 right-0 z-10 flex flex-col items-center justify-center">
        <motion.h1
          className="mb-6 text-4xl font-bold text-black"
          animate={{
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          LOADING
        </motion.h1>
      </div>

      {/* Decorative lines */}
      <motion.div
        className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-gray-300 to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-gray-300 to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          delay: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
