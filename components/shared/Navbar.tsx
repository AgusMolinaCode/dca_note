"use client";

import React, { useState, useEffect } from "react";
import { ModeToggle } from "../theme/Theme-Button";
import Image from "next/image";
import { TokenDESO } from "@token-icons/react";
import Link from "next/link";

const Navbar = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`flex justify-around items-center border-b py-2 fixed w-full z-30 ${
        scrollPosition > 50
          ? "dark:bg-black/80 bg-white/80 dark:border-gray-700 border-gray-300"
          : "dark:bg-black/40 bg-white/40 dark:border-gray-700 border-gray-300"
      }`}
    >
      <Link href="/">
        <div className="flex items-center">
          <TokenDESO
            size={50}
            variant="mono"
            className="dark:text-blue-300 text-blue-500"
          />
          <h1 className="dark:text-white text-black font-semibold text-2xl">
            DCA-Note
          </h1>
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <Link
          className="dark:hover:bg-gray-800 hover:bg-gray-200 px-2 py-1 duration-200 rounded-2xl"
          href="/dca"
        >
          Dashboard
        </Link>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
