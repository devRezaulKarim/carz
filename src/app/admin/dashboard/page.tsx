import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { prisma } from "../../../../prisma/prisma";
import { ClassifiedStatus, CustomerStatus } from "@prisma/client";
import { calculatePercentageChange } from "@/lib/utils";
import { KPICards } from "@/components/admin/dashboard/kpi-cards";
import { SalesChart } from "@/components/admin/dashboard/sales-chart";

async function getDashboardData() {
  const now = new Date();
  const startOfThisMonth = startOfMonth(now);
  const endOfThisMonth = endOfMonth(now);
  const startOfLastMonth = startOfMonth(subMonths(now, 1));

  const lastMonthPromises = {
    carSoldThisMonth: prisma.classified.count({
      where: {
        status: ClassifiedStatus.SOLD,
        updatedAt: {
          gte: startOfThisMonth,
          lte: endOfThisMonth,
        },
      },
    }),
    carSoldLastMonth: prisma.classified.count({
      where: {
        status: ClassifiedStatus.SOLD,
        updatedAt: {
          gte: startOfLastMonth,
          lt: startOfThisMonth,
        },
      },
    }),
    newCustomerThisMonth: prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfThisMonth,
          lte: endOfThisMonth,
        },
      },
    }),
    newCustomerLastMonth: prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfLastMonth,
          lt: startOfThisMonth,
        },
      },
    }),
    purchasedCustomerThisMonth: prisma.customer.count({
      where: {
        status: CustomerStatus.PURCHASED,
        updatedAt: {
          gte: startOfThisMonth,
          lte: endOfThisMonth,
        },
      },
    }),
    purchasedCustomerLastMonth: prisma.customer.count({
      where: {
        status: CustomerStatus.PURCHASED,
        updatedAt: {
          gte: startOfLastMonth,
          lt: startOfThisMonth,
        },
      },
    }),
  };
  const totalSalesThisMonthResult = await prisma.classified.aggregate({
    where: {
      status: ClassifiedStatus.SOLD,
      updatedAt: {
        gte: startOfThisMonth,
        lte: endOfThisMonth,
      },
    },
    _sum: { price: true },
  });

  const totalSalesPreviousMonthResult = await prisma.classified.aggregate({
    where: {
      status: ClassifiedStatus.SOLD,
      updatedAt: {
        gte: startOfLastMonth,
        lt: startOfThisMonth,
      },
    },
    _sum: { price: true },
  });

  const [
    carSoldThisMonth,
    carSoldLastMonth,
    newCustomerThisMonth,
    newCustomerLastMonth,
    purchasedCustomerThisMonth,
    purchasedCustomerLastMonth,
  ] = await Promise.all(Object.values(lastMonthPromises));

  const [totalSalesThisMonth, totalSalesLastMonth] = await Promise.all([
    totalSalesThisMonthResult,
    totalSalesPreviousMonthResult,
  ]);
  const totalSales = totalSalesThisMonth._sum.price || 0;
  const totalPrevSales = totalSalesLastMonth._sum.price || 0;

  const conversionRateThisMonth =
    newCustomerThisMonth > 0
      ? purchasedCustomerThisMonth / newCustomerThisMonth
      : 0;
  const conversionRateLastMonth =
    newCustomerLastMonth > 0
      ? purchasedCustomerLastMonth / newCustomerLastMonth
      : 0;

  const carSoldPercentageChange = calculatePercentageChange(
    carSoldThisMonth,
    carSoldLastMonth,
  );
  const newCustomerPercentageChange = calculatePercentageChange(
    newCustomerThisMonth,
    newCustomerLastMonth,
  );
  const salesPercentageChange = calculatePercentageChange(
    totalSales,
    totalPrevSales,
  );
  const conversionRatePercentageChange = calculatePercentageChange(
    conversionRateThisMonth,
    conversionRateLastMonth,
  );

  return {
    totalSales,
    carSoldThisMonth,
    newCustomerThisMonth,
    conversionRateThisMonth,
    carSoldPercentageChange,
    newCustomerPercentageChange,
    salesPercentageChange,
    conversionRatePercentageChange,
  };
}

const getChartData = async () => {
  const now = new Date();
  const monthsData = [];
  for (let i = 0; i < 12; i++) {
    const startDate = startOfMonth(subMonths(now, i));
    const endDate = endOfMonth(startDate);

    const monthlySales = await prisma.classified.aggregate({
      where: {
        status: ClassifiedStatus.SOLD,
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: { price: true },
    });

    monthsData.unshift({
      month: format(startDate, "MMM"),
      sales: monthlySales._sum.price || 0,
    });
  }

  return monthsData;
};

export type DashboardDataType = ReturnType<typeof getDashboardData>;
export type ChartDataType = ReturnType<typeof getChartData>;

export default async function AdminDashboardPage() {
  const dashboardData = getDashboardData();
  const chartData = getChartData();
  return (
    <>
      <KPICards data={dashboardData} />
      <SalesChart data={chartData} />
    </>
  );
}
export const dynamic = "force-dynamic";
