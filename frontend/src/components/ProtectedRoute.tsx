import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUserStore } from "../stores/userStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { user, token, isLoading, fetchMe } = useUserStore();
  const [fetchAttempted, setFetchAttempted] = useState(false);

  // Attempt to fetch user if token exists but user is null
  useEffect(() => {
    if (token && !user && !isLoading && !fetchAttempted) {
      setFetchAttempted(true);
      fetchMe().catch(() => {
        // Error handled by store - token will be cleared if invalid
      });
    }
  }, [token, user, isLoading, fetchAttempted, fetchMe]);

  // Show loading during initialization
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F8FA] to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0C6CF2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists but user is null after fetch attempt, token is invalid
  if (token && !user && fetchAttempted) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If token exists but user is null, still loading
  if (token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F6F8FA] to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0C6CF2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
