import { useState, FormEvent, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield, Key, Bell, Save, Settings as SettingsIcon, Upload, Eye, EyeOff } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useUserStore } from "../../stores/userStore";
import { useToast } from "../../components/Toast";
import { authApi } from "../../utils/api";
import clsx from "clsx";

const SettingsPage = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications">("profile");
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: "",
    organisation: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: "",
        organisation: ""
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const { user: updatedUser } = await authApi.updateProfile(profileForm);
      setUser(updatedUser);
      toast("Profile updated successfully", "success");
    } catch (error: any) {
      toast(error?.response?.data?.message ?? "Failed to update profile", "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast("New passwords do not match", "error");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      await authApi.updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      toast("Password updated successfully", "success");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast(error?.response?.data?.message ?? "Failed to update password", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast("Please upload an image file", "error");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast("Image size must be less than 5MB", "error");
      return;
    }

    setAvatarLoading(true);
    try {
      const avatarUrl = await authApi.uploadToCloudinary(file);
      const { user: updatedUser } = await authApi.updateProfile({ avatarUrl });
      setUser(updatedUser);
      toast("Avatar updated successfully", "success");
    } catch (error: any) {
      toast(error?.response?.data?.message ?? "Failed to upload avatar", "error");
    } finally {
      setAvatarLoading(false);
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "security" as const, label: "Security", icon: Shield },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  return (
    <DashboardLayout>
      <div className="py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <SettingsIcon className="w-6 h-6 text-[#0C6CF2]" />
              <h1 className="text-3xl font-bold text-gray-900">
                Settings
              </h1>
            </div>
            <p className="text-[15px] text-gray-600">
              Manage your account settings and preferences
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="glass-card p-2 hover:shadow-lg transition-shadow">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      "flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-[#0C6CF2] text-white"
                        : "text-gray-600 hover:bg-blue-50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[14px] font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Avatar Upload */}
              <div className="glass-card p-8 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Profile Picture
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0C6CF2] to-[#00A1A9] flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        (user?.name || "U").charAt(0).toUpperCase()
                      )}
                    </div>
                    {avatarLoading && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="px-6 py-3 bg-gradient-to-r from-[#0C6CF2] to-[#00A1A9] hover:from-[#0A5CD9] hover:to-[#009199] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer inline-flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Upload Avatar
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={avatarLoading}
                      />
                    </label>
                    <p className="text-sm text-gray-600 mt-2">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="glass-card p-8 hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Personal Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[14px] font-medium text-gray-900 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent text-[15px]"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-gray-900 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed text-[15px]"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-gray-900 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent text-[15px]"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-gray-900 mb-2">
                        Organisation
                      </label>
                      <input
                        type="text"
                        value={profileForm.organisation}
                        onChange={(e) => setProfileForm({ ...profileForm, organisation: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent text-[15px]"
                        placeholder="Your organisation"
                      />
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={profileLoading}
                    whileHover={{ scale: profileLoading ? 1 : 1.02 }}
                    whileTap={{ scale: profileLoading ? 1 : 0.98 }}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-[#0C6CF2] to-[#00A1A9] hover:from-[#0A5CD9] hover:to-[#009199] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {profileLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>

            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <form onSubmit={handlePasswordUpdate}>
                <div className="glass-card p-8 hover:shadow-lg transition-shadow">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Security Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[14px] font-medium text-gray-900 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-2.5 pl-12 pr-12 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent text-[15px]"
                          placeholder="Enter current password"
                          required
                        />
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-gray-900 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-4 py-2.5 pl-12 pr-12 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent text-[15px]"
                          placeholder="Enter new password (min 8 characters)"
                          required
                          minLength={8}
                        />
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-gray-900 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 pl-12 pr-12 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent text-[15px]"
                          placeholder="Confirm new password"
                          required
                          minLength={8}
                        />
                        <Key className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <motion.button
                      type="submit"
                      disabled={passwordLoading}
                      whileHover={{ scale: passwordLoading ? 1 : 1.02 }}
                      whileTap={{ scale: passwordLoading ? 1 : 0.98 }}
                      className="px-6 py-3 bg-gradient-to-r from-[#0C6CF2] to-[#00A1A9] hover:from-[#0A5CD9] hover:to-[#009199] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {passwordLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Key className="w-5 h-5" />
                          Update Password
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>

              <div className="glass-card p-8 hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Security Posture
                </h2>
                <ul className="space-y-3 text-[15px] text-gray-600">
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Session cookies are httpOnly, sameSite=strict, rotated on every refresh.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Refresh tokens hashed with SHA-256, stored with TTL in Mongo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Access sharing keeps hashed OTP + QR payloads only, never plaintext.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>AES bundle persists iv + salt + ciphertext, enabling rehydration post-login.</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Email Notifications", description: "Receive updates via email" },
                  { label: "Push Notifications", description: "Get real-time alerts" },
                  { label: "SMS Notifications", description: "Receive text messages for important updates" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-4 bg-[#F7F9FB] rounded-lg">
                    <div>
                      <p className="text-[15px] font-medium text-gray-900">{item.label}</p>
                      <p className="text-[13px] text-gray-600">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#0C6CF2] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0C6CF2]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

