import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string; // e.g. "text-emerald-600 bg-emerald-50"
};

const StatCard = ({ title, value, icon: Icon, colorClass = "text-gray-600 bg-gray-50" }: Props) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500 font-medium">{title}</div>
      </div>
    </div>
  );
};

export default StatCard;