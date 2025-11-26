import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, User, FileText, Shield, AlertCircle, CheckCircle, ClipboardList } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { logsApi } from "../../utils/api";
import { formatDate } from "../../utils/date";

interface AccessLog {
  _id: string;
  doctorEmail: string;
  action: string;
  details?: {
    doctorName?: string;
    accessedFiles?: number;
    mode?: string;
    accessedAt?: string;
    count?: number;
  };
  createdAt: string;
}

const AuditLogsPage = () => {
  const { data: logs = [], isLoading } = useQuery<AccessLog[]>({
    queryKey: ["audit-logs"],
    queryFn: logsApi.getLogs
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "OTP_ISSUED":
      case "QR_ISSUED":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case "OTP_REDEEMED":
      case "QR_REDEEMED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "RECORDS_VIEWED":
        return <FileText className="w-5 h-5 text-purple-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case "OTP_ISSUED":
        return "OTP Generated";
      case "QR_ISSUED":
        return "QR Code Generated";
      case "OTP_REDEEMED":
        return "OTP Redeemed";
      case "QR_REDEEMED":
        return "QR Code Redeemed";
      case "RECORDS_VIEWED":
        return "Records Viewed";
      default:
        return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "OTP_ISSUED":
      case "QR_ISSUED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "OTP_REDEEMED":
      case "QR_REDEEMED":
        return "bg-green-50 text-green-700 border-green-200";
      case "RECORDS_VIEWED":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

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
              <ClipboardList className="w-6 h-6 text-[#0C6CF2]" />
              <h1 className="text-3xl font-bold text-gray-900">
                Audit Logs
              </h1>
            </div>
            <p className="text-[15px] text-gray-600">
              Track all access to your medical records
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Access Events</p>
                  <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#0C6CF2]" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Unique Doctors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(logs.map(log => log.doctorEmail)).size}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <User className="w-6 h-6 text-[#00A1A9]" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Records Viewed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {logs
                      .filter(log => log.action === "RECORDS_VIEWED")
                      .reduce((sum, log) => sum + (log.details?.count || 0), 0)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Logs List */}
          {isLoading ? (
            <div className="glass-card p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0C6CF2] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading audit logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="glass-card p-12 text-center hover:shadow-lg transition-shadow">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Access Logs</h3>
              <p className="text-gray-600">No one has accessed your medical records yet.</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F7F9FB] border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Timestamp
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.map((log, index) => (
                      <motion.tr
                        key={log._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-[#F7F9FB] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {getActionIcon(log.action)}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                              {getActionLabel(log.action)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">
                              {log.details?.doctorName || log.doctorEmail}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{log.doctorEmail}</p>
                        </td>
                        <td className="px-6 py-4">
                          {log.details?.accessedFiles && (
                            <span className="text-sm text-gray-900">
                              {log.details.accessedFiles} file(s) accessed
                            </span>
                          )}
                          {log.details?.count && (
                            <span className="text-sm text-gray-900">
                              {log.details.count} record(s) viewed
                            </span>
                          )}
                          {log.details?.mode && (
                            <span className="text-xs text-gray-600 block mt-1">
                              Mode: {log.details.mode}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(new Date(log.createdAt))}</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogsPage;

