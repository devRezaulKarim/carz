import { routes } from "./routes";

export const imageSource = {
  classifiedPlaceholders: [
    {
      id: 1,
      placeholder: "https://i.ibb.co.com/xSwKn0ts/car-placeholder.jpg",
      blurhash: "4PcRHIS6iHiPd4d4hXVZl5CHCQ==",
    },
    {
      id: 2,
      placeholder:
        "https://i.ibb.co.com/7tnRXrtY/2005-BMW-M3-GTR-Need-For-Speed-001-1080.jpg",
      blurhash: "TQcGDIQIh4h2h3d2iHmLSN978Q==",
    },
    {
      id: 3,
      placeholder:
        "https://i.ibb.co.com/PzZf2rPp/2024-Audi-E-Concept-001-1080.jpg",
      blurhash: "1SYKJIhiZVlQqXiXd3hPmAaKeA==",
    },
    {
      id: 4,
      placeholder:
        "https://i.ibb.co.com/DP9dd95p/2025-Chevrolet-Blazer-EV-R-NASCAR-Concept-001-1080.jpg",
      blurhash: "UfYFDIBGZlmAaIeEmnELZL9H9Q==",
    },
    {
      id: 5,
      placeholder:
        "https://i.ibb.co.com/76nNSdH/2025-Mercedes-AMG-GT63-S-E-Performance-4-Door-001-1080.jpg",
      blurhash: "GQgSFIJ3h4h/d4eKiIl3f3/3xw==",
    },
    {
      id: 6,
      placeholder:
        "https://i.ibb.co.com/7tgNYTJw/2025-Renault-Twingo-E-Tech-Concept-001-1080.jpg",
      blurhash: "l9cNDIRqaHevhXd6dWffy7mP6Q==",
    },
    {
      id: 7,
      placeholder:
        "https://i.ibb.co.com/Q3pphvg2/2025-Tesla-Model-Y-001-1080.jpg",
      blurhash: "ifcFDIICaJhOmHdCjniWoGMJSw==",
    },
    {
      id: 8,
      placeholder:
        "https://i.ibb.co.com/FRWrDCQ/2025-Toyota-GR-Supra-003-1080.jpg",
      blurhash: "TPcFFIbQkYcHh4mxt3YKlZFRCA==",
    },
    {
      id: 9,
      placeholder:
        "https://i.ibb.co.com/nM1MQP1D/2026-Aston-Martin-Valhalla-006-1080.jpg",
      blurhash: "IPgJFILQiIiNd3eMhWlUfxb6+A==",
    },
    {
      id: 10,
      placeholder:
        "https://i.ibb.co.com/qLWT1nqF/2026-Rolls-Royce-Spectre-Black-Badge-001-1080.jpg",
      blurhash: "USgKFIKeZ2nAZZlsiHOdj/T5OQ==",
    },
  ],
  carLineup:
    "https://i.ibb.co.com/FqCcbnBp/2022-audi-tt-rs-coupe-heritage-edition-4k-8k-1920x1080.jpg",
  featured: "https://i.ibb.co.com/k2PYxCRG/view-3d-car-1.jpg",
  // featured: "https://i.ibb.co.com/N6Yf2gnC/feature-car.jpg",
};
export const CLASSIFIED_PER_PAGE = 10;

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
