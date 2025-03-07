import { MultiStepFormEnum, PageProps } from "@/config/types";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db } from "../../../../../../prisma/db";
import { Welcome } from "@/components/reserve/welcome";
import { SelectDate } from "@/components/reserve/select-date";

const MultiStepFormSchema = z.object({
  step: z.nativeEnum(MultiStepFormEnum),
  slug: z.string(),
});

const MAP_STEP_TO_COMPONENT = {
  [MultiStepFormEnum.WELCOME]: Welcome,
  [MultiStepFormEnum.SELECT_DATE]: SelectDate,
  [MultiStepFormEnum.SUBMIT_DETAILS]: null,
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
