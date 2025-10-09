import { Button } from "@/components/ui/button";
import ThemeSwitch from "./ThemeSwitch";
import UserDropDown from "./UserDropDown";
import { RiMenu4Fill } from "react-icons/ri";

const Topbar = () => {
  return (
    <div className="fixed border h-14 w-full top-0 left-0 z-30 md:ps-72 md:pr-8 flex justify-between items-center bg-white dark:bg-card">
      <div>
        <h2>Search Component</h2>
      </div>

      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <UserDropDown />
        <Button type="button" size="icon" className="ms-2">
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
