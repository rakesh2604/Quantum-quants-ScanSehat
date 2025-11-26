import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Users, Activity, Heart, FileText, LayoutDashboard, Stethoscope } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PremiumKPICard from "../../components/cards/PremiumKPICard";
import PatientStatusChart from "../../components/charts/PatientStatusChart";
import DataTable from "../../components/tables/DataTable";
import { recordApi } from "../../utils/api";
import { formatDate } from "../../utils/date";

const DashboardPage = () => {
  const { data: summary } = useQuery({ 
    queryKey: ["records", "summary"], 
    queryFn: recordApi.getSummary 
  });
  const { data: latestRecords = [] } = useQuery({ 
    queryKey: ["records", "latest"], 
    queryFn: recordApi.getLatest 
  });

  // Patient status chart data
  const patientStatusData = [
    { name: "Jan", recovered: 120, death: 5 },
    { name: "Feb", recovered: 150, death: 8 },
    { name: "Mar", recovered: 180, death: 10 },
    { name: "Apr", recovered: 200, death: 12 },
    { name: "May", recovered: 220, death: 15 },
    { name: "Jun", recovered: 250, death: 18 },
    { name: "Jul", recovered: 280, death: 20 },
    { name: "Aug", recovered: 300, death: 22 },
    { name: "Sep", recovered: 320, death: 25 },
    { name: "Oct", recovered: 350, death: 28 },
    { name: "Nov", recovered: 380, death: 30 },
    { name: "Dec", recovered: 400, death: 32 },
  ];

  // Recent patients table data
  const recentPatients = (latestRecords || []).slice(0, 10).map((record: any) => ({
    id: record._id,
    name: record.patientName || "Unknown Patient",
    gender: "Male",
    weight: "75 kg",
    disease: record.fileType || "General",
    date: formatDate(new Date(record.createdAt)),
    status: "Outpatient",
  }));

  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "gender", label: "Gender" },
    { key: "weight", label: "Weight" },
    { key: "disease", label: "Disease" },
    { key: "date", label: "Date" },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <span className="px-3 py-1 rounded-full text-[12px] font-medium bg-[#E8F8F0] text-[#3BB273]">
          {value}
        </span>
      ),
    },
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
              <LayoutDashboard className="w-6 h-6 text-[#0C6CF2]" />
              <h1 className="text-3xl font-bold text-gray-900">
                Dashboard
              </h1>
            </div>
            <p className="text-[15px] text-gray-600">
              Welcome back! Here's your health overview.
            </p>
          </motion.div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumKPICard
              title="Total Patients"
              value={summary?.totalPatients ?? 0}
              change={6.3}
              changeLabel="Increased by +80 patients compared to last week"
              icon={Users}
              iconBgColor="bg-[#E8F4F8]"
              iconColor="text-[#2A7FBA]"
              miniChart={[
                { value: 120 },
                { value: 150 },
                { value: 180 },
                { value: 200 },
                { value: 220 },
              ]}
              delay={0}
            />
            <PremiumKPICard
              title="Emergency Cases"
              value={summary?.emergencyCases ?? 84}
              change={2.6}
              changeLabel="Currently, 32 staff members are active"
              icon={Activity}
              iconBgColor="bg-red-50"
              iconColor="text-red-500"
              miniChart={[
                { value: 70 },
                { value: 75 },
                { value: 80 },
                { value: 82 },
                { value: 84 },
              ]}
              delay={0.1}
            />
            <PremiumKPICard
              title="Average Length of Stay"
              value={summary?.avgLengthOfStay ?? "7.5 days"}
              change={2.6}
              changeLabel="Currently, 32 staff members are active"
              icon={Heart}
              iconBgColor="bg-[#E8F8F0]"
              iconColor="text-[#3BB273]"
              miniChart={[
                { value: 7.0 },
                { value: 7.2 },
                { value: 7.3 },
                { value: 7.4 },
                { value: 7.5 },
              ]}
              delay={0.2}
            />
            <PremiumKPICard
              title="Total Records"
              value={summary?.totalRecords ?? 0}
              change={12.5}
              changeLabel="New records added this month"
              icon={FileText}
              iconBgColor="bg-[#E8F4F8]"
              iconColor="text-[#2A7FBA]"
              miniChart={[
                { value: 100 },
                { value: 120 },
                { value: 140 },
                { value: 160 },
                { value: 180 },
              ]}
              delay={0.3}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatientStatusChart data={patientStatusData} height={350} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[18px] font-semibold text-gray-900">Best Doctor</h3>
                <select className="text-[13px] text-gray-600 bg-[#F7F9FB] border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0C6CF2]">
                  <option>This Year</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 mx-auto mb-4 flex items-center justify-center">
                  <Stethoscope className="w-10 h-10 text-blue-600" />
                </div>
                <h4 className="text-[18px] font-semibold text-gray-900 mb-1">
                  Dr. Jonathan Wallace
                </h4>
                <p className="text-[13px] text-gray-600 mb-6">
                  Endocrinologists - Sidney Hospital
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#E8F4F8] rounded-lg p-3 text-center">
                    <p className="text-[14px] font-semibold text-gray-900">8 Years</p>
                    <p className="text-[11px] text-gray-600">Experience</p>
                  </div>
                  <div className="bg-[#E8F4F8] rounded-lg p-3 text-center">
                    <p className="text-[14px] font-semibold text-gray-900">2,598</p>
                    <p className="text-[11px] text-gray-600">Patients</p>
                  </div>
                  <div className="bg-[#E8F4F8] rounded-lg p-3 text-center">
                    <p className="text-[14px] font-semibold text-gray-900">1537</p>
                    <p className="text-[11px] text-gray-600">Reviews</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Patients Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <DataTable
              data={recentPatients}
              columns={tableColumns}
              title="Recent Patients"
              searchable
              filterable
              onRowClick={(row) => console.log("Row clicked:", row)}
            />
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;

