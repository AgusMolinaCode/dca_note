import React from "react";
import { FlipWords } from "../ui/flip-words";

export function Hero() {
  const words = ["track", "analyze", "optimize", "grow"];

  return (
    <div className="h-[40rem] flex justify-center items-center px-4">
      <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
        Easily <FlipWords words={words} /> <br />
        your crypto investments with DCA-note
      </div>
    </div>
  );
}