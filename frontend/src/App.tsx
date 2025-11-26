import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastHost } from "./components/Toast";
import FloatingAIBot from "./components/FloatingAIBot";
import { useUserStore } from "./stores/userStore";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import AuthGoogleCallback from "./pages/AuthGoogleCallback";
import TempDashboard from "./pages/TempDashboard";
import DashboardPage from "./pages/dashboard/DashboardPage";
import RecordsPage from "./pages/dashboard/RecordsPage";
import ShareAccessPage from "./pages/dashboard/ShareAccessPage";
import AuditLogsPage from "./pages/dashboard/AuditLogsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import Upload from "./pages/Upload";

const App = () => {
  const initialize = useUserStore((state) => state.initialize);
  const isLoading = useUserStore((state) => state.isLoading);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const init = async () => {
      try {
        // Set a timeout to prevent infinite hanging
        const initPromise = initialize();
        const timeoutPromise = new Promise((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error("Initialization timeout")), 10000);
        });
        
        await Promise.race([initPromise, timeoutPromise]);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // Continue even if initialization fails
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
        if (mounted) {
          setInitialized(true);
        }
      }
    };
    
    init();
    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initialize]);

  // Show global loading screen during initialization
  if (!initialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F8FA] to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0C6CF2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark transition-colors">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/google/callback" element={<AuthGoogleCallback />} />
        <Route path="/temp-dashboard" element={<TempDashboard />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><RecordsPage /></ProtectedRoute>} />
        <Route path="/records/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        <Route path="/share" element={<ProtectedRoute><ShareAccessPage /></ProtectedRoute>} />
        <Route path="/audit" element={<ProtectedRoute><AuditLogsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingAIBot />
      <ToastHost />
    </div>
  );
};

export default App;
