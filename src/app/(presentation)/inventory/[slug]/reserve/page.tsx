import { MultiStepFormEnum, PageProps } from "@/config/types";
import { notFound } from "next/navigation";
import { db } from "../../../../../../prisma/db";
import { Welcome } from "@/components/reserve/welcome";
import { SelectDate } from "@/components/reserve/select-date";
import { SubmitDetails } from "@/components/reserve/submit-details";
import { MultiStepFormSchema } from "@/schemas/multi-step-form.schema";

const MAP_STEP_TO_COMPONENT = {
  [MultiStepFormEnum.WELCOME]: Welcome,
  [MultiStepFormEnum.SELECT_DATE]: SelectDate,
  [MultiStepFormEnum.SUBMIT_DETAILS]: SubmitDetails,
};

export default async function ReservePage(props: PageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params?.slug;
  const step = searchParams?.step;

  const { data, success, error } = MultiStepFormSchema.safeParse({
    slug,
    step: Number(step),
  });

  if (!success) {
    console.log({ error });
    notFound();
  }

  const classified = await db.classified.findUnique({
    where: {
      slug: data.slug,
    },
    include: { make: true },
  });
  if (!classified) notFound();

  const Component = MAP_STEP_TO_COMPONENT[data.step];

  return (
    <Component
      params={params}
      searchParams={searchParams}
      classified={classified}
    />
  );
}
