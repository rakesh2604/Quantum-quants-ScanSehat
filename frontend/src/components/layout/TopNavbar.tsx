import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useThemeStore } from "../../stores/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

const TopNavbar = () => {
  const { isDark, toggleTheme } = useThemeStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-card-white dark:bg-card-dark border-b border-border-light dark:border-border-dark">
      <div className="max-w-container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mr-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Search patients, records, doctors..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark text-text-dark dark:text-text-light placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-primary-light dark:hover:bg-primary/10 transition-colors"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-text-secondary" />
              ) : (
                <Moon className="w-5 h-5 text-text-secondary" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-primary-light dark:hover:bg-primary/10 transition-colors"
              >
                <Bell className="w-5 h-5 text-text-secondary" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full"></span>
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 bg-card-white dark:bg-card-dark rounded-xl shadow-medical-lg border border-border-light dark:border-border-dark p-4"
                  >
                    <h3 className="font-semibold text-section-header mb-3">Notifications</h3>
                    <div className="space-y-2">
                      <div className="p-3 rounded-lg bg-background-light dark:bg-card-dark">
                        <p className="text-body text-text-dark dark:text-text-light">New appointment scheduled</p>
                        <p className="text-label text-text-secondary mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary-light dark:hover:bg-primary/10 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-card-white dark:bg-card-dark rounded-xl shadow-medical-lg border border-border-light dark:border-border-dark py-2"
                  >
                    <a href="/settings" className="block px-4 py-2 hover:bg-primary-light dark:hover:bg-primary/10 text-body">
                      Profile Settings
                    </a>
                    <a href="/billing" className="block px-4 py-2 hover:bg-primary-light dark:hover:bg-primary/10 text-body">
                      Billing
                    </a>
                    <hr className="my-2 border-border-light dark:border-border-dark" />
                    <button className="w-full text-left px-4 py-2 hover:bg-primary-light dark:hover:bg-primary/10 text-body text-red-500">
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;

