import { Classified, Prisma } from "@prisma/client";
import { ChangeEvent } from "react";

type Params = { [x: string]: string | string[] | undefined };

export type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{ [x: string]: string | string[] | undefined }>;
};
export type AwaitedPageProps = {
  params?: Awaited<PageProps["params"]>;
  searchParams?: Awaited<PageProps["searchParams"]>;
};

export type ClassifiedWithImage = Prisma.ClassifiedGetPayload<{
  include: {
    images: true;
  };
}>;

export enum MultiStepFormEnum {
  WELCOME = 1,
  SELECT_DATE = 2,
  SUBMIT_DETAILS = 3,
}

export interface MultiStepFormComponentProps extends AwaitedPageProps {
  classified: Prisma.ClassifiedGetPayload<{
    include: {
      make: true;
    };
  }>;
}

export interface Favorites {
  ids: number[];
}
export interface FiltersProps extends AwaitedPageProps {
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export type FilterOptions<LType, VType> = Array<{ label: LType; value: VType }>;

export interface SidebarProps extends AwaitedPageProps {
  minMaxValues: Prisma.GetClassifiedAggregateType<{
    _min: {
      year: true;
      price: true;
      odoReading: true;
    };
    _max: {
      year: true;
      price: true;
      odoReading: true;
    };
  }>;
}

export type PrevState = {
  success: boolean;
  message: string;
};

export type ClassifiedKeys = keyof Pick<
  Classified,
  | "status"
  | "title"
  | "vrm"
  | "id"
  | "views"
  | "year"
  | "color"
  | "price"
  | "createdAt"
>;
