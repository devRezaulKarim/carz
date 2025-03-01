import { PublicLayout } from "@/components/layouts/public-layout";
import { PropsWithChildren } from "react";

const PresentationLayout = ({ children }: PropsWithChildren) => {
  return <PublicLayout>{children}</PublicLayout>;
};

export default PresentationLayout;
