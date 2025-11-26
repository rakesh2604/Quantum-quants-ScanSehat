import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FileText, Users, Share2, Brain, TrendingUp } from "lucide-react";
import Header from "../components/Header";

const TempDashboard = () => {
  // Dummy stats data
  const stats = {
    totalRecords: 1280,
    sharedRecords: 342,
    hospitals: 18,
    aiInsights: 92,
  };

  // Dummy recent records
  const recentRecords = [
    { id: "R-1032", patient: "Aarav Sharma", date: "2025-01-19", status: "Verified" },
    { id: "R-1028", patient: "Meera Patel", date: "2025-01-18", status: "Pending" },
    { id: "R-1025", patient: "Rahul Verma", date: "2025-01-17", status: "Shared" },
    { id: "R-1019", patient: "Sana Sheikh", date: "2025-01-15", status: "Verified" },
  ];

  // Dummy chart data (7 days)
  const chartData = [
    { name: "Day 1", records: 45, shared: 12 },
    { name: "Day 2", records: 52, shared: 18 },
    { name: "Day 3", records: 38, shared: 15 },
    { name: "Day 4", records: 61, shared: 22 },
    { name: "Day 5", records: 55, shared: 19 },
    { name: "Day 6", records: 48, shared: 16 },
    { name: "Day 7", records: 67, shared: 24 },
  ];

  const statCards = [
    {
      icon: FileText,
      label: "Total Records",
      value: stats.totalRecords,
      change: "+12%",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      icon: Users,
      label: "Active Hospitals",
      value: stats.hospitals,
      change: "+3",
      color: "from-teal-500 to-emerald-500",
      bgGradient: "from-teal-50 to-emerald-50",
    },
    {
      icon: Share2,
      label: "Shared Records",
      value: stats.sharedRecords,
      change: "+8%",
      color: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-50 to-purple-50",
    },
    {
      icon: Brain,
      label: "AI Insights",
      value: stats.aiInsights,
      change: "+15%",
      color: "from-violet-500 to-pink-500",
      bgGradient: "from-violet-50 to-pink-50",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Shared":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F8FA] via-white to-[#F0F9FF]">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0C6CF2] via-[#00A1A9] to-[#0C6CF2] p-8 md:p-12 text-white">
            {/* Animated gradient blobs */}
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"
              animate={{
                x: [0, -40, 0],
                y: [0, 40, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <div className="relative z-10">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl md:text-5xl font-black mb-4"
              >
                Dashboard Overview
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-white/90 max-w-2xl"
              >
                Real-time insights into your medical records and healthcare analytics
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="relative glass-card rounded-2xl p-6 border border-white/20 bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} opacity-40 blur-2xl -z-10 group-hover:opacity-60 transition-opacity duration-300`} />
                  
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{card.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{card.value.toLocaleString()}</h3>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {card.change}
                      </span>
                    </div>
                  </div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Chart and Table Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Chart Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-2xl p-6 border border-white/20 bg-white/80 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Records Activity</h2>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="name"
                  stroke="#64748B"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#64748B"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="square"
                />
                <Line
                  type="monotone"
                  dataKey="records"
                  stroke="#0C6CF2"
                  strokeWidth={3}
                  name="Records"
                  dot={{ fill: "#0C6CF2", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="shared"
                  stroke="#00A1A9"
                  strokeWidth={3}
                  name="Shared"
                  dot={{ fill: "#00A1A9", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Latest Records Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="glass-card rounded-2xl p-6 border border-white/20 bg-white/80 backdrop-blur-xl shadow-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Records</h2>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRecords.map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">{record.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{record.patient}</td>
                      <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{record.date}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Temporary Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="glass-card rounded-2xl p-6 border border-yellow-200 bg-yellow-50/80 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">!</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-1">Temporary Dashboard</h3>
              <p className="text-sm text-yellow-800">
                This is a temporary dashboard displaying dummy data. The OAuth login system is currently being fixed. 
                All data shown here is for demonstration purposes only.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TempDashboard;

