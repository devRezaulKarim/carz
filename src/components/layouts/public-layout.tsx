import { PropsWithChildren } from "react";
import { PublicHeader } from "./public-header";
import { PublicFooter } from "./public-footer";

export const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <PublicHeader />
      <main className="bg-white">{children}</main>
      <PublicFooter />
    </>
  );
};
