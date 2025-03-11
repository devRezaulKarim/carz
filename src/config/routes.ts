import { MultiStepFormEnum } from "./types";

export const routes = {
  home: "/",
  singleClassified: (slug: string) => `/inventory/${slug}`,
  reserve: (slug: string, step: MultiStepFormEnum) =>
    `/inventory/${slug}/reserve?step=${step}`,
  success: (slug: string) => `/inventory/${slug}/success`,
  favorites: "/favorites",
  inventory: "/inventory",
  notAvailable: (slug: string) => `/inventory/${slug}/not-available`,
  signIn: "/auth/sign-in",
  challenge: "/auth.challenge",
};
