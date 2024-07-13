/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import { Label, Pie, PieChart, Scatter, Sector, Tooltip } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions } from "@/app/api";
import Image from "next/image";
import Link from "next/link";

export function CurrentHoldings() {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });

  const totals = data?.map((item) => item.amount) ?? [];
  const totalSum = (totals ?? []).reduce((acc, curr) => acc + curr, 0);

  const percentages = data?.map((item) => {
    const percentage = ((item.amount / totalSum) * 100).toFixed(2);
    return {
      name: item.crypto,
      percentage: percentage + "%",
    };
  });

  const desktopData = data?.map((item) => ({
    crypto: item.crypto,
    amount: item.amount,
    percentages: ((item.amount / totalSum) * 100).toFixed(2),
  }));

  const chartConfig = {} satisfies ChartConfig;

  const id = "pie-interactive";

  const [activeMonth, setActiveMonth] = React.useState("");

  React.useEffect(() => {
    if (data) {
      const highestAmountItem = data.reduce((prev, current) => {
        return prev.amount > current.amount ? prev : current;
      }, data[0]);
      setActiveMonth(highestAmountItem?.crypto);
    }
  }, [data]);

  const activeIndex = React.useMemo(
    () => desktopData?.findIndex((item) => item.crypto === activeMonth),
    [activeMonth]
  );

  const colors = ["#C6B4D8", "#F5C0BF", "#FBE7AB", "#315098", "#FBD0E0"];

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-3">
        <div className="grid gap-1">
          <CardTitle className="text-lg font-semibold text-gray-500">
            Holdings
          </CardTitle>
        </div>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          {data && data.length > 0 && (
            <>
              <SelectTrigger
                className="ml-auto h-7 w-[130px] rounded-xl border-gray-400 pl-2.5"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Select Crypto" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                {data.map((item) => (
                  <SelectItem
                    key={item.id}
                    value={item.crypto}
                    defaultValue={data[3]?.crypto}
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
          )}
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        {data && data.length > 0 ? (
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
                data={data.map((item, index) => ({
                  month: item.crypto,
                  desktop: item.amount,
                  fill: colors[index % colors.length],
                }))}
                dataKey="desktop"
                nameKey="month"
                innerRadius={60}
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
                              y={100}
                              className="fill-foreground text-lg font-semibold"
                            >
                              {data?.[activeIndex ?? 0]?.crypto}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={125}
                              className="fill-foreground text-lg font-semibold"
                            >
                              $ {data?.[activeIndex ?? 0]?.total.toFixed(1)}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={150}
                              className="fill-gray-400 text-[1rem]"
                            >
                              {percentages?.[activeIndex ?? 0]?.percentage}
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
            <p className="text-center text-gray-500">No assets loaded yet.</p>
          </div>
        )}
      </CardContent>
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
    </Card>
  );
}
