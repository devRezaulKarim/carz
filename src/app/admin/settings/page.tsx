import { SettingsPageContent } from "@/components/admin/settings/settings-page-content";

export default async function AdminSettingsPage() {
  return (
    <>
      <div className="flex flex-col p-6 text-gray-300">
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <h1 className="text-lg font-semibold md:text-2xl">
            Account Settings
          </h1>
        </div>
      </div>
      <SettingsPageContent />
    </>
  );
}
export const dynamic = "force-dynamic";
