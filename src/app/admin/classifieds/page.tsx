import { AdminClassifiedsHeader } from "@/components/admin/classifieds/classifieds-header";
import { PageProps } from "@/config/types";

export default async function AdminClassifiedsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  return (
    <>
      <AdminClassifiedsHeader searchParams={searchParams} />
    </>
  );
}
export const dynamic = "force-dynamic";
