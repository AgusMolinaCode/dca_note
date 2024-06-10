/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import { TracingBeam } from "../ui/tracing-beam.tsx";

export function TracingBeamDemo() {
  return (
    <TracingBeam className="px-6">
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        {content.map((item, index) => (
          <div key={`content-${index}`} className="mb-10">
            <h2 className="bg-black text-white rounded-full text-sm w-fit px-4 py-1 mb-4">
              {item.badge}
            </h2>

            <p className={twMerge("text-xl mb-4")}>{item.title}</p>

            <div className="text-sm prose prose-sm dark:prose-invert">
              {item?.image && (
                <Image
                  src={item.image}
                  alt="blog thumbnail"
                  height="1000"
                  width="1000"
                  className="rounded-lg mb-10 object-cover"
                />
              )}
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </TracingBeam>
  );
}

const content = [
  {
    title: "Hello, DCA!",
    description: (
      <>
        <p>
          Ever heard of Dollar Cost Averaging? No? Imagine it as a financial superhero, swooping in to save the day! It's your trusty sidekick in the wild, wild west of the crypto market. It's not about having the fastest horse to win the race, it's about staying steady and consistent. Let's saddle up and explore this together!
        </p>
      </>
    ),
    badge: "DCA Introduction",
    image: "/images/DCA3.avif",
  },
  {
    title: "DCA's Superpower",
    description: (
      <>
        <p>
          So, what's DCA's superpower? It's simplicity! Instead of trying to outdraw the market in a high-noon showdown, you invest a fixed amount regularly. It's like setting a financial cruise control. Imagine you're on a road trip through the wild west, you wouldn't want to go all out only to run out of steam halfway, right? Same with investing, steady wins the race!
        </p>
      </>
    ),
    badge: "DCA Superpower",
    image: "/images/DCA4.avif",
  },
  {
    title: "Why DCA for Crypto?",
    description: (
      <>
        <p>
          Now, why would you want to use DCA for crypto? Well, crypto markets can be as unpredictable as a rodeo bull. One minute you're riding high, the next you're thrown off balance. DCA is like your financial rodeo clown, distracting the bull while you get back on your feet. It smooths out the highs and lows, reducing the risk and stress. Yeehaw!
        </p>
      </>
    ),
    badge: "DCA for Crypto",
    image: "/images/DCA5.avif",
  },
  {
    title: "Ready to start DCA?",
    description: (
      <>
        <p>
          With DCA, you can navigate the crypto market with more confidence and less stress. It's like having a trusty map for your wild west adventure. Ready to start your DCA journey? Buckle up, grab your cowboy hat, and let's hit the trail!
        </p>
      </>
    ),
    badge: "Start DCA",
    image: "/images/DCA6.avif",
  },
];