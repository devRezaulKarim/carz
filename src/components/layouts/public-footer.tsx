import { routes } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import { SiInstagram, SiMeta, SiX } from "@icons-pack/react-simple-icons";
import { navLinks } from "@/config/constants";
import { NewsletterForm } from "./newsletter-form";

const socialLinks = [
  {
    id: 1,
    href: "https://facebook.com",
    icon: (
      <SiMeta className="!h-5 !w-5 text-gray-600 transition-colors hover:text-primary" />
    ),
  },
  {
    id: 2,
    href: "https://twitter.com",
    icon: (
      <SiX className="!h-5 !w-5 text-gray-600 transition-colors hover:text-primary" />
    ),
  },
  {
    id: 3,
    href: "https://instagram.com",
    icon: (
      <SiInstagram className="!h-5 !w-5 text-gray-600 transition-colors hover:text-primary" />
    ),
  },
];

export const PublicFooter = () => {
  return (
    <footer className="bg-gray-100 px-8 py-8 lg:px-0">
      <div className="container mx-auto grid grid-cols-1 gap-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Link href={routes.home} className="flex items-center">
                <Image
                  width={100}
                  height={64}
                  alt="Logo"
                  className="relative h-8"
                  src="/assets/logos/Carz.svg"
                />
              </Link>
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <Link key={link.id} href={link.href}>
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className="text-sm text-foreground hover:text-primary lg:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={routes.signIn}
                  className="text-sm text-foreground hover:text-primary lg:text-base"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <NewsletterForm />
        </div>
        <div className="container mx-auto text-center text-gray-700">
          <h4 className="text-lg font-bold text-primary">Company Info</h4>
          <p>Company No. 123456789 | VAT No. US123456789</p>
          <p>
            Carz is not authorized and not regulated by the Financial Conduct
            Authority
          </p>
        </div>
      </div>
    </footer>
  );
};
