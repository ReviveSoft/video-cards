"use client";
import "../../styles/tailwind.css";
import { useState } from "react";
import { TextareaTronButton } from "./textarea-tron-button";
import { enhanceAction } from "../../actions/inputronActions";

import * as React from "react";
import { cn } from "../../lib/utils";
import { EnhanceAPIPayloadType ,ButtonConfigType} from "../../types";



interface TextareaTronProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  customOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  prompt?: string;
  value: string;
  labelConfig?: {
    content?: string;
    visible?: boolean;
    style?: string;
    justify?: string;
  };
  setTextValue: (value: string) => void;
  buttonConfiguration?: ButtonConfigType;
}

const TextareaTron =  (
    {
      customOnChange,
      setTextValue,
      labelConfig,
      buttonConfiguration,
      prompt,
      className,
      ...props
    }:TextareaTronProps
  ) => {
    const { name, value } = props;
    // console.log("textarea tron was called", name);
    const [backup, setBackup] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>("");

    const handleKeyboardCommands = (
      event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      // handle enter key
      if (event.key === "Enter") {
        event.preventDefault();
        handleEnhance({ spiceitup: true, prompt: prompt });
      }

      // handle tab key
      if (event.key === "Tab") {
        event.preventDefault();
        handleEnhance({ spiceitup: true, prompt: prompt });
      }
      // handle control z
      if (event.key === "z" && event.ctrlKey) {
        event.preventDefault();
        // Perform the undo operation
        setBackup(backup.slice(0, -1));
        if (name) {
          setTextValue(backup[backup.length - 1] || "");
        }
      }
    };

    const handleEnhance = async ({
      spiceitup,
      number_of_lines,
      prompt,
    }: {
      spiceitup?: boolean;
      number_of_lines?: string;
      spiceitUp?: string;
      prompt?: string;
    }) => {
      // console.log("handle enhance was called");
      setError("");
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 200));
      try {
        const payload: EnhanceAPIPayloadType = {
          inputText: value || "",
          promptOverride: prompt || "",
          user: "Inputron.com",
          spiceitup: spiceitup || true,
          number_of_lines: number_of_lines || "one",
        };
        console.log("payload 2", payload);
        const data = await enhanceAction(payload);

        if (data.error && data.error !== "") {
          console.log("error", data.error);
          setError(data.error);
          setLoading(false);
          return;
        }

        if (data) {
          setBackup([...backup, value]);
        }

        if (name) {
          setTextValue((data && data.data.message) || "");
        }
        setLoading(false);
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        console.log("error", error);
        setLoading(false);
        setError("error connecting to server");
      }
    };

    return (
      <>
        {labelConfig && labelConfig.visible && (
          <label htmlFor={name} className={labelConfig?.style}>
            {labelConfig?.content || "Your text"}
          </label>
        )}
        <textarea
          
          name={name}
          onKeyDown={handleKeyboardCommands}
          onChange={async (e) => {
            if (customOnChange) {
              await customOnChange(e);
            } else {
              setTextValue(e.target.value);
            }
          }}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          // ref={ref}
          {...props}
        />

        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
        <div
          className={cn(
            "flex justify-start",
            buttonConfiguration?.justify === "left"
              ? "justify-start"
              : "justify-end"
          )}
          onClick={async () => {
            handleEnhance({ spiceitup: true, prompt: prompt });
          }}
        >
          <TextareaTronButton
            btnConfig={buttonConfiguration}
            loading={loading}
          />
        </div>
      </>
    );
  }






// interface TextareaTronProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
//   customOnChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
//   prompt?: string;
//   value: string;
//   labelConfig?: {
//     content?: string;
//     visible?: boolean;
//     style?: string;
//     justify?: string;
//   };
//   setTextValue: (value: string) => void;
//   buttonConfiguration?: ButtonConfigType;
// }

// const TextareaTron = React.forwardRef(
//   (
//     {
//       customOnChange,
//       setTextValue,
//       labelConfig,
//       buttonConfiguration,
//       prompt,
//       className,
//       ...props
//     }:TextareaTronProps,
//     ref: React.ForwardedRef<TextareaTronProps>
//   ) => {
//     const { name, value } = props;
//     // console.log("textarea tron was called", name);
//     const [backup, setBackup] = useState<string[]>([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>("");

//     const handleKeyboardCommands = (
//       event: React.KeyboardEvent<HTMLTextAreaElement>
//     ) => {
//       // handle enter key
//       if (event.key === "Enter") {
//         event.preventDefault();
//         handleEnhance({ spiceitup: true, prompt: prompt });
//       }

//       // handle tab key
//       if (event.key === "Tab") {
//         event.preventDefault();
//         handleEnhance({ spiceitup: true, prompt: prompt });
//       }
//       // handle control z
//       if (event.key === "z" && event.ctrlKey) {
//         event.preventDefault();
//         // Perform the undo operation
//         setBackup(backup.slice(0, -1));
//         if (name) {
//           setTextValue(backup[backup.length - 1] || "");
//         }
//       }
//     };

//     const handleEnhance = async ({
//       spiceitup,
//       number_of_lines,
//       prompt,
//     }: {
//       spiceitup?: boolean;
//       number_of_lines?: string;
//       spiceitUp?: string;
//       prompt?: string;
//     }) => {
//       // console.log("handle enhance was called");
//       setError("");
//       setLoading(true);
//       await new Promise((resolve) => setTimeout(resolve, 200));
//       try {
//         const payload: EnhanceAPIPayloadType = {
//           inputText: value || "",
//           promptOverride: prompt || "",
//           user: "Inputron.com",
//           spiceitup: spiceitup || true,
//           number_of_lines: number_of_lines || "one",
//         };
//         console.log("payload 2", payload);
//         const data = await enhanceAction(payload);

//         if (data.error && data.error !== "") {
//           console.log("error", data.error);
//           setError(data.error);
//           setLoading(false);
//           return;
//         }

//         if (data) {
//           setBackup([...backup, value]);
//         }

//         if (name) {
//           setTextValue((data && data.data.message) || "");
//         }
//         setLoading(false);
//       } catch (error: unknown) {
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         console.log("error", error);
//         setLoading(false);
//         setError("error connecting to server");
//       }
//     };

//     return (
//       <>
//         {labelConfig && labelConfig.visible && (
//           <label htmlFor={name} className={labelConfig?.style}>
//             {labelConfig?.content || "Your text"}
//           </label>
//         )}
//         <textarea
          
//           name={name}
//           onKeyDown={handleKeyboardCommands}
//           onChange={async (e) => {
//             if (customOnChange) {
//               await customOnChange(e);
//             } else {
//               setTextValue(e.target.value);
//             }
//           }}
//           className={cn(
//             "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
//             className
//           )}
//           // ref={ref}
//           {...props}
//         />

//         {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
//         <div
//           className={cn(
//             "flex justify-start",
//             buttonConfiguration?.justify === "left"
//               ? "justify-start"
//               : "justify-end"
//           )}
//           onClick={async () => {
//             handleEnhance({ spiceitup: true, prompt: prompt });
//           }}
//         >
//           <TextareaTronButton
//             btnConfig={buttonConfiguration}
//             loading={loading}
//           />
//         </div>
//       </>
//     );
//   }
// );

// TextareaTron.displayName = "TextareaTron";

export { TextareaTron };
