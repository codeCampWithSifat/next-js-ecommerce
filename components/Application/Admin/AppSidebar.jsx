import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import logoBlack from "../../../public/assets/images/logo-black.png";
import logoWhite from "../../../public/assets/images/logo-white.png";
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

const AppSidebar = () => {
  return (
    <Sidebar className="z-50">
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex justify-between items-center px-4">
          <Image
            src={logoBlack.src}
            height={50}
            width={logoBlack.width}
            alt="logo_Black"
            className="block dark:hidden h-[50px] w-auto"
          />
          <Image
            src={logoWhite.src}
            height={50}
            width={logoWhite.width}
            alt="logo_White"
            className="hidden dark:block h-[50px] w-auto"
          />
          <Button className=" " type="button" size="icon">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-3">
        <SidebarMenu>
          {adminAppSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className="font-semibold px-2 py-5"
                  >
                    <Link href={menu?.url}>
                      <menu.icon />
                      {menu.title}
                      {menu.submenu && menu.submenu.length > 0 && (
                        <LuChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {menu.submenu && menu.submenu.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu.submenu.map((submenuItem, submenuIndex) => (
                        <SidebarMenuSubItem key={submenuIndex}>
                          <SidebarMenuSubButton asChild className="px-2 py-5">
                            <Link href={submenuItem.url}>
                              {submenuItem.title}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
