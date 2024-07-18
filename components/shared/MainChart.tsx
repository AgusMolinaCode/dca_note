"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { date: "2024-07-15", running: 450, swimming: 300 },
  { date: "2024-07-16", running: 380, swimming: 420 },
  // { date: "2024-07-17", running: 520, swimming: 120 },
  // { date: "2024-07-18", running: 140, swimming: 550 },
  // { date: "2024-07-19", running: 600, swimming: 350 },
  // { date: "2024-07-20", running: 480, swimming: 400 },
  // { date: "2024-07-21", running: 320, swimming: 240 },
  // { date: "2024-07-22", running: 400, swimming: 320 },
  // { date: "2024-07-23", running: 250, swimming: 500 },
  // { date: "2024-07-24", running: 320, swimming: 420 },
  // { date: "2024-07-25", running: 200, swimming: 200 },
  // { date: "2024-07-26", running: 400, swimming: 300 },
  // { date: "2024-07-27", running: 200, swimming: 200 },
  // { date: "2024-07-28", running: 500, swimming: 400 },
  // { date: "2024-07-29", running: 400, swimming: 200 },
  // { date: "2024-07-30", running: 200, swimming: 500 },
  // { date: "2024-07-31", running: 200, swimming: 200 },
  // { date: "2024-08-01", running: 400, swimming: 300 },
  // { date: "2024-08-02", running: 200, swimming: 200 },
]

const chartConfig = {
  running: {
    label: "Running",
    color: "hsl(var(--chart-1))",
  },
  swimming: {
    label: "Swimming",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function MainChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tooltip - Line Indicator</CardTitle>
        <CardDescription>Tooltip with line indicator.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[350px] w-[700px]" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            {/* <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
            /> */}
            <Bar
              dataKey="running"
              stackId="a"
              fill="var(--color-running)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill="var(--color-swimming)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
