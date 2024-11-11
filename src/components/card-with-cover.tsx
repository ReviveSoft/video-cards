"use client";
import { useState } from "react";
import { Button } from "./button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

interface cardInterface
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof CardVariants> {
  headerText: string;
  maskImage: string;
  videoFile: string;
  title: string;
  description: string;
  backgroundClass: string;
  buttonTextColor: string;
  sizeClasses?: string;
  buttonText: string;
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

const ProductCardWithCover = ({
  className,
  variant,
  size,
  headerText,
  maskImage,
  videoFile,
  title,
  description,
  backgroundClass,
  buttonTextColor,
  sizeClasses,
  buttonText,
  ...props
}: cardInterface) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={` rounded-3xl   ${
        !backgroundClass ? "bg-blue-500" : backgroundClass
      }  text-black ${
        !sizeClasses
          ? "min-w-80  max-w-96 min-h-[500px]"
          : sizeClasses
      } flex flex-col items-center content-center justify-between text-left`}
    >
      <div className=" text-sm font-thin  flex justify-start items-start w-full p-6 bg-transparent">
        {headerText}
      </div>
      <div
        className="parent-cover rs-parent-cover "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={cn(CardVariants({ variant }))}>
          <video
            hidden={!isHovered}
            className="video-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <img src={maskImage} hidden={isHovered} className="video-cover" />
        </div>
      </div>

      <div className="  text-black justify-start items-start w-full flex flex-col p-6 space-y-6 bg-transparent text-wrap">
        <div>
          <div className="font-extrabold text-xl uppercase">{title}</div>
          <div className="text-md font-thin text-wrap">{description}</div>
        </div>
        <div className="w-full flex justify-start mb-4">
          <Button
            {...props}
            className={`rounded-full ${
              buttonTextColor || "text-gray-200"
            } py-6 px-6 hover:bg-transparent border-2 border-transparent hover:text-black hover:border-black hover:border-2`}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ProductCardWithCover, CardVariants };
