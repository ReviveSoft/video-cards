'use client';
import { useState, useCallback, useEffect } from "react";
import * as React from "react";
import { cn } from "../../lib/utils";
import { selectronAction } from "../../actions/inputronActions";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

type SelectronType = {
  value: string;
  id: string;
};

type SelectronResponseType = {
  data?: {
    list: Array<
      Array<
        | {
            value: string;
            id: string;
          }
        | string
      >
    >;
  };
  error?: string;
  message?: string;
};



interface selectronProps extends React.InputHTMLAttributes<HTMLSelectElement> { 
  prompt: string;
  title: string;
  onValueChange: (value: string) => void;
};


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const Selectron = ({onValueChange,prompt,title,...props}:selectronProps) => {
  const [data, setData] = useState<SelectronResponseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    console.log("fetching data");
    try {
      const data: SelectronResponseType = await selectronAction({
        list: prompt,
      });
      setData(data);
      setLoading(false);
    } catch (err: unknown) {
      console.error(err as string);
      setLoading(false);
    }
  }, []);



  useEffect(() => {
    fetchData();
  }, []);

  if (data && data.message) {
    return <div className="text-red-500">{data.message}</div>;
  }

  if (data && data.error) {
    return <div className="text-red-500">{data.error}</div>;
  }

  if (loading) {
    return <div className="text-muted-foreground  flex flex-row items-center"><Loader className="animate-spin h-4 text-blue-600 ml-2" /> loading...</div>;
  }
  if (data?.data) {
    const selection = data.data?.list;

    return (
      <Select onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            props.style
          )}
        >
          <SelectValue placeholder={title} />
        </SelectTrigger>
        <SelectContent>
          {selection &&
            selection
              .filter((item): item is any => typeof item !== "string")
              .map((item: SelectronType) => {
                return (
                  <SelectItem key={item.id} value={item.value} className="bg-white">
                    {item.value}
                  </SelectItem>
                );
              })}
        </SelectContent>
      </Select>
    );
  }
};

export default Selectron;



