import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";

interface ActivityChartProps {
  data: Array<{ name: string; value: number; recovered?: number; death?: number }>;
  title?: string;
  color?: string;
  height?: number;
}

const ActivityChart = ({ data, title, color = "#2A7FBA", height = 300 }: ActivityChartProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="medical-card p-6"
    >
      {title && (
        <h3 className="text-section-header-lg text-text-dark dark:text-text-light mb-6 font-semibold">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E2E2" className="dark:stroke-border-dark" />
          <XAxis
            dataKey="name"
            stroke="#6A6A6A"
            className="dark:stroke-text-secondary"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#6A6A6A"
            className="dark:stroke-text-secondary"
            style={{ fontSize: "12px" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #E2E2E2",
              borderRadius: "8px",
            }}
            className="dark:bg-card-dark dark:border-border-dark"
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ActivityChart;

