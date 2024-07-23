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
import { useUser } from "@clerk/clerk-react";

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

  const percentages = dataUserId?.map((item) => {
    const percentage = ((item.amount / totalSum) * 100).toFixed(2);
    return {
      name: item.crypto,
      percentage: percentage + "%",
    };
  });

  const desktopData = dataUserId?.map((item) => ({
    crypto: item.crypto,
    amount: item.amount,
    total: item.total,
    percentages: ((item.amount / totalSum) * 100).toFixed(2),
  }));

  const chartConfig = {} satisfies ChartConfig;

  const id = "pie-interactive";

  const [activeMonth, setActiveMonth] = React.useState("");

  React.useEffect(() => {
    if (dataUserId) {
      const highestAmountItem = dataUserId.reduce((prev, current) => {
        return prev.total > current.total ? prev : current;
      }, dataUserId[0]);
      setActiveMonth(highestAmountItem?.crypto);
    }
  }, [dataUserId]);

  const activeIndex = React.useMemo(
    () => desktopData?.findIndex((item) => item.crypto === activeMonth),
    [activeMonth]
  );

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

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeaderHoldings
        data={dataUserId}
        activeMonth={activeMonth}
        setActiveMonth={setActiveMonth}
      />
      <CardContentHoldings
        data={dataUserId}
        activeIndex={activeIndex}
        chartConfig={chartConfig}
        percentages={percentages}
        colors={colors}
      />
      <CardFooterHoldings
        data={dataUserId}
        totalSum={totalSum}
        setActiveMonth={setActiveMonth}
      />
    </Card>
  );
}
