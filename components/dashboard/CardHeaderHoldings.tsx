import React from "react";
import Image from "next/image";
import { CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUser } from "@clerk/nextjs";

const CardHeaderHoldings = () => {
  return (
    <div>
      <CardHeader className="flex-row items-start space-y-0">
        <div className="grid gap-1">
          <CardTitle className="text-lg font-semibold text-gray-500">
            Current Holdings
          </CardTitle>
        </div>
      </CardHeader>
    </div>
  );
};

export default CardHeaderHoldings;
