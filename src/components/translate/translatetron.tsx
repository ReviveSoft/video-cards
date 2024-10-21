"use client";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { translateAction } from "../../actions/inputronActions";

interface Translate {
  id: string;
  value: string;
  language: string;
}

type TranslationProps = {
  useInput?: boolean;
  name: string;
  value?: string | number;
  placeholder?: string;
  label?: string;
  minCharacterCountTrigger?: number;
  minLanguagesNumberTrigger?: number;
  maxCharacterLimit?: number;
  error?: boolean;
  disabled?: boolean;
  type?: "input" | "textarea" | "select";
  template?: string | undefined;
  languages?: string[];
  validations?: string | undefined;
  onChange: (name: string, value: string) => void;
  style?: string;
  TranslationStyle?: string;
};

export default function TranslateTron({
  label,
  name,
  minCharacterCountTrigger = 2,
  minLanguagesNumberTrigger = 1,
  maxCharacterLimit = 200,
  style,
}: TranslationProps) {
  const [inputValue, setInputValue] = useState("");
  const [languagesValue, setLanguagesValue] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState<Translate[]>([]);

  const generateMultipleSuggestions = async (
    text: string,
    languages: string[]
  ) => {
    setLoading(true);
    try {
      const data = await translateAction({ text, languages });

      if (data && data.data && Array.isArray(data.data.list)) {
        return data.data.list.map((item: Translate) => ({
          id: item.id.toString(),
          value: item.value,
          language: item.language,
        }));
      } else {
        console.error("Invalid API response structure:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "Enter" &&
        inputValue.length > minCharacterCountTrigger &&
        languagesValue.length >= minLanguagesNumberTrigger
      ) {
        fetchTranslations(inputValue, languagesValue);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputValue, languagesValue]);

  const fetchTranslations = async (text: string, languages: string[]) => {
    const response = await generateMultipleSuggestions(text, languages);
    setTranslations(response); // Set the fetched translations
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxCharacterLimit) {
      setInputValue(e.target.value);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguages = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setLanguagesValue(selectedLanguages);
  };

  return (
    <div className="w-full bg-white p-4">
      <label htmlFor="autocomplete" className="p-2 text-lg font-semibold">
        {label}
      </label>
      <div className="flex flex-col">
        <input
          className={
            style ||
            "w-full border-2 rounded p-2 text-sm text-gray-900 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:text-white dark:placeholder-gray-400"
          }
          name={name}
          id="autocomplete"
          value={inputValue}
          onChange={handleInputChange}
          maxLength={maxCharacterLimit}
          placeholder="Type text here..."
        />
        <div className="text-right text-sm text-gray-500">
          {inputValue.length}/{maxCharacterLimit} characters
        </div>

        <select
          multiple
          value={languagesValue}
          onChange={handleLanguageChange}
          className="mt-2 p-2 border-2 rounded bg-gray-100 text-gray-800"
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
        </select>
        {loading && (
          <div className="animate-spin text-blue-400 h-6 w-6 mt-2">
            <Loader2 />
          </div>
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {translations &&
          translations.length > 0 &&
          translations.map((translation) => (
            <li
              key={translation.id}
              className="px-4 py-2 bg-blue-50 border-l-4 border-blue-400 shadow rounded"
            >
              <strong className="text-blue-600">{translation.language}:</strong>{" "}
              {translation.value}
            </li>
          ))}
      </ul>
    </div>
  );
}
