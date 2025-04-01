"use client";
import { ChartDataType } from "@/app/admin/dashboard/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { use } from "react";
import {
  BarChart,
  XAxis,
  YAxis,
  Bar,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";

type SalesChartProps = {
  data: ChartDataType;
};
export const SalesChart = ({ data }: SalesChartProps) => {
  const chartData = use(data);
  return (
    <Card className="mb-6 border-gray-700 bg-gray-800">
      <CardHeader>
        <CardTitle className="tracking-wider text-gray-100">
          Monthly Sales {new Date().getFullYear() - 1}/
          {new Date().getFullYear()}
        </CardTitle>
        <CardDescription className="text-gray-400">
          Number of cars sold per month
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="month"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                formatPrice({ price: value, currency: "USD" })
              }
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Bar
              dataKey="sales"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded border border-gray-700 bg-gray-800 p-2">
        <p className="text-gray-100">{`${label}: ${formatPrice({ price: payload[0].value as number, currency: "USD" })}`}</p>
      </div>
    );
  }
};
