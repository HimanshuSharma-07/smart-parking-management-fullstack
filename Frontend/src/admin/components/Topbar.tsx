import { UserCircle } from "lucide-react";

const Topbar = () => {
  return (
    <div className="h-16 bg-white flex items-center justify-between px-8 border-b border-gray-200 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-gray-800">Overview</h1>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        <UserCircle className="w-7 h-7 text-gray-400" />
        Admin
      </div>
    </div>
  );
};

export default Topbar;