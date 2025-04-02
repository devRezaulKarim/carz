import { RadioFilter } from "@/components/shared/radio-filter";
import { AwaitedPageProps } from "@/config/types";
import { CustomerStatus } from "@prisma/client";

export const AdminCustomersHeader = ({ searchParams }: AwaitedPageProps) => {
  return (
    <div className="flex flex-col space-y-4 p-6 text-muted">
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <h1 className="text-lg font-semibold md:text-2xl">All Classifieds</h1>
        <div className="flex flex-col items-center justify-between gap-y-4 md:flex-row">
          <RadioFilter
            searchParams={searchParams}
            items={["ALL", ...Object.values(CustomerStatus)]}
          />
        </div>
      </div>
    </div>
  );
};
