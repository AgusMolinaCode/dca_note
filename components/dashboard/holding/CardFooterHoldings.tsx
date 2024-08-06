import React, { Key } from "react";
import Image from "next/image";
import { CardFooter } from "../../ui/card";
import { useUser } from "@clerk/nextjs";
import { TokenUSDT } from "@token-icons/react";

const CardFooterHoldings = ({
  data,
  totalSum,
  setActiveMonth,
}: {
  data: Transaction[];
  totalSum: number;
  setActiveMonth: (value: string) => void;
}) => {
  const { user } = useUser();

  const dataUserId = data?.filter((item) => item.userId === user?.id);

  const groupedData = dataUserId
    .map((item) => ({
      ...item,
      percentage: (item.total / totalSum) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const cryptoMap: { [key: string]: any } = groupedData.reduce(
    (acc: { [key: string]: any }, item) => {
      if (!acc[item.crypto]) {
        acc[item.crypto] = { ...item };
      } else {
        acc[item.crypto].total += item.total;
        acc[item.crypto].percentage += item.percentage;
      }
      return acc;
    },
    {}
  );

  const aggregatedData = Object.values(cryptoMap);

  const lessThanSixPercent = aggregatedData.filter(
    (item) => item.percentage < 6
  );
  const moreThanSixPercent = aggregatedData.filter(
    (item) => item.percentage >= 6
  );

  const finalData = [
    ...moreThanSixPercent,
    {
      crypto: "Others",
      total: lessThanSixPercent.reduce((sum, item) => sum + item.total, 0),
      percentage: lessThanSixPercent.reduce(
        (sum, item) => sum + item.percentage,
        0
      ),
      fill: "var(--color-others)",
      imageUrl: "",
    },
  ];

  return (
    <div>
      <CardFooter className="flex flex-col">
        <div className="grid grid-cols-2 items-center mx-auto justify-center object-center gap-4">
          {finalData
            ?.sort(
              (a, b) => (b.total / totalSum) * 100 - (a.total / totalSum) * 100
            )
            .map((item) => (
              <div
                key={item.crypto}
                className="flex justify-center items-center gap-1 cursor-pointer hover:bg-gray-500/20 p-1 rounded-xl duration-200"
                onClick={() => setActiveMonth(item.crypto.toString())}
              >
                {item?.imageUrl ? (
                  <Image
                    src={`https://cryptocompare.com/${item.imageUrl}`}
                    alt={item.crypto.toString()}
                    width={18}
                    height={18}
                    className="rounded-full"
                  />
                ) : (
                  <TokenUSDT className="w-6 h-6" variant="branded" />
                )}
                <p className="text-gray-300">{item.crypto}</p>
                <p className="text-md font-semibold text-white">
                  {((item.total / totalSum) * 100).toFixed(2)}%
                </p>
              </div>
            ))}
        </div>
      </CardFooter>
    </div>
  );
};

export default CardFooterHoldings;
