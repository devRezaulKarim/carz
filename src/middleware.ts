import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { routes } from "./config/routes";

export default auth((req) => {
  const nextUrl = req.nextUrl.clone();

  if (req.auth) {
    if (req.auth.requires2FA) {
      if (nextUrl.pathname === routes.challenge) {
        return NextResponse.next();
      }

      const challengeUrl = new URL(routes.challenge, req.url);
      return NextResponse.redirect(challengeUrl);
    }

    if (
      nextUrl.pathname === routes.challenge ||
      nextUrl.pathname === routes.signIn
    ) {
      const adminUrl = new URL(routes.admin.dashboard, req.url);
      return NextResponse.redirect(adminUrl);
    }
  } else {
    if (
      nextUrl.pathname.startsWith("/admin") ||
      nextUrl.pathname === routes.challenge
    ) {
      const signInUrl = new URL(routes.signIn, req.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher:
    "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|logo.svg).*)",
  runtime: "nodejs",
};
