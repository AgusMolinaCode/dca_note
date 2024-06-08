/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { FlipWords } from "../ui/flip-words";

export function Hero() {
  const words = ["track", "analyze", "optimize", "grow"];

  return (
    <div className="h-[50rem] flex flex-col justify-center items-center px-4">
      <div className="text-5xl max-w-4xl mx-auto text-center text-neutral-800 dark:text-neutral-300 font-semibold">
        Easily
        <FlipWords words={words} /> <br />
        your crypto investments with DCA-note
      </div>
      <p className="mt-8 max-w-3xl text-lg text-neutral-600 dark:text-neutral-400 text-center">
        DCA-note is a tool designed to give you control over your cryptocurrency
        investments. With live price tracking features, it provides insights on
        when it's best to buy or sell. Stay ahead of the market and optimize
        your investments with DCA-note.
      </p>
      <div className="flex justify-center gap-4 items-center mt-14">
        <button className="group rounded-xl relative inline-flex h-12 items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 font-medium text-neutral-200 transition hover:scale-110">
          <span>Dashboard</span>
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
            <div className="relative h-full w-8 bg-white/20"></div>
          </div>
        </button>
        <button className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 font-medium text-neutral-200 transition hover:scale-110">
          <span>Calculator</span>
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
            <div className="relative h-full w-8 bg-white/20"></div>
          </div>
        </button>
      </div>
    </div>
  );
}
