import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

interface PatientStatusChartProps {
  data: Array<{ name: string; recovered: number; death: number }>;
  height?: number;
}

const PatientStatusChart = ({ data, height = 350 }: PatientStatusChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-[#2A2A2A] rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-[#E2E2E2] dark:border-[#3A3A3A]"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[18px] font-semibold text-[#1E1E1E] dark:text-white">Patient Status</h3>
        <select className="text-[13px] text-[#6A6A6A] dark:text-[#9A9A9A] bg-[#F7F9FB] dark:bg-[#3A3A3A] border border-[#E2E2E2] dark:border-[#3A3A3A] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary">
          <option>This Year</option>
          <option>Last Year</option>
          <option>Last 6 Months</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E2" className="dark:stroke-[#3A3A3A]" />
          <XAxis
            dataKey="name"
            stroke="#6A6A6A"
            className="dark:stroke-[#9A9A9A]"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#6A6A6A"
            className="dark:stroke-[#9A9A9A]"
            style={{ fontSize: "12px" }}
            domain={[0, 200]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E2E2E2",
              borderRadius: "8px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}
            className="dark:bg-[#2A2A2A] dark:border-[#3A3A3A]"
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="square"
          />
          <Line
            type="monotone"
            dataKey="recovered"
            stroke="#2A7FBA"
            strokeWidth={3}
            name="Recovered"
            dot={{ fill: "#2A7FBA", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="death"
            stroke="#DC2626"
            strokeWidth={3}
            name="Death"
            dot={{ fill: "#DC2626", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PatientStatusChart;

