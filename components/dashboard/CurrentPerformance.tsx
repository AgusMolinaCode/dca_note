import { TokenBCH, TokenBNB } from "@token-icons/react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import React from "react";

const CurrentPerformance = () => {
  return (
    <div className="bg-card text-card-foreground shadow-sm flex flex-col w-full">
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-lg font-semibold text-gray-500">Performance</h1>
        <p className="text-gray-500 text-md font-semibold">24h</p>
      </div>
      <div className="grid gap-2">
        <div className="bg-gray-700/90 w-full px-4 h-16 items-center rounded-xl flex gap-2 justify-between">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <TokenBNB variant="branded" className="w-16 h-16" />
              <ArrowUpCircle className="absolute bottom-1 left-9 w-6 h-6 text-green-500 p-[0.06rem] bg-black/90 rounded-full" />
            </div>
            <div>
              <p className="text-gray-500 text-md">Top Gainer</p>
              <p className="text-white font-semibold text-lg">BNB</p>
            </div>
          </div>
          <div>
            <p className="text-green-500 text-md font-semibold">$8.20</p>
            <p className="text-green-500 bg-red-500/20 text-md text-sm font-medium p-1 rounded-[0.45rem] mt-1">
              0.82%
            </p>
          </div>
        </div>
        <div className="bg-gray-700/90 w-full px-4 h-16 items-center rounded-xl flex gap-2 justify-between">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <TokenBCH variant="branded" className="w-16 h-16" />
              <ArrowDownCircle className="absolute bottom-1 left-9 w-6 h-6 text-red-500 p-[0.06rem] bg-black/90 rounded-full" />
            </div>
            <div>
              <p className="text-gray-500 text-md">Top Gainer</p>
              <p className="text-white font-semibold text-lg">BNB</p>
            </div>
          </div>
          <div>
            <p className="text-red-500 text-md font-semibold">-$8.20</p>
            <p className="text-red-500 bg-red-500/20 text-md text-sm font-medium p-1 rounded-[0.45rem] mt-1">
              -0.82%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPerformance;
