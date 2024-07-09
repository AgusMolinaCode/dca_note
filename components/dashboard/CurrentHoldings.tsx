/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
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

export function CurrentHoldings() {
  const { data } = useQuery({
    queryKey: ["items"],
    queryFn: loadTransactions,
  });

  const desktopData = data?.map((item) => ({
    month: item.crypto,
    amount: item.amount,
    fill: "yellow",
  }));

  const chartConfig = {
    january: {
      color: "yellow",
    },
    february: {
      color: "var(--color-february)",
    },
    march: {
      color: "var(--color-march)",
    },
    april: {
      color: "var(--color-april)",
    },
    may: {
      color: "var(--color-may)",
    },
  } satisfies ChartConfig;

  const id = "pie-interactive";
  const [activeMonth, setActiveMonth] = React.useState(desktopData?.[0]?.month);

  const activeIndex = React.useMemo(
    () => desktopData?.findIndex((item) => item.month === activeMonth),
    [activeMonth]
  );

  const colors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6"];

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-3">
        <div className="grid gap-1">
          <CardTitle className="text-lg font-semibold text-gray-500">
            Holdings
          </CardTitle>
        </div>
        <Select
          value={activeMonth}
          onValueChange={setActiveMonth}
        >
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-xl border-gray-400 pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select Crypto" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {data?.map((item) => (
              <SelectItem key={item.id} value={item.crypto} defaultValue={
                data?.[3]?.crypto
              }>
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
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
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
              data={data?.map((item, index) => ({
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
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 6}
                    innerRadius={outerRadius + 2}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data?.[activeIndex ?? 0]?.crypto}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
