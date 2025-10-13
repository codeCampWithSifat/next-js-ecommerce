import AppSidebar from "@/components/Application/Admin/AppSidebar";
import ThemeProvider from "@/components/Application/Admin/ThemeProvider";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <main className="pt-[70px] px-5 min-h-[calc(100vh-40px)] pb-10 bg-background">
          <Topbar />
          {children}
          <div className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
            2025 Developer Sifat All Right Reserved
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;

//  <SidebarProvider>
//       <AppSidebar />
//       <div className="flex flex-col min-h-screen bg-background md:ml-64">
//         <Topbar />
//         <main className="flex-1 pt-[70px] px-5 pb-10">{children}</main>
//         <footer className="border-t h-[40px] flex justify-center items-center bg-gray-50 dark:bg-background text-sm">
//           © 2025 Developer Sifat — All Rights Reserved
//         </footer>
//       </div>
//     </SidebarProvider>
