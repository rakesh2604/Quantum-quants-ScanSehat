import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "../components/Toast";
import { useUserStore } from "../stores/userStore";
import { REDIRECT_DELAYS } from "../utils/constants";

const AuthGoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { setOAuthInProgress, googleOAuthComplete } = useUserStore();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const processedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Prevent double processing
    if (processedRef.current) return;
    processedRef.current = true;

    const processCallback = async () => {
      // Set OAuth in progress flag
      setOAuthInProgress(true);

      try {
        // Check for error status first
        const errorStatus = searchParams.get("status");
        const errorReason = searchParams.get("reason");
        
        if (errorStatus === "error") {
          setStatus("error");
          // Map error reasons to user-friendly messages
          const errorMessages: Record<string, string> = {
            server: "Server error occurred. Please try again later.",
            state_mismatch: "Security validation failed. Please try signing in again.",
            missing_code: "Authentication code missing. Please try again.",
            no_email: "Google account email not found. Please use a different account.",
            google_auth_failed: "Failed to authenticate with Google. Please try again.",
            database_error: "Database error occurred. Please contact support.",
            tenant_error: "Failed to create organization. Please try again.",
            user_creation_failed: "Failed to create account. Please try again.",
            user_update_failed: "Failed to update account. Please try again.",
            session_failed: "Failed to create session. Please try again.",
            encoding_failed: "Failed to process user data. Please try again.",
          };
          const friendlyMessage = errorMessages[errorReason || ""] || errorReason || "Unknown error occurred";
          setErrorMessage(friendlyMessage);
          toast(`Google sign-in failed: ${friendlyMessage}`, "error");
          setOAuthInProgress(false);
          // Redirect immediately to temp dashboard on any error
          navigate("/temp-dashboard", { replace: true });
          return;
        }

        // Extract token and user from URL params
        const token = searchParams.get("token");
        const userBase64 = searchParams.get("user");

        if (!token || !userBase64) {
          setStatus("error");
          setErrorMessage("Missing authentication data");
          toast("Google sign-in failed: Missing authentication data", "error");
          setOAuthInProgress(false);
          navigate("/temp-dashboard", { replace: true });
          return;
        }

        // Decode base64 user data
        try {
          const userJson = atob(userBase64);
          const user = JSON.parse(userJson);

          // Validate user object
          if (!user.id || !user.email || !user.name) {
            throw new Error("Invalid user data structure");
          }

          // Use store method to complete OAuth
          try {
            await googleOAuthComplete(token, user);
            setStatus("success");
            toast("Google sign-in successful", "success");
            timeoutRef.current = setTimeout(() => navigate("/dashboard"), REDIRECT_DELAYS.SUCCESS);
          } catch (oauthError: any) {
            // If OAuth completion fails (e.g., backend down), redirect to temp dashboard
            console.error("OAuth completion failed:", oauthError);
            setStatus("error");
            setErrorMessage("Failed to complete authentication. Backend may be unavailable.");
            toast("Google sign-in failed: Unable to complete authentication", "error");
            setOAuthInProgress(false);
            navigate("/temp-dashboard", { replace: true });
          }
        } catch (decodeError) {
          console.error("Failed to decode user data:", decodeError);
          setStatus("error");
          setErrorMessage("Failed to parse user data");
          toast("Google sign-in failed: Invalid response", "error");
          setOAuthInProgress(false);
          navigate("/temp-dashboard", { replace: true });
        }
      } catch (error: any) {
        console.error("Failed to process callback:", error);
        setStatus("error");
        setErrorMessage("Failed to process authentication");
        toast("Google sign-in failed: Processing error", "error");
        setOAuthInProgress(false);
        navigate("/temp-dashboard", { replace: true });
      }
    };

    processCallback();

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchParams, navigate, toast, setOAuthInProgress, googleOAuthComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0C6CF2] via-[#00A1A9] to-[#0C6CF2] overflow-hidden relative flex items-center justify-center">
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-40 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Glass card loader */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 glass-card rounded-3xl border border-white/20 bg-white/30 backdrop-blur-xl px-8 py-10 text-center shadow-card max-w-md w-full mx-4"
      >
        {status === "processing" && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full mx-auto mb-6"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 mx-auto mb-4"
            >
              <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </motion.div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/80 mb-2">Connecting Google</p>
            <p className="text-2xl font-semibold text-white">Verifying Scan Sehat session…</p>
          </>
        )}

        {status === "success" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/80 mb-2">Success</p>
            <p className="text-2xl font-semibold text-white">Redirecting to dashboard…</p>
          </>
        )}

        {status === "error" && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
            <p className="text-sm uppercase tracking-[0.4em] text-red-300 mb-2">Error</p>
            <p className="text-2xl font-semibold text-white mb-2">Sign-in failed</p>
            <p className="text-sm text-white/80">{errorMessage}</p>
            <p className="text-xs text-white/60 mt-4">Redirecting to temporary dashboard…</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthGoogleCallback;
