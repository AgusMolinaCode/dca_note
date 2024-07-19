import React from "react";
import Image from "next/image";
import { CardFooter } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CardFooterHoldings = ({
  data,
  totalSum,
  setActiveMonth,
}: {
  data: Transaction[];
  totalSum: number;
  setActiveMonth: (value: string) => void;
}) => {
  return (
    <div>
      <CardFooter className="flex flex-col">
        <div className="grid grid-cols-2 items-center mx-auto justify-center object-center gap-4">
          {data
            ?.sort(
              (a, b) =>
                (b.amount / totalSum) * 100 - (a.amount / totalSum) * 100
            )
            .slice(0, 4)
            .map((item) => (
              <div
                key={item.id}
                className="flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-500/20 p-1 rounded-xl duration-200"
                onClick={() => setActiveMonth(item.crypto)}
              >
                <Image
                  src={`https://cryptocompare.com/${item?.imageUrl}`}
                  alt={item.crypto}
                  width={18}
                  height={18}
                  className="rounded-full"
                />
                <p className="text-gray-300">{item.crypto}</p>
                <p className="text-md font-semibold text-white">
                  {((item.amount / totalSum) * 100).toFixed(2)}%
                </p>
              </div>
            ))}
        </div>
        <div>
          {(data?.length ?? 0) > 4 && (
            <div className="mt-2">
              <Select onValueChange={setActiveMonth}>
                <SelectTrigger
                  className="ml-auto h-7 rounded-xl border-gray-400 pl-2.5"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="More Assets" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl w-full">
                  {data
                    ?.sort(
                      (a, b) =>
                        (b.amount / totalSum) * 100 -
                        (a.amount / totalSum) * 100
                    )
                    .slice(4)
                    .map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.crypto}
                        className="flex items-center gap-2"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <Image
                            src={`https://cryptocompare.com/${item?.imageUrl}`}
                            alt={item.crypto}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <p>{item.crypto} - </p>
                          <p>{((item.amount / totalSum) * 100).toFixed(2)}%</p>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardFooter>
    </div>
  );
};

export default CardFooterHoldings;
