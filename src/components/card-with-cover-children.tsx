"use client";
// import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

interface cardInterface
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof CardVariants> {
  headerText: string;
  maskImage: string;
  videoFile: string;
  backgroundClass: string;
  enableAutoPlay: boolean;
  sizeClasses: string;
  children: React.ReactNode;
}

const CardVariants = cva("", {
  variants: {
    variant: {
      star: "rs-star-cover",
      circle: "rs-circle-cover",
      chat: "rs-chat-cover",
      cloud: "rs-cloud-cover",
      heart: "rs-heart-cover",
      mellow: "rs-mellow-cover",
      diamond: "rs-diamond-cover",
      flower: "rs-flower-cover",
      hexagon: "rs-hexagon-cover",
      door: "rs-door-cover",
      pill: "rs-pill-cover",
      pillRight: "rs-pill-right-cover",
      saw: "rs-saw-cover",
      square: "rs-square-cover",
      house: "rs-house-cover",
      default: "rs-circle-cover",
    },
    size: {
      default: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const ProductCardWithChildren = ({
  className,
  variant,
  size,
  headerText,
  maskImage,
  enableAutoPlay,
  videoFile,
  backgroundClass,
  sizeClasses,
  children,
  ...props
}: cardInterface) => {
  // const [isHovered, setIsHovered] = useState(enableAutoPlay);

  return (
    <div
      className={` rounded-3xl   ${
        !backgroundClass ? "bg-blue-500" : backgroundClass
      }  text-black ${
        !sizeClasses
          ? "min-w-80  max-w-96 min-h-[400px]"
          : sizeClasses
      } flex flex-col items-center content-center justify-between text-left`}  {...props}
    >
      <div className=" text-sm font-thin  flex justify-start items-start w-full p-6 bg-transparent">
        {headerText}
      </div>
      <div
        className="parent-cover rs-parent-cover "
       
      >
        <div className={cn(CardVariants({ variant }))}>
          <video
            hidden={false}
            className="video-cover"
            autoPlay ={enableAutoPlay}
            loop
            muted
            playsInline
          >
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <img src={maskImage} hidden={enableAutoPlay} className="video-cover" />
        </div>
      </div>

  
      {children }
    </div>
  );
};

export { ProductCardWithChildren, CardVariants };
