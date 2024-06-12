"use client";

import { TokenDESO } from "@token-icons/react";
import Link from "next/link";
import React from "react";
import { Linkedin,Github } from "lucide-react";

const Footer = () => {
  return (
    <div className="dark:bg-stone-900/50 w-full max-w-[1100px] h-[3rem] lg:h-[5rem] items-center absolute bottom-1 lg:bottom-5 z-30 flex justify-between mx-auto px-4 mb-7 rounded-full border dark:border-gray-600 border-gray-300">
      <div>
        <Link href="/">
          <div className="flex items-center">
            <TokenDESO
              size={50}
              variant="mono"
              className="dark:text-blue-300 text-blue-500"
            />
            <h1 className="text-neutral-600 dark:text-neutral-400 font-semibold text-2xl">
              DCA-Note
            </h1>
          </div>
        </Link>
      </div>
      <div className="flex gap-2">
        <Linkedin size={32} className="text-neutral-600 dark:text-neutral-400" />
        <Github size={32} className="text-neutral-600 dark:text-neutral-400" />
      </div>
    </div>
  );
};

export default Footer;