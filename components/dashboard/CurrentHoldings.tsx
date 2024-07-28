/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ChartConfig, ChartStyle } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions } from "@/app/api";
import CardHeaderHoldings from "./CardHeaderHoldings";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const colors = [
  "#C6B4D8",
  "#F5C0BF",
  "#FBE7AB",
  "#315098",
  "#FBD0E0",
  "#A7BEE8",
  "#EFCFE3",
  "#B8E2F2",
  "#F6C6EA",
  "#D9E5D6",
  "#F9D8B7",
  "#BFD4F2",
  "#F7EFA8",
  "#AED9E0",
  "#FAD9D5",
];

export function CurrentHoldings() {
  const { user } = useUser();

  const { data = [] } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
    refetchInterval: 60000,
  });

  const dataUserId = data?.filter((item) => item.userId === user?.id);
  const totals = dataUserId?.map((item) => item.total) ?? [];
  const totalSum = (totals ?? []).reduce((acc, curr) => acc + curr, 0);

  const chartConfig = {} satisfies ChartConfig;

  const id = "pie-interactive";

  const [activeMonth, setActiveMonth] = React.useState("");

  React.useEffect(() => {
    if (data) {
      const highestAmountItem = data.reduce((prev, current) => {
        return prev.total > current.total ? prev : current;
      }, data[0]);
      setActiveMonth(highestAmountItem?.crypto);
    }
  }, [data]);

  const groupedData = dataUserId
    .map((item) => ({
      ...item,
      percentage: (item.total / totalSum) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Agrupar por crypto
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
    (item) => item.percentage < 2
  );
  const moreThanSixPercent = aggregatedData.filter(
    (item) => item.percentage >= 2
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

  const totalsByCrypto: { [key: string]: number } = {};

  dataUserId?.forEach((item) => {
    if (totalsByCrypto[item.crypto]) {
      totalsByCrypto[item.crypto] += item.total;
    } else {
      totalsByCrypto[item.crypto] = item.total;
    }
  });

  const activeIndex = React.useMemo(() => {
    return finalData.findIndex((item) => item.crypto === activeMonth);
  }, [activeMonth, finalData]);

  const activeCryptoName = finalData?.[activeIndex ?? 0]?.crypto;

  const totalForActiveCrypto =
    totalsByCrypto[activeCryptoName]?.toFixed(2) ?? "0.0";


  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeaderHoldings />
      <CardContent className="flex flex-1 justify-center pb-0">
        {dataUserId && dataUserId.length > 0 ? (
          <ChartContainer
            id={id}
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={finalData.map((item, index) => ({
                  month: item.crypto,
                  desktop: item.total,
                  fill: colors[index % colors.length],
                }))}
                dataKey="desktop"
                nameKey="month"
                innerRadius={90}
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={({
                  outerRadius = 0,
                  ...props
                }: PieSectorDataItem) => (
                  <g>
                    <Sector {...props} outerRadius={outerRadius + 4} />
                    <Sector
                      {...props}
                      outerRadius={outerRadius + 10}
                      innerRadius={outerRadius + 8}
                    />
                  </g>
                )}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <>
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={130}
                              className="fill-foreground text-lg font-semibold"
                            >
                              {finalData?.[activeIndex ?? 0]?.crypto}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={145}
                              className="fill-gray-400 text-[0.7rem]"
                            >
                              total
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={165}
                              className="fill-foreground text-lg font-semibold"
                            >
                              {finalData?.[activeIndex ?? 0]?.crypto === "Others" ? 
                                `$${finalData?.[activeIndex ?? 0]?.total.toFixed(2)}` : 
                                `$${totalForActiveCrypto}`  
                              }
                            </tspan>
                          </text>
                        </>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="mx-auto aspect-square w-full max-w-[300px] flex items-center justify-center">
            <p className="text-center text-gray-500">
              No current holdings loaded yet.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col">
        {finalData && finalData.length > 1 && !isNaN(finalData.find(item => item.crypto === "Others")?.total) && (
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
                  ) : null}
                  <p className="text-gray-300">{item.crypto}</p>
                  <p className="text-md font-semibold text-white">
                    {((item.total / totalSum) * 100).toFixed(2)}%
                  </p>
                </div>
              ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
