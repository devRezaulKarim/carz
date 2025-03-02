import { EndButtons } from "@/components/shared/end-buttons";
import { XCircle } from "lucide-react";

export default function NotAvailablePage() {
  return (
    <div className="grid min-h-[80dvh] place-items-center">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center space-y-4 p-8">
        <XCircle className="!h-16 !w-16 text-muted-foreground" />
        <p className="text-center text-lg font-semibold">
          Sorry, that vehicle is not available.
        </p>
        <p className="text-center text-muted-foreground">
          We have large number of other vehicles that might suit your needs, to
          view our current stock please check our website.
        </p>
        <EndButtons />
      </div>
    </div>
  );
}
