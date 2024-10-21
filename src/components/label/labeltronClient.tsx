"use client";
import { useEffect, useState } from "react";
import { Languages } from "lucide-react";
import * as Label from "@radix-ui/react-label";

interface LabelTronTypeClient extends React.HTMLAttributes<HTMLLabelElement> {
  data: string[];
  interval: number;
  languages:string [];
  icon?:{
    className?: string;
    visible?: boolean;
    iconElement? : React.ReactNode;
  }
}

export default function LabelTronClient({
  data,
  interval = 1500,
  icon,
  ...props
}: LabelTronTypeClient) {
  console.log("LabelTronClient data =>", data);
  const [value, setValue] = useState(data[0]);
  const [translatedValues] = useState(data);
  const [translating, setTranslating] = useState(false);

  const [isRunning, setIsRunning] = useState(false);

  const handleMouseOver = () => {
    setTranslating(true);
  };

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    const end = translatedValues.length - 1;
    let z = 1;
    if (isRunning) {
      setValue(translatedValues[1]);
      intervalId = setInterval(() => {
        setValue(translatedValues[1 + z]);
        console.log("Running...");
        if (z <= end) z = z + 1;
        if (z === end) z = -1;

        // Check for conditions to stop the loop
        if (!translating) {
          setIsRunning(false);
        }
      }, interval); // controls the length of the loop in milliseconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning]); // Only re-run the effect if isRunning changes

  useEffect(() => {
    setIsRunning(translating);
    if (!translating) {
      setValue(translatedValues[0]);
    }
  }, [translating, translatedValues]);

  const handleMouseLeave = () => {
    setTranslating(false);
  };

  return (
    <Label.Root
      {...props}
      onMouseEnter={() => handleMouseOver()}
      onMouseLeave={() => handleMouseLeave()}
      {...props}
    >
      {" "}
      <div className="flex flex-row items-center">
        <span className={props.className}>{value}</span>
        {translating && (
          <span className={icon?.className}>
            { icon?.visible &&  (icon?.iconElement || <Languages className="h-3 animate-ping" />)}
          </span>
        )}
      </div>
    </Label.Root>
  );
}
