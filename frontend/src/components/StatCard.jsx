const StatCard = ({ title, value, icon, color = "emerald", trend }) => {
  const colorMap = {
    emerald: "from-emerald-500 to-teal-600",
    red: "from-red-500 to-rose-600",
    blue: "from-blue-500 to-indigo-600",
    amber: "from-amber-500 to-orange-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span
          className={`p-2 rounded-xl bg-gradient-to-br ${colorMap[color]} text-white text-lg`}
        >
          {icon}
        </span>
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {title !== "Transactions" && typeof value === "number"
          ? `$${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
          : value}
      </div>
      {trend && <div className="text-xs text-gray-400">{trend}</div>}
    </div>
  );
};

export default StatCard;
