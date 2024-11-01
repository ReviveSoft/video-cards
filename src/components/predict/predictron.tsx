"use client";
import React, { useState, useRef, useEffect } from "react";
import { Loader } from "lucide-react";
import { predictTextAction } from "../../actions/inputronActions";

type PredictiveTextProps = {
  name: string;
  onChange: (name: string, value: string) => void;
  loaderOptions?:{
    visible:boolean;
    className:string;
  }
  triggerInterval?:number;
};

type predictType = { data: { message?: string }; error?: string | null };

export default function PredictiveText({
  name,
  onChange,
  triggerInterval = 300,
  loaderOptions ={visible:true,className:""}
}: PredictiveTextProps) {
  const [userText, setUserText] = useState<string>("");
  const [predictedText, setPredictedText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [backup, setBackup] = useState<string[]>([]);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentEditableRef = useRef<HTMLSpanElement | null>(null);
  const requestIDRef = useRef<number>(0); // Keeps track of request ID

  let enterPressed = false;

  const fetchSuggestions = async (text: string) => {
    const requestID = ++requestIDRef.current; // Increment and store the request ID
    if (text.trim().length) {
      setLoading(true);

      const data: predictType = await predictTextAction({ text });
      console.log("data", data);

      if (data && requestID === requestIDRef.current) {
        // Ensure only the latest request is processed
        setBackup([...backup, userText]);
        setPredictedText(data.data.message || "");
      }

      setLoading(false);
    }
  };

  const isCursorAtEnd = () => {
    const selection = window.getSelection();
    return (
      selection?.anchorOffset === selection?.anchorNode?.textContent?.length
    );
  };

  const handleInput = (e: React.SyntheticEvent<HTMLSpanElement>) => {
    const newText = e.currentTarget.innerText;

    if (enterPressed && newText.endsWith("\n\n")) {
      // Remove the last newline character
      setUserText(newText.slice(0, -1));
      enterPressed = false;
    } else {
      setUserText(newText); // Update the user's input text
    }

    setPredictedText(""); // Clear the previous prediction

    if (isCursorAtEnd()) {
      clearTimeout(debounceTimeoutRef.current!);
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(newText);
      }, triggerInterval | 500); // Debounce the API call
    }
  };

  const focusContentEditable = () => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  };

  const setCursorToEnd = (element: HTMLElement) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false); // Collapse to the end
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const acceptSuggestion = () => {
    const contentEditableElement = contentEditableRef.current;
    if (predictedText) {
      const finalText = userText.trim()+' ' + predictedText.trim();
      setUserText(finalText);
      onChange(name, finalText);
      setPredictedText("");
      setTimeout(() => setCursorToEnd(contentEditableElement!), 0); // Ensure cursor moves to the end
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Tab") {
      event.preventDefault();
      acceptSuggestion();
    }

    if (event.key === "Enter") {
      enterPressed = true;
      setTimeout(() => {
        const contentEditableElement = contentEditableRef.current;
        const childNodes = Array.from(contentEditableElement!.childNodes);

        // Find the last <br> element and remove it
        for (let i = childNodes.length - 1; i >= 0; i--) {
          if (childNodes[i].nodeName === "BR") {
            contentEditableElement!.removeChild(childNodes[i]);
            break;
          }
        }

        // Insert a zero-width space to maintain layout
        const emptyTextNode = document.createTextNode("\u200B");
        contentEditableElement!.appendChild(emptyTextNode);

        setCursorToEnd(contentEditableElement!);
      }, 0);
    }

    if (event.key === "Escape") {
      console.log("Escape pressed");
      setPredictedText("");
      setUserText(userText);
    }
  };

  // Keep the contentEditable in sync with userText
  useEffect(() => {
    if (
      contentEditableRef.current &&
      contentEditableRef.current.innerText !== userText
    ) {
      contentEditableRef.current.innerText = userText;
    }
  }, [userText]);

  return (
    <div className="relative flex flex-col place-items-center place-content-center w-full">
      {loading && loaderOptions?.visible && (
        <div className="absolute top-[2px] right-[2px] animate-spin  text-blue-600 ">
          <Loader className="h-4 w-4" />
        </div>
      )} 

      <div
        onClick={focusContentEditable}
        className="p-4 shadow cursor-text rounded-lg text-left w-full h-36 mx-auto overflow-auto border-gray-300 border-[0.5px]"
      >
        <span
          autoFocus
          ref={contentEditableRef}
          className="border-0  text-md text-gray-800 outline-none"
          contentEditable={true}
          suppressContentEditableWarning={true}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
        ></span>

        <span
          className={`text-md text-gray-600 transition-opacity duration-500 ${
            predictedText ? "opacity-100" : "opacity-0"
          }`}
          contentEditable={false}
        >
          {predictedText && predictedText.length > 0 && (
            <>
              {predictedText}
              <span
                onClick={acceptSuggestion}
                className="border p-1.5 py-0.5 text-[10px] ml-1 inline-block w-fit rounded-md border-gray-300 cursor-pointer"
              >
                Tab
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
