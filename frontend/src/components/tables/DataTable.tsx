import { motion } from "framer-motion";
import { MoreVertical, Search, Filter } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  searchable?: boolean;
  filterable?: boolean;
  onRowClick?: (row: T) => void;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  searchable = true,
  filterable = true,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (!term) {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter((row) =>
      columns.some((col) => {
        const value = typeof col.key === "string" ? row[col.key] : "";
        return String(value).toLowerCase().includes(term.toLowerCase());
      })
    );
    setFilteredData(filtered);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="medical-card p-6"
    >
      {(title || searchable || filterable) && (
        <div className="flex items-center justify-between mb-6">
          {title && (
            <h3 className="text-section-header-lg text-text-dark dark:text-text-light font-semibold">{title}</h3>
          )}
          <div className="flex items-center gap-3">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-card-dark text-text-dark dark:text-text-light placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-body"
                />
              </div>
            )}
            {filterable && (
              <button className="p-2 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary-light dark:hover:bg-primary/10 transition-colors">
                <Filter className="w-4 h-4 text-text-secondary" />
              </button>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="text-left py-3 px-4 text-label font-semibold text-text-secondary"
                >
                  {column.label}
                </th>
              ))}
              <th className="text-right py-3 px-4 text-label font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onRowClick?.(row)}
                className={clsx(
                  "border-b border-border-light dark:border-border-dark hover:bg-primary-light dark:hover:bg-primary/5 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <td key={String(column.key)} className="py-4 px-4 text-body text-text-dark dark:text-text-light">
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key] || "-")}
                  </td>
                ))}
                <td className="py-4 px-4 text-right">
                  <button className="p-2 rounded-lg hover:bg-primary-light dark:hover:bg-primary/10 transition-colors">
                    <MoreVertical className="w-4 h-4 text-text-secondary" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-body text-text-secondary">No data found</p>
        </div>
      )}
    </motion.div>
  );
}

export default DataTable;

