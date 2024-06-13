/* eslint-disable react/no-unescaped-entities */
import React from "react";
import BlurIn from "../ui/blur-in";
import { TracingBeamDemo } from "./TracingBeamDemo";
import InfiniteMovingCardsDemo from "./MarqueeDemo";
import Link from "next/link";

const InfoSection = () => {
  return (
    <div>
      <BlurIn
        word="What is Dollar Cost Averaging ?"
        className="font-bold text-gray-800 dark:text-gray-300 pb-4"
      />
      <TracingBeamDemo />
      <BlurIn
        word="Ready to Take Control of Your DCA Investments?"
        className="font-bold text-gray-800 dark:text-gray-300 pb-4 pt-24"
      />
      <p className="text-center max-w-2xl flex justify-center mx-auto text-neutral-600 dark:text-neutral-400 font-normal text-lg">
        In the dashboard, you'll find tools to load your purchased cryptos, view
        the price at which you bought them, see the current price, and even
        delete them if necessary.
      </p>
      <Link href="/dashboard">
        <button className="group rounded-xl relative mt-10 flex h-12 mx-auto items-center justify-center overflow-hidden bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 font-medium text-neutral-200 transition hover:scale-110">
          <span>Dashboard</span>
          <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
            <div className="relative h-full w-8 bg-white/20"></div>
          </div>
        </button>
      </Link>
    </div>
  );
};

export default InfoSection;
