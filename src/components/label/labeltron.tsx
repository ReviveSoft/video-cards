"use client";
import LabelTronClient from "./labeltronClient";
import { useEffect, useState } from "react";
import { translateAction } from "../../actions/inputronActions";

interface LabelTronType extends React.HTMLAttributes<HTMLLabelElement> {
  children: string;
  interval: number;
  languages: string[];
  icon?: {
    className?: string;
    visible?: boolean;
    iconElement?: React.ReactNode;
  };
}
const LabelTron =  ({
  children,
  interval,
  icon,
  languages,
  ...props
}: LabelTronType) => {
  console.log("children", children);

  const [translatedData, setTranslatedData] = useState<string[]>();
  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  console.log(loading);
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { error, data } = await translateAction({
        text: children,
        languages: languages,
      });
      if (error) {
        console.log("error", error);
        setError("error occured");
      }
      console.log("translated", data.list);
      const translatedData = [
        children,
        ...data.list.map(
          (item: { id: string; value: string; languange: string }) => item.value
        ),
      ];
      console.log("translatedData", translatedData);
      setTranslatedData(translatedData);
    };

    getData();
  }, []);

  return (
    <>
      {error && <div>{error}</div>}
      {translatedData && (
        <>
          <LabelTronClient
            icon={icon}
            data={translatedData}
            interval={interval}
            languages={languages}
            {...props}
          />
        </>
      )}
    </>
  );
};

export { LabelTron };
