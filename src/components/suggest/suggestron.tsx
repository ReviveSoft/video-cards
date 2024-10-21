"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { suggestionAction } from "../../actions/inputronActions";
import { cn } from "../../lib/utils";


// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SuggestronProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prompt: string;
  label?: string;
  useInput?: boolean;
  name: string;
  value?: string | number;
  minCharacterCountTrigger?: number;
  error?: boolean;
  suggestionStyle?: string;
}

interface Suggestion {
  id: string;
  value: string;
}

const SuggesTron = React.forwardRef<HTMLInputElement, SuggestronProps>(
  (
    {
      minCharacterCountTrigger = 2,
      useInput,
      prompt,
      name,
      className,
      type,
      ...props
    }: SuggestronProps,
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [selectedSuggestion, setSelectedSuggestion] =
      useState<Suggestion | null>(null);

    // console.log("validations", validations);
    const generateMultipleSuggestions = async (query: string) => {
      setLoading(true);
      console.log("handle rewrite was called");
      const data = await suggestionAction({ list: query || "" });
      console.log("data", data);
      setLoading(false);
      return data;
    };

    useEffect(() => {
      if (useInput) {
        if (inputValue.length > minCharacterCountTrigger) {
          console.log("fetching suggestions...");
          setLoading(true);
          fetchSuggestions(inputValue);
        } else {
          setSuggestions([]);
        }
      } else {
        // console.log('fetching suggestions...');
        fetchSuggestions(prompt + "that start or contain  " + inputValue);
      }
    }, [inputValue]);

    const fetchSuggestions = async (query: string) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response: any = await generateMultipleSuggestions(query);
        setSuggestions(response.data.list);
      } catch (error) {
        console.log("Error fetching suggestions:", error);
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      // onChange(name, e.target.value);

      // ref.value = inputValue;
    };

    const handleMouseOver = () => {
      setShowSuggestion(true);
    };
    const handleSuggestionClick = (suggestion: Suggestion) => {
      console.log("suggestion clicked:", suggestion);

      setShowSuggestion(false);
      setSuggestions([]);
      setSelectedSuggestion(suggestion);
      console.log("selected suggestion:", selectedSuggestion);
      setInputValue(suggestion.value);
      // onChange(name, suggestion.value);
    };

    return (
      <>
        <label htmlFor="autocomplete p-2">{props.label}</label>

        <div className="flex flex-row ">
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
            name={name}
            value={inputValue}
            onClickCapture={handleMouseOver}
           onChange={handleInputChange}
          />
          {loading && (
            <div className=" animate-spin text-blue-400 h-6 w-6">
              <Loader2 />
            </div>
          )}
        </div>

        <ul className="">
          {/* <p>{inputValue}</p>  */}
          {showSuggestion &&
            suggestions &&
            suggestions.length > 0 &&
            suggestions.map((suggestion) => (
              <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-100 bg-gray-100 z-10"
                key={suggestion.id}
                // onSelect={test}

                // onMouseOver={test}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className=""> {suggestion.value} </div>
              </li>
            ))}
        </ul>
      </>
    );
  }
);
SuggesTron.displayName = "Suggestron";

export { SuggesTron };
