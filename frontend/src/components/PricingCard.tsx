import { ReactNode } from "react";
import clsx from "clsx";

type PricingCardProps = {
  tier: string;
  price: string;
  description: string;
  features: string[];
  accent?: boolean;
  cta?: ReactNode;
};

const PricingCard = ({ tier, price, description, features, accent, cta }: PricingCardProps) => (
  <div
    className={clsx("glass flex flex-col gap-4 border-2", accent ? "border-primary shadow-glow" : "border-white/10")}
    role="article"
    aria-label={`${tier} plan`}
  >
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">{tier}</p>
      <p className="text-4xl font-bold text-dark-navy dark:text-white">{price}</p>
      <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </div>
    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-200">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-2">
          <span role="img" aria-hidden="true">
            ✅
          </span>
          {feature}
        </li>
      ))}
    </ul>
    {cta}
  </div>
);

export default PricingCard;

