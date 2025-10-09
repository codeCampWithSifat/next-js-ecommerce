import AppSidebar from "@/components/Application/Admin/AppSidebar";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <Topbar />
      {/* <main className="md:w-[calc(100vw-16rem)]">
        <div className="pt-[70px] px-5 min-h-[calc(100vh-40px)] pb-10">
          {children}
        </div>
        <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
          2025 Developer Sifat All Right Reserved
        </div>
      </main> */}
      <main className="md:w-[calc(100vw-16rem)] pt-[70px] px-5 min-h-[calc(100vh-40px)] pb-10">
        {children}
        <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
          2025 Developer Sifat All Right Reserved
        </div>
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;
