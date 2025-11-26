import { LucideIcon } from "lucide-react";
import Card from "./Card";

interface ProblemCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "problem" | "solution";
}

const ProblemCard = ({ icon: Icon, title, description, variant = "problem" }: ProblemCardProps) => {
  const isProblem = variant === "problem";
  const bgColor = isProblem ? "bg-red-50" : "bg-green-50";
  const borderColor = isProblem ? "border-red-100" : "border-green-100";
  const iconBg = isProblem ? "bg-red-100" : "bg-green-100";
  const iconColor = isProblem ? "text-red-600" : "text-green-600";

  return (
    <Card className={`${bgColor} ${borderColor} transition-all duration-300 hover:translate-y-[-2px] hover:shadow-card`}>
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 ${iconBg} ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-lg text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ProblemCard;

