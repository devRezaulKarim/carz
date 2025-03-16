import { AdminSearch } from "../admin/search";

export const AdminHeader = async () => {
  return (
    <header className="flex h-[60px] items-center gap-4 px-6">
      <div className="grid w-full flex-1 grid-cols-3 items-center gap-4 md:gap-8">
        <div className="col-span-1">
          <AdminSearch />
        </div>
      </div>
    </header>
  );
};
