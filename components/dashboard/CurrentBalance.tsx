import React from "react";
import { InfoIcon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const data = [
  {
    title: "Total Profit",
    value: "$ 100,000.00",
    hoverContent: "It shows the total profit of the user.",
    classNameValue: "text-green-500",
    classNameTitle: "border-b",
  },
  {
    title: "Realized Profit",
    value: "$ 100,000.00",
    hoverContent: "This shows how much profit has been realized by the user.",
    classNameValue: "text-red-500",
    classNameTitle: "border-b",

  },
  {
    title: "Unrealized Profit",
    value: "$ 100,000.00",
    hoverContent: "This shows how much profit has been unrealized by the user.",
    classNameValue: "text-green-500",
    classNameTitle: "border-b",

  },
  {
    title: "Total Invested",
    value: "$ 100,000.00",
    hoverContent: "It shows the total profit of the user.",
    classNameValue: "text-gray-200",
    classNameTitle: "border-none",

  },
];

const CurrentBalance = () => {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-500">Current Balance</h1>
        <p className="font-semibold dark:text-gray-300 text-gray-800">24h</p>
      </div>
      <div>
        <p className="text-4xl font-semibold pt-4">$ 100,000.00</p>
        <div className="pt-2 flex justify-start gap-2">
          <p>
            <span className="text-green-500 text-lg font-medium bg-green-500/20 px-3 py-1 rounded-[0.45rem]">
              0.11%
            </span>
          </p>
          <p className="text-green-500 text-lg font-medium">$ 100.00</p>
        </div>
      </div>
      <div className="pt-4">
        {data.map((item) => (
          <div
            key={item.title}
            className={`${item.classNameTitle} dark:border-gray-700 border-gray-400 flex justify-between items-center gap-2`}
          >
            <div className="flex gap-2 items-center">
              <p className="font-semibold text-gray-500 text-[16px] py-2">
                {item.title}
              </p>
              <HoverCard openDelay={200}>
                <HoverCardTrigger>
                  <InfoIcon className="text-gray-500" size={12} />
                </HoverCardTrigger>
                <HoverCardContent className="text-gray-400">
                  {item.hoverContent}
                </HoverCardContent>
              </HoverCard>
            </div>
            <div>
              <p className={`font-semibold ${item.classNameValue} text-[14px] py-2`}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentBalance;
