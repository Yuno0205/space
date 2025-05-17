"use client";

import Image, { ImageProps } from "next/image";

interface PlaceholderImageProps extends Omit<ImageProps, "src" | "onError" | "alt"> {
  alt?: string; // alt vẫn nên có, nhưng có thể là mặc định
  placeholderSrc?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  alt = "Placeholder Image", // Alt mặc định
  placeholderSrc = "/assets/images/placeholder.svg", // Đường dẫn mặc định
  ...rest // Bao gồm width, height, className, style, fill, etc.
}) => {
  return (
    <Image
      src={placeholderSrc}
      alt={alt}
      {...rest} // Truyền các props còn lại
    />
  );
};

export { PlaceholderImage };
