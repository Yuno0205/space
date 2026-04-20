// components/MyLottieAnimation.tsx
import React from "react";
import Lottie, { LottieComponentProps } from "lottie-react"; // Import LottieComponentProps nếu cần
import animationData from "@/public/animations/spaceship.json";

interface MyLottieAnimationProps {
  width?: string | number;
  height?: string | number;
  loop?: LottieComponentProps["loop"];
  autoplay?: LottieComponentProps["autoplay"];
}

const MyLottieAnimation: React.FC<MyLottieAnimationProps> = ({
  width = 300,
  height = 300,
  loop = true,
  autoplay = true,
}) => {
  const style = {
    width,
    height,
  };

  return (
    <Lottie
      animationData={animationData}
      style={style}
      loop={loop}
      autoplay={autoplay}
      // Các props khác:
      // onComplete={() => console.log('Animation completed in TS!')}
    />
  );
};

export default MyLottieAnimation;
