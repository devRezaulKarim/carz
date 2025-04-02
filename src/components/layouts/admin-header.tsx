import { AdminSearch } from "../admin/search";

export const AdminHeader = async () => {
  return (
    <header className="flex h-[60px] items-center gap-4 px-6">
      <div className="grid w-full flex-1 grid-cols-1 items-center gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
        <AdminSearch />
      </div>
    </header>
  );
};
