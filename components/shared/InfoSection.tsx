import React from "react";
import BlurIn from "../ui/blur-in";
import { StickyScrollRevealDemo } from "./StickyScrollRevealDemo";

const InfoSection = () => {
  return (
    <div>
      <BlurIn
        word="What is Dollar Cost Averaging"
        className="font-bold text-gray-800 dark:text-gray-300 py-4"
      />
      <StickyScrollRevealDemo />
    </div>
  );
};

export default InfoSection;
