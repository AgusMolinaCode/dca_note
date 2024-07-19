import React, { Key } from "react";
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
  // Función para agrupar los datos por item.crypto y sumar sus montos
  const aggregateData = (data: { crypto: string | number; amount: number; imageUrl: string; }[]) => {
    const aggregatedItems: { [key: string]: {
      id: Key | null | undefined;
      imageUrl: string ; crypto: string | number; amount: any; 
} } = {};
    data.forEach((item: { crypto: string | number; amount: any; imageUrl:string}) => {
      if (aggregatedItems[item.crypto]) {
        aggregatedItems[item.crypto].amount += item.amount;
      } else {
        aggregatedItems[item.crypto] = { ...item, id: null, imageUrl: item.imageUrl };
      }
    });
    return Object.values(aggregatedItems);
  };

  const processedData = aggregateData(data);

  return (
    <div>
      <CardFooter className="flex flex-col">
        <div className="grid grid-cols-2 items-center mx-auto justify-center object-center gap-4">
          {processedData
            ?.sort(
              (a, b) =>
                (b.amount / totalSum) * 100 - (a.amount / totalSum) * 100
            )
            .slice(0, 4)
            .map((item) => (
              <div
                key={item.id}
                className="flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-500/20 p-1 rounded-xl duration-200"
                onClick={() => setActiveMonth(item.crypto.toString())}
              >
                <Image
                  src={`https://cryptocompare.com/${item?.imageUrl}`}
                  alt={item.crypto.toString()}
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
          {(processedData?.length ?? 0) > 4 && (
            <div className="mt-2">
              <Select onValueChange={setActiveMonth}>
                <SelectTrigger
                  className="ml-auto h-7 rounded-xl border-gray-400 pl-2.5"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="More Assets" />
                </SelectTrigger>
                <SelectContent align="end" className="rounded-xl w-full">
                  {processedData
                    ?.sort(
                      (a, b) =>
                        (b.amount / totalSum) * 100 -
                        (a.amount / totalSum) * 100
                    )
                    .slice(4)
                    .map((item) => (
                      <SelectItem
                        key={item.id}
                        value={item.crypto.toString()}
                        className="flex items-center gap-2"
                      >
                        <div className="flex justify-center items-center gap-2">
                          <Image
                            src={`https://cryptocompare.com/${item?.imageUrl}`}
                            alt={item.crypto.toString()}
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