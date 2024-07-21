import { PlusCircle } from "lucide-react";
import React from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`
);

const CurrentNotes = () => {
  const truncateText = (text: string, length: number) => {
    return text.length > length ? text.substring(0, length) + "..." : text;
  };
  return (
    <div className="bg-card text-card-foreground shadow-sm flex flex-col w-full">
      <div className="flex justify-between items-center pb-2">
        <h1 className="text-lg font-semibold text-gray-500">Notes</h1>
        <PlusCircle className="w-6 h-6 text-blue-400" />
      </div>
      <ScrollArea className="h-[24rem]">
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="bg-gray-700/90 px-2 py-1 rounded-xl">
          <div className="flex justify-between items-center border-b border-gray-400">
            <p className="text-md text-white">Buy BTC al 59k</p>
            <p className="text-xs text-gray-500">10/07/2024 10:30am</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {truncateText(
                "When BTC hits 59k, buy as much as you can afford. RSI is at 30, so it&apos;s a good time to buy and hold. remember to set a stop loss at 55k. then sell at 70k.",
                100
              )}
            </p>
          </div>
        </div>
        <Separator className="my-1" />
      </ScrollArea>
    </div>
  );
};

export default CurrentNotes;
