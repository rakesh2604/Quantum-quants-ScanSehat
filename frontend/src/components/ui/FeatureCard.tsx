import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import Card from "./Card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

const FeatureCard = ({ icon: Icon, title, description, iconColor = "#0C6CF2" }: FeatureCardProps) => {
  return (
    <Card hover className="text-center">
      <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${iconColor}15` }}>
        <Icon className="w-8 h-8" style={{ color: iconColor }} />
      </div>
      <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
        {title}
      </h3>
      <p className="text-lg text-gray-600">
        {description}
      </p>
    </Card>
  );
};

export default FeatureCard;

