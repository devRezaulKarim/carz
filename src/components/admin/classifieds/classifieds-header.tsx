import { RadioFilter } from "@/components/shared/radio-filter";
import { AwaitedPageProps } from "@/config/types";
import { ClassifiedStatus } from "@prisma/client";
import { CreateClassifiedDialog } from "./create-classified-dialog";

export const AdminClassifiedsHeader = ({ searchParams }: AwaitedPageProps) => {
  return (
    <div className="flex flex-col space-y-4 p-6 text-muted">
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        <h1 className="text-lg font-semibold md:text-2xl">All Classifieds</h1>
        <div className="flex flex-col items-center justify-between gap-y-4 md:flex-row">
          <RadioFilter
            searchParams={searchParams}
            items={["ALL", ...Object.values(ClassifiedStatus)]}
          />
          <CreateClassifiedDialog />
        </div>
      </div>
    </div>
  );
};
