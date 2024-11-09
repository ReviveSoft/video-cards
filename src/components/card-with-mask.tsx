'use client'
import {useState } from 'react';
import { Button } from "./button";
export default function ProductCard ({
  headerText,
  maskImage,
  videoFile,
  title,
  description,
  backgroundClass,
  maskName,
}: {
  headerText: string;
  maskImage: string;
  videoFile: string;
  title: string;
  description: string;
  backgroundClass: string;
  maskName: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`rounded-3xl ${backgroundClass}  text-black min-w-80 max-w-[300px] min-h-[500px]
       flex flex-col items-center content-center justify-start`}
    >
      <div className=" text-sm font-thin  flex justify-start items-start w-full p-6 bg-transparent">
        {headerText}
      </div>
      <div
        className="bg-transparent p-6  "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-60 w-60">
          <video
            hidden={!isHovered}
            className={`${maskName} inset-0 h-60 w-60 object-cover`}
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <img
            src={maskImage}
            alt="Camera Mask"
            hidden={isHovered}
            className={`h-full ${maskName} bg-white w-full `}
          />
        </div>
      </div>

      <div className="  text-black justify-start items-start w-full flex flex-col p-6 space-y-4 bg-transparent">
        <div>
          <div className="font-extrabold text-xl uppercase">{title}</div>
          <div className="text-md font-thin">{description}</div>
        </div>
        <div className="w-full flex justify-start mb-4">
          <Button className="rounded-full text-gray-200 py-5 hover:bg-transparent hover:text-black hover:border-black hover:border-2">
            GET STARTED
          </Button>
        </div>
      </div>
    </div>
  );
};
