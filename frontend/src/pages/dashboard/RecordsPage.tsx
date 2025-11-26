import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, FileText, Calendar, Building2, Trash2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { recordApi } from "../../utils/api";
import { formatDate } from "../../utils/date";
import { useToast } from "../../components/Toast";
import clsx from "clsx";

const RecordsPage = () => {
  const { data: records = [], isLoading } = useQuery({ 
    queryKey: ["records"], 
    queryFn: recordApi.getRecords 
  });
  const queryClient = useQueryClient();
  const toast = useToast();
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const deleteMutation = useMutation({
    mutationFn: recordApi.deleteRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records"] });
      toast("Record deleted successfully", "success");
    },
    onError: (error: any) => {
      toast(error?.response?.data?.message ?? "Failed to delete record", "error");
    }
  });

  const filteredRecords = useMemo(() => {
    let filtered = records;
    
    if (filter !== "all") {
      filtered = filtered.filter((record: any) => record.status === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter((record: any) =>
        record.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.fileType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.metadata?.facility?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [records, filter, searchTerm]);

  const groupedRecords = useMemo(() => {
    return filteredRecords.reduce<Record<string, any[]>>((acc, record: any) => {
      const facility = record.metadata?.facility ?? "Unknown Facility";
      acc[facility] = acc[facility] ? [...acc[facility], record] : [record];
      return acc;
    }, {});
  }, [filteredRecords]);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-[#E8F8F0] text-[#3BB273]",
      discharged: "bg-orange-100 text-orange-600",
      emergency: "bg-red-100 text-red-600",
      "follow-up": "bg-blue-100 text-blue-600",
    };
    return (
      <span className={clsx("px-3 py-1 rounded-full text-[12px] font-medium", styles[status as keyof typeof styles] || styles.active)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Discharged", value: "discharged" },
    { label: "Emergency", value: "emergency" },
    { label: "Follow Up", value: "follow-up" },
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-6 h-6 text-[#0C6CF2]" />
                  <h1 className="text-3xl font-bold text-gray-900">
                    Patient Records
                  </h1>
                </div>
                <p className="text-[15px] text-gray-600">
                  A comprehensive list of all current inpatients in the hospital.
                </p>
              </div>
              <Link
                to="/records/upload"
                className="px-6 py-3 bg-gradient-to-r from-[#0C6CF2] to-[#00A1A9] hover:from-[#0A5CD9] hover:to-[#009199] text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add New Record
              </Link>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <div className="glass-card p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-[#F7F9FB] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2] focus:border-transparent text-[15px]"
                />
              </div>
              <button className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-[#F7F9FB] transition-colors flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter
              </button>
              <button className="px-6 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-900 hover:bg-[#F7F9FB] transition-colors">
                Sort By
              </button>
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {filters.map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => setFilter(chip.value)}
                  className={clsx(
                    "px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-200",
                    filter === chip.value
                      ? "bg-[#0C6CF2] text-white shadow-sm"
                      : "bg-[#F7F9FB] text-gray-600 hover:bg-[#E8F4F8]"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Records by Facility */}
          {isLoading ? (
            <div className="glass-card p-12 text-center">
              <div className="w-8 h-8 border-4 border-[#0C6CF2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-[15px] text-gray-600">Loading records...</p>
            </div>
          ) : Object.keys(groupedRecords).length === 0 ? (
            <div className="glass-card p-12 text-center hover:shadow-lg transition-shadow">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-[18px] font-semibold text-gray-900 mb-2">
                No records found
              </h3>
              <p className="text-[15px] text-gray-600">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Upload your first medical record to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedRecords).map(([facility, facilityRecords], facilityIndex) => (
                <motion.div
                  key={facility}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: facilityIndex * 0.1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-[#0C6CF2]" />
                      <h3 className="text-[20px] font-semibold text-gray-900">
                        {facility}
                      </h3>
                    </div>
                    <span className="text-[13px] text-gray-600">
                      {facilityRecords.length} {facilityRecords.length === 1 ? "record" : "records"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {facilityRecords.map((record, index) => (
                      <motion.div
                        key={record._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.03, y: -4 }}
                        className="glass-card p-6 cursor-pointer hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-lg bg-[#E8F4F8] flex items-center justify-center">
                            <FileText className="w-6 h-6 text-[#0C6CF2]" />
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(record.status || "active")}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Are you sure you want to delete this record?")) {
                                  deleteMutation.mutate(record._id);
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-[16px] font-semibold text-gray-900 mb-2">
                          {record.patientName || "Unknown Patient"}
                        </h4>
                        <p className="text-[13px] text-gray-600 mb-4">
                          {record.fileType || "Medical Record"}
                        </p>

                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(new Date(record.createdAt))}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default RecordsPage;

