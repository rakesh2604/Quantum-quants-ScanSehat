import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useUserStore } from "../stores/userStore";
import { REDIRECT_DELAYS } from "./constants";

export const appConfig = {
  backendUrl: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000",
  frontendUrl: import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173",
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
};

export const api = axios.create({
  baseURL: `${appConfig.backendUrl}/api`,
  withCredentials: true,
  timeout: 30000 // Increased timeout to 30s for slower connections
});

// Request interceptor - attach Authorization header if token exists
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Use store state, fallback to localStorage for interceptor
    const store = useUserStore.getState();
    const token = store.token || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Check if OAuth is in progress using Zustand store
    const store = useUserStore.getState();
    const oAuthInProgress = store.oAuthInProgress;
    
    // Handle 401 - logout and redirect
    if (error.response?.status === 401 && !oAuthInProgress) {
      // Skip logout if already retrying
      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      localStorage.removeItem("token");
      useUserStore.getState().setToken(null);
      
      // Redirect to login after delay
      if (window.location.pathname !== "/login" && 
          window.location.pathname !== "/register" &&
          !window.location.pathname.includes("/auth/google/callback")) {
        setTimeout(() => {
          window.location.href = "/login";
        }, REDIRECT_DELAYS.LOGOUT);
      }
      
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const { data } = await api.post("/auth/login", payload);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    return data;
  },
  
  signup: async (payload: { name: string; email: string; password: string; tenantName?: string }) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  
  getUser: async () => {
    const { data } = await api.get("/auth/session");
    return data.user;
  },
  
  updateProfile: async (payload: { name?: string; phone?: string; organisation?: string; avatarUrl?: string }) => {
    const { data } = await api.patch("/auth/profile", payload);
    return data;
  },
  
  uploadToCloudinary: async (file: File, folder: string = "avatars"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const { data } = await api.post("/auth/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data.avatarUrl;
  },
  
  updatePassword: async (payload: { currentPassword: string; newPassword: string }) => {
    const { data } = await api.post("/auth/update-password", payload);
    return data;
  },
  
  logout: async () => {
    await api.post("/auth/logout");
  },
  
  startGoogle: async (params?: { tenantSlug?: string }) => {
    const response = await api.get("/auth/google", { params });
    return response.data;
  }
};

export type ApiRecord = {
  _id: string;
  summary: string;
  fileType: string;
  createdAt: string;
  facility?: string;
  integrity?: string;
  patientName?: string;
  metadata?: any;
  structuredData?: any;
  fileUrl?: string;
};

// Records API
export const recordApi = {
  getRecords: async (): Promise<ApiRecord[]> => {
    const { data } = await api.get("/records");
    return data.records ?? [];
  },
  
  getRecord: async (id: string): Promise<ApiRecord> => {
    const { data } = await api.get(`/records/${id}`);
    return data.record;
  },
  
  deleteRecord: async (id: string) => {
    const { data } = await api.delete(`/records/${id}`);
    return data;
  },
  
  uploadRecord: async (payload: FormData) => {
    const { data } = await api.post("/records/upload", payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data;
  },
  
  getSummary: async () => {
    const { data } = await api.get("/records/summary");
    return data;
  },
  
  getLatest: async () => {
    const { data } = await api.get("/records/latest");
    return data;
  }
};

// Access/Sharing API
export const accessApi = {
  shareAccess: async (payload: { doctorEmail: string; channel: "otp" | "qr" }) => {
    const { data } = await api.post("/access/generate", payload);
    return data;
  },
  
  getLogs: async () => {
    const { data } = await api.get("/logs");
    return data.logs ?? [];
  }
};

// Logs API (aliased to accessApi for consistency)
export const logsApi = {
  getLogs: accessApi.getLogs
};
