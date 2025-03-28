import { routes } from "./routes";

export const imageSource = {
  classifiedPlaceholders: [
    {
      id: 1,
      placeholder: "https://i.ibb.co.com/cKByhF4C/car-1.jpg",
      blurhash: "X8cNLYy5h3VVlYdvd5aZephwhQhX",
    },
    {
      id: 2,
      placeholder: "https://i.ibb.co.com/S4hdScXv/car-2.jpg",
      blurhash: "TigGHIiJdXhKdIavibRPgrNDBw==",
    },
    {
      id: 3,
      placeholder: "https://i.ibb.co.com/Q32LGj5s/car-3.jpg",
      blurhash: "2+cFDYSUjoaLiHiHebeof6mQlApJ",
    },
    {
      id: 4,
      placeholder: "https://i.ibb.co.com/QvQ2S6gt/car-4.jpg",
      blurhash: "HPgRFYKFiHiPd3h6eGd4h7aQaQqp",
    },
    {
      id: 5,
      placeholder: "https://i.ibb.co.com/HftSNQcS/car-5.jpg",
      blurhash: "oUgKLYipd3iPd4duhiiIiJqPqfm5",
    },
    {
      id: 6,
      placeholder: "https://i.ibb.co.com/cS30K3wB/car-6.jpg",
      blurhash: "nTgODYZXdomPdneHmDioeoaAdAY4",
    },
    {
      id: 7,
      placeholder: "https://i.ibb.co.com/mCZJxyGH/car-7.jpg",
      blurhash: "nggOJYJ3hodwZ3h9d4iHhkd3cGQH",
    },
    {
      id: 8,
      placeholder: "https://i.ibb.co.com/39Z4hJ9z/car-8.jpg",
      blurhash: "UQgKFYRIinhwl3h2eGiYg0d5cHQH",
    },
    {
      id: 9,
      placeholder: "https://i.ibb.co.com/bgCtgmmZ/car-9.jpg",
      blurhash: "0PcJBYBYZniAeoZ1iehYltqNn835",
    },
    {
      id: 10,
      placeholder: "https://i.ibb.co.com/bgq288YC/car-10.jpg",
      blurhash: "WhgWFYKGiIeAh3d5h5eGiFuJ8Mi8",
    },
    {
      id: 11,
      placeholder: "https://i.ibb.co.com/fGT5MmPc/car-11.jpg",
      blurhash: "GwgWDYCKh3iPd4h7h4eGdr+Y8qhZ",
    },
    {
      id: 12,
      placeholder: "https://i.ibb.co.com/C3zD7njs/car-12.jpg",
      blurhash: "VVkSJYaId3iPeIeKd2h3d7ufpft5",
    },
    {
      id: 13,
      placeholder: "https://i.ibb.co.com/spfVQZ2L/car-13.jpg",
      blurhash: "lOcFBYCASMcRqIVRuveJh5pQlgdm",
    },
    {
      id: 14,
      placeholder: "https://i.ibb.co.com/mkwcnVJ/car-14.jpg",
      blurhash: "IvgNDYKHdod/dndvmCeHialwmgnH",
    },
    {
      id: 15,
      placeholder: "https://i.ibb.co.com/Y4qctDDh/car-15.jpg",
      blurhash: "G/gRBYBXeHd/d4eLeHeIhvlYl29m",
    },
  ],
  carLineup: "https://i.ibb.co.com/My5kHRgn/hero-bg.webp",
  featured: "https://i.ibb.co.com/mC4gNwbd/feature-car.webp",
};
export const CLASSIFIED_PER_PAGE = 12;

export const navLinks = [
  {
    id: 1,
    href: routes.home,
    label: "Home",
  },
  {
    id: 2,
    href: routes.inventory,
    label: "Inventory",
  },
];

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000; //7 days in ms
export const MAX_IMAGE_SIZE = 20 * 1000 * 1000; //2 MB
