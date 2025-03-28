import { RadioFilter } from "@/components/shared/radio-filter";
import { AwaitedPageProps } from "@/config/types";
import { ClassifiedStatus } from "@prisma/client";
import { CreateClassifiedDialog } from "./create-classified-dialog";

export const AdminClassifiedsHeader = ({ searchParams }: AwaitedPageProps) => {
  return (
    <div className="flex flex-col space-y-4 p-6 text-muted">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">All Classifieds</h1>
        <div className="flex items-center justify-between">
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
