import { DashboardDataType } from "@/app/admin/dashboard/page";
import {
  CarIcon,
  DollarSignIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { use } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatNumber, formatPrice } from "@/lib/utils";

type KPICardsProps = {
  data: DashboardDataType;
};
type DashboardItemType = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  amount: number;
  percentage: number;
  style: Intl.NumberFormatOptions["style"];
};
export const KPICards = ({ data }: KPICardsProps) => {
  const {
    totalSales,
    carSoldThisMonth,
    newCustomerThisMonth,
    conversionRateThisMonth,
    carSoldPercentageChange,
    newCustomerPercentageChange,
    salesPercentageChange,
    conversionRatePercentageChange,
  } = use(data);

  const dashboardData: DashboardItemType[] = [
    {
      id: 1,
      title: "Total Sales",
      description: "Total sales revenue in the last 30 days",
      icon: DollarSignIcon,
      amount: totalSales,
      percentage: Math.round(salesPercentageChange),
      style: "currency",
    },
    {
      id: 2,
      title: "Cars Sold",
      description: "Total number of cars sold in the last 30 days",
      icon: CarIcon,
      amount: carSoldThisMonth,
      percentage: Math.round(carSoldPercentageChange),
      style: "decimal",
    },
    {
      id: 3,
      title: "New Customers",
      description: "Total number of new customers in the last 30 days",
      icon: UsersIcon,
      amount: newCustomerThisMonth,
      percentage: Math.round(newCustomerPercentageChange),
      style: "decimal",
    },
    {
      id: 4,
      title: "Conversion Rate",
      description: "Percentage of sales in the last 30 days",
      icon: TrendingUpIcon,
      amount: conversionRateThisMonth,
      percentage: Math.round(conversionRatePercentageChange),
      style: "percent",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
      {dashboardData.map((item) => (
        <KPICard key={item.id} {...item} />
      ))}
    </div>
  );
};

const KPICard = ({
  id,
  title,
  description,
  icon: Icon,
  amount,
  percentage,
  style,
}: DashboardItemType) => {
  return (
    <Card key={id} className="border-gray-700 bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1">
          <CardTitle className="tracking-wider text-gray-100">
            {title}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {description}
          </CardDescription>
        </div>
        <Icon className="!h-6 !w-6 text-gray-400" />
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-100">
          {style === "currency"
            ? formatPrice({ price: amount, currency: "USD" })
            : formatNumber(amount, {
                style,
                currency: "USD",
                maximumFractionDigits: 0,
              })}
        </span>
        <p
          className={cn(
            "text-xs",
            percentage > 0 ? "text-green-500" : "text-red-500",
            percentage === 0 && "text-gray-200",
          )}
        >{`${percentage}%`}</p>
      </CardContent>
    </Card>
  );
};
