import AppSidebar from "@/components/Application/Admin/AppSidebar";
import ThemeProvider from "@/components/Application/Admin/ThemeProvider";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme="system"
    //   enableSystem
    //   disableTransitionOnChange
    // >
    //   <SidebarProvider>
    //     <AppSidebar />
    //     <main className="pt-[70px] px-5 min-h-[calc(100vh-40px)] pb-10 bg-background">
    //       <Topbar />
    //       {children}
    //       <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
    //         2025 Developer Sifat All Right Reserved
    //       </div>
    //     </main>
    //   </SidebarProvider>
    // </ThemeProvider>

    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <AppSidebar />

          {/* Main Content */}
          <main className="flex-1 pt-[70px] px-5 pb-10 bg-background">
            <Topbar />
            {children}
            <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
              2025 Developer Sifat All Right Reserved
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;
