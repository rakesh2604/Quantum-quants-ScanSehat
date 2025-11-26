export const formatDate = (date: Date | string, locale = "en-IN") => {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
};

export const formatTime = (date: Date | string, locale = "en-IN") => {
  const value = typeof date === "string" ? new Date(date) : date;
  return value.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
};

export const relativeTime = (date: Date | string) => {
  const value = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - value.getTime();
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
};

