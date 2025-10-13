"use client";
import { Button } from "@/components/ui/button";
import ThemeSwitch from "./ThemeSwitch";
import UserDropDown from "./UserDropDown";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <div className="fixed top-0 left-0 z-30 flex h-14 w-full items-center justify-between border-b bg-white dark:bg-card md:left-64 md:w-[calc(100%-16rem)] px-5 md:px-8">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Search Component
      </h2>

      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <UserDropDown />
        <Button
          onClick={toggleSidebar}
          type="button"
          size="icon"
          className="ms-2 md:hidden"
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
