import { create } from "zustand";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useEffect } from "react";

type ToastType = "success" | "info" | "error";

type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastStore = {
  toasts: ToastItem[];
  push: (message: string, type?: ToastType) => void;
  dismiss: (id: string) => void;
};

const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, type = "info") => {
    const id = crypto.randomUUID();
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
    }, 3500);
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }))
}));

export const useToast = () => useToastStore((state) => state.push);

const toneClasses: Record<ToastType, string> = {
  success: "bg-primary text-white",
  info: "bg-slate-900 text-white",
  error: "bg-red-500 text-white"
};

export const ToastHost = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  useEffect(() => {
    document.documentElement.style.setProperty("--toast-count", toasts.length.toString());
  }, [toasts.length]);

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={clsx("pointer-events-auto rounded-2xl px-4 py-3 shadow-lg", toneClasses[toast.type])}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">{toast.message}</p>
              <button aria-label="Dismiss toast" onClick={() => dismiss(toast.id)} className="text-xs opacity-70 hover:opacity-100">
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

