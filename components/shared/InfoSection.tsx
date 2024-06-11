import React from "react";
import BlurIn from "../ui/blur-in";
import { TracingBeamDemo } from "./TracingBeamDemo";
import  InfiniteMovingCardsDemo  from "./MarqueeDemo"; 


const InfoSection = () => {
  return (
    <div>
      <BlurIn
        word="What is Dollar Cost Averaging ?"
        className="font-bold text-gray-800 dark:text-gray-300 pb-4"
      />
      <TracingBeamDemo />
    </div>
  );
};

export default InfoSection;
