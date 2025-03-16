import { routes } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { HeartIcon, MenuIcon } from "lucide-react";
import { getSourceId } from "@/lib/source-id";
import { redis } from "@/lib/redis-store";
import { Favorites } from "@/config/types";
import { navLinks } from "@/config/constants";
import { auth } from "@/auth";
import { SignOutForm } from "../auth/sign-out-form";

export const PublicHeader = async () => {
  const session = await auth();
  const sourceId = await getSourceId();
  const favorites = await redis.get<Favorites>(sourceId || "");

  return (
    <header className="flex h-16 items-center justify-between gap-x-6 bg-transparent px-4">
      <div className="flex flex-1 items-center">
        <Link href={routes.home} className="flex items-center gap-2">
          <Image
            width={120}
            height={64}
            alt="Logo"
            className="relative"
            src="/assets/logos/Carz.svg"
          />
        </Link>
      </div>
      <nav className="hidden md:block">
        {navLinks.map((nav) => (
          <Link
            key={nav.id}
            className="group rounded px-3 py-2 font-heading text-base font-semibold uppercase text-foreground transition-all duration-300 ease-in-out hover:text-primary"
            href={nav.href}
          >
            {nav.label}
          </Link>
        ))}
      </nav>
      {session ? (
        <div className="hidden items-center gap-x-6 md:flex">
          <Link href={routes.admin.dashboard} className="text-foreground">
            Back office
          </Link>
          <SignOutForm />
        </div>
      ) : (
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="group relative inline-block"
        >
          <Link href={routes.favorites}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-colors duration-200 ease-in-out group-hover:bg-pink-500">
              <HeartIcon className="!h- !w-6 text-primary group-hover:fill-white group-hover:text-white" />
            </div>
            <div className="absolute -right-[6px] -top-[6px] flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-white group-hover:bg-primary">
              <span className="text-xs">
                {favorites ? favorites.ids.length : 0}
              </span>
            </div>
          </Link>
        </Button>
      )}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" size="icon" className="border-none md:hidden">
            <MenuIcon className="!h-6 !w-6 text-primary" />
            <SheetTitle className="sr-only">Toggle nav menu</SheetTitle>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-xs bg-white p-4">
          <nav className="grid gap-2">
            {navLinks.map((nav) => (
              <Link
                key={nav.id}
                className="flex items-center gap-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                href={nav.href}
              >
                {nav.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};
