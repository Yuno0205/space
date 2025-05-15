"use client";

import { AnimatePresence, motion } from "framer-motion"; // Import Framer Motion
import Lottie, { LottieComponentProps } from "lottie-react";
// Đảm bảo bạn đã xóa nền của file spaceship.json này thủ công
import spaceshipAnimationData from "@/public/animations/spaceship.json"; // Đường dẫn tới file JSON

const LoadingSpinner = () => {
  // Lottie options, sử dụng trực tiếp animation data
  const lottieOptions: LottieComponentProps = {
    animationData: spaceshipAnimationData, // Sử dụng trực tiếp, giả sử nền đã được xóa
    loop: true,
    autoplay: true,
  };

  // Framer Motion variants cho Lottie (tàu vũ trụ)
  const spaceshipVariants = {
    initial: { y: 0, opacity: 0.8 },
    animate: {
      y: [-5, 5, -5], // Di chuyển nhẹ lên xuống
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

  // Framer Motion variants cho text
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
          // Tailwind classes cho container của Lottie
          className="w-48 h-48 md:w-52 md:h-52 mb-8" // Kích thước có thể điều chỉnh, ví dụ w-48 h-48
          variants={spaceshipVariants}
          initial="initial"
          animate="animate"
        >
          <Lottie {...lottieOptions} style={{ width: "100%", height: "100%" }} />
        </motion.div>

        <motion.p
          // Tailwind classes cho text
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
