import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F6F8FA] via-white to-[#F7FBFF] dark:bg-background-dark transition-colors">
      <Sidebar />
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <TopNavbar />
        <main className="max-w-container mx-auto px-4 lg:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

