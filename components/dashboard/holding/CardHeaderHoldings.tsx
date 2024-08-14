import React from "react";
import { CardHeader, CardTitle } from "../../ui/card";


const CardHeaderHoldings = () => {
  return (
    <div>
      <CardHeader className="flex-row items-start space-y-0">
        <div className="grid gap-1">
          <CardTitle className="text-lg font-semibold text-gray-500">
            Holdings
          </CardTitle>
        </div>
      </CardHeader>
    </div>
  );
};

export default CardHeaderHoldings;
