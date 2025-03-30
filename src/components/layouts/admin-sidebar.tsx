"use client";
import { routes } from "@/config/routes";
import { AnimatePresence, Variants } from "framer-motion";
import { motion } from "framer-motion";
import {
  CarFrontIcon,
  LayoutDashboardIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { ActiveLink } from "../ui/active-link";

const navigation = [
  {
    name: "Dashboard",
    href: routes.admin.dashboard,
    icon: LayoutDashboardIcon,
  },
  {
    name: "Classifieds",
    href: routes.admin.classifieds,
    icon: CarFrontIcon,
  },
  {
    name: "Customers",
    href: routes.admin.customers,
    icon: UsersIcon,
  },
  {
    name: "Settings",
    href: routes.admin.settings,
    icon: SettingsIcon,
  },
];

export const AdminSidebar = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
  const handleSidebarHover = useCallback((expanded: boolean) => {
    setIsSidebarExpanded(expanded);
  }, []);

  const sidebarVariants: Variants = {
    expanded: { width: 256 },
    collapsed: { width: "fit-content" },
  };
  const menuTextVariants: Variants = {
    expanded: {
      opacity: 1,
      width: "auto",
      marginLeft: 10,
    },
    collapsed: {
      opacity: 0,
      width: 0,
    },
  };

  const logoVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  return (
    <motion.div
      className="sticky left-0 top-0 flex min-h-screen flex-col overflow-hidden bg-black/20"
      animate={isSidebarExpanded ? "expanded" : "collapsed"}
      variants={sidebarVariants}
      initial="collapsed"
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onMouseEnter={() => handleSidebarHover(true)}
      onMouseLeave={() => handleSidebarHover(false)}
    >
      <div className="flex grow flex-col px-4">
        <Link href={routes.home} className="">
          <div className="relative h-[60px] w-full">
            <AnimatePresence initial={false} mode="wait">
              {isSidebarExpanded ? (
                <motion.div
                  key="expanded-logo"
                  className="absolute inset-0 flex"
                  variants={logoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.4 }}
                >
                  <Image
                    width={120}
                    height={64}
                    alt="Logo"
                    className="object-contain object-left"
                    src="/assets/logos/sidebar/Carz.svg"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="collapsed-logo"
                  className="absolute inset-0 flex"
                  variants={logoVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.1 }}
                >
                  <Image
                    width={80}
                    height={100}
                    alt="Logo"
                    className="object-contain object-left"
                    src="/assets/logos/sidebar/Cz.svg"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>
        <div className="flex flex-col gap-2">
          {navigation.map((item) => (
            <ActiveLink
              key={item.name}
              href={item.href}
              className="flex w-full cursor-pointer items-center rounded-lg p-2 transition-colors duration-200"
            >
              <div className="flex items-center justify-center">
                <item.icon className="!h-6 !w-6 shrink-0" />
                <motion.span
                  variants={menuTextVariants}
                  animate={isSidebarExpanded ? "expanded" : "collapsed"}
                  initial="collapsed"
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {item.name}
                </motion.span>
              </div>
            </ActiveLink>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
