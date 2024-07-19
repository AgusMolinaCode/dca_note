/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import * as React from "react";

import { Card } from "@/components/ui/card";
import { ChartConfig, ChartStyle } from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { loadTransactions } from "@/app/api";
import CardHeaderHoldings from "./CardHeaderHoldings";
import CardContentHoldings from "./CardContentHoldings";
import CardFooterHoldings from "./CardFooterHoldings";

export function CurrentHoldings() {
  const { data = [] } = useQuery({
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
      <CardHeaderHoldings
        data={data}
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
      />
      <CardContentHoldings
        data={data}
        activeIndex={activeIndex}
        chartConfig={chartConfig}
        percentages={percentages}
        colors={colors}
      />
      <CardFooterHoldings
        data={data}
        totalSum={totalSum}
        setActiveMonth={setActiveMonth}
      />
    </Card>
  );
}
