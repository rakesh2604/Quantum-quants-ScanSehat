import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Share2,
  Calendar,
  Users,
  Stethoscope,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  CreditCard,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useThemeStore } from "../../stores/themeStore";
import clsx from "clsx";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: FileText, label: "Patient Records", path: "/records" },
  { icon: Upload, label: "Upload Record", path: "/upload" },
  { icon: Share2, label: "Share Access", path: "/share" },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  { icon: Users, label: "Doctors", path: "/doctors" },
  { icon: Stethoscope, label: "Medical History", path: "/history" },
  { icon: BarChart3, label: "Reports & Analytics", path: "/reports" },
  { icon: CreditCard, label: "Billing & Payments", path: "/billing" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isDark } = useThemeStore();

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white dark:bg-[#2A2A2A]">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E2E2E2] dark:border-[#3A3A3A]">
        <div className="w-10 h-10 rounded-lg bg-[#2A7FBA] flex items-center justify-center">
          <span className="text-white font-bold text-lg">S²</span>
        </div>
        <div>
          <h1 className="font-bold text-[18px] text-[#1E1E1E] dark:text-white">Scan Sehat</h1>
          <p className="text-[12px] text-[#6A6A6A] dark:text-[#9A9A9A]">Free Plan</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-4 border-b border-[#E2E2E2] dark:border-[#3A3A3A]">
        <div className="relative">
          <input
            type="text"
            placeholder="Quick search here..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#E2E2E2] dark:border-[#3A3A3A] bg-[#F7F9FB] dark:bg-[#3A3A3A] text-[#1E1E1E] dark:text-white placeholder:text-[#6A6A6A] focus:outline-none focus:ring-2 focus:ring-[#2A7FBA] focus:border-transparent text-[13px]"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6A6A6A]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-all duration-200",
                isActive
                  ? "bg-[#0C6CF2]/10 text-[#0C6CF2]"
                  : "text-[#6A6A6A] dark:text-[#9A9A9A] hover:bg-[#F7F9FB] dark:hover:bg-[#3A3A3A]"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="px-4 py-4 border-t border-[#E2E2E2] dark:border-[#3A3A3A]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2A7FBA] to-[#226A9A] flex items-center justify-center">
            <span className="text-white text-sm font-semibold">RM</span>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#1E1E1E] dark:text-white">Richard Moore</p>
            <p className="text-[12px] text-[#6A6A6A] dark:text-[#9A9A9A]">richardmoore@gmail.com</p>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium text-[#6A6A6A] dark:text-[#9A9A9A] hover:bg-[#F7F9FB] dark:hover:bg-[#3A3A3A] transition-colors">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-[#2A2A2A] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
      >
        <Menu className="w-6 h-6 text-[#1E1E1E] dark:text-white" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 border-r border-[#E2E2E2] dark:border-[#3A3A3A]">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden"
            >
              <div className="absolute top-4 right-4 lg:hidden">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-lg hover:bg-[#F7F9FB] dark:hover:bg-[#3A3A3A]"
                >
                  <X className="w-6 h-6 text-[#1E1E1E] dark:text-white" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#2A2A2A] border-t border-[#E2E2E2] dark:border-[#3A3A3A] z-30 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex justify-around items-center py-2">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                  isActive
                    ? "text-[#0C6CF2] bg-[#0C6CF2]/10"
                    : "text-[#6A6A6A] dark:text-[#9A9A9A]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
