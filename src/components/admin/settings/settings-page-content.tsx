"use client";

import { logoutOfAllSessions } from "@/actions/sign-out";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

export const SettingsPageContent = () => {
  const [, formAction] = useActionState(logoutOfAllSessions, null);
  return (
    <div className="divide-y divide-white/5 px-6">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold leading-7 tracking-wider text-gray-300 md:text-xl">
            Log out of all sessions
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            This will log you out of all of your sessions across all of your
            devices of which you are currently logged into.
          </p>
        </div>
        <form action={formAction} className="md:col-span-2">
          <LogOutButton />
        </form>
      </div>
    </div>
  );
};

const LogOutButton = () => {
  const { pending } = useFormStatus();
  return (
    <div className="mt-8 flex">
      <Button
        disabled={pending}
        className="flex items-center gap-x-2"
        variant="destructive"
        type="submit"
      >
        {pending && <Loader2 className="!h-4 !w-4 animate-spin" />}{" "}
        {pending ? "Logging out.." : "Log out of all sessions"}
      </Button>
    </div>
  );
};
