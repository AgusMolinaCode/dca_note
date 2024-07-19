import React from "react";
import { CardContent } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const CardContentHoldings = ({
  data,
  activeIndex,
  percentages,
  colors,
  chartConfig,
}: {
  data: Transaction[];
  activeIndex: number;
  percentages: {
    name: string;
    percentage: string;
  }[];
  colors: string[];
  chartConfig: {};
}) => {
  const id = "pie-interactive";

  const groupedData: { [key: string]: { crypto: string; amount: number } } =
    data.reduce((acc, item) => {
      const { crypto, amount } = item;
      if (!acc[crypto]) {
        acc[crypto] = { crypto, amount: 0 };
      }
      acc[crypto].amount += amount;
      return acc;
    }, {} as { [key: string]: { crypto: string; amount: number } });

  const aggregatedData = Object.values(groupedData);

  const totalsByCrypto: { [key: string]: number } = {};

  data?.forEach((item) => {
    if (totalsByCrypto[item.crypto]) {
      totalsByCrypto[item.crypto] += item.total;
    } else {
      totalsByCrypto[item.crypto] = item.total;
    }
  });

  const activeCryptoName = data?.[activeIndex ?? 0]?.crypto;

  const totalForActiveCrypto =
    totalsByCrypto[activeCryptoName]?.toFixed(3) ?? "0.0";
    
  return (
    <div>
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
                data={aggregatedData.map((item, index) => ({
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
                              ${totalForActiveCrypto}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={150}
                              className="fill-gray-400 text-[0.7rem]"
                            >
                              buy at {data?.[activeIndex ?? 0]?.price}
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
    </div>
  );
};

export default CardContentHoldings;
