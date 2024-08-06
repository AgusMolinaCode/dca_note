import React from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../../ui/hover-card";
import { InfoIcon } from "lucide-react";

const CurrentBalanceItem = ({ title = "", description = "", value = "", classNameValue ="" }) => {
  return (
    <div>
      <div
        className={`dark:border-gray-700 border-gray-400 flex justify-between items-center gap-2`}
      >
        <div className="flex gap-2 items-center">
          <p className="font-semibold text-gray-500 text-[16px] py-2">
            {title}
          </p>
          <HoverCard>
            <HoverCardTrigger>
              <InfoIcon className="text-gray-500" size={12} />
            </HoverCardTrigger>
            <HoverCardContent className="text-gray-400">
              {description}
            </HoverCardContent>
          </HoverCard>
        </div>
        <div>
          <p className={`font-semibold text-[16px] py-2 ${classNameValue}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentBalanceItem;
