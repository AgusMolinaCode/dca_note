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

const CardHeaderHoldings = ({
  data,
  activeMonth,
  setActiveMonth,
}: {
  data: Transaction[];
  activeMonth: string;
  setActiveMonth: (value: string) => void;
}) => {
  // Filtrar elementos duplicados basados en item.crypto
  const uniqueData = data.reduce((acc: Transaction[], current: Transaction) => {
    if (!acc.find((item) => item.crypto === current.crypto)) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <div>
      <CardHeader className="flex-row items-start space-y-0 pb-3">
        {uniqueData && uniqueData.length > 0 && (
          <div>
            <div className="grid gap-1">
              <CardTitle className="text-lg font-semibold text-gray-500">
                Current Holdings
              </CardTitle>
            </div>
            <div>
              <Select value={activeMonth} onValueChange={setActiveMonth}>
                <>
                  <SelectTrigger
                    className="ml-auto h-7 w-[130px] rounded-xl border-gray-400 pl-2.5"
                    aria-label="Select a value"
                  >
                    <SelectValue placeholder="Select Crypto" />
                  </SelectTrigger>
                  <SelectContent align="end" className="rounded-xl">
                    {uniqueData.map((item: any) => (
                      <SelectItem
                        key={item.id}
                        value={item.crypto}
                        defaultValue={uniqueData[3]?.crypto}
                      >
                        <div className="flex items-center gap-2">
                          <Image
                            src={`https://cryptocompare.com/${item?.imageUrl}`}
                            alt={item.crypto}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <p>{item.crypto}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </>
              </Select>
            </div>
          </div>
        )}
      </CardHeader>
    </div>
  );
};

export default CardHeaderHoldings;
