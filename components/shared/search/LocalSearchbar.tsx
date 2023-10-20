"use client"

import React from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";

interface CustomInpurProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

// though similar to GlobalSearchbar but possess different interactivity
const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInpurProps) => {
  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}

      <Input
        type="text"
        placeholder={placeholder}
        // value=""
        onChange={() => {}}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient border-none shadow-none outline-none"
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;