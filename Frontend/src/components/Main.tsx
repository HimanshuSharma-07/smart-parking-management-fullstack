interface StatCard {
  label: string;
  value: string;
  sub: string;
  icon: string;
  iconBg: string;
}

interface ParkingLot {
  name: string;
  addr: string;
  spots: number;
  chipBg: string;
  chipText: string;
  img: string;
}

interface ActivityItem {
  loc: string;
  spot: string;
  date: string;
  status: "Active" | "Upcoming" | "Completed" | "Cancelled";
}

interface SpotType {
  label: string;
  count: number;
  icon: string;
  grad: string;
}

const statusConfig: Record<
  ActivityItem["status"],
  { bg: string; text: string; dot: boolean }
> = {
  Active:    { bg: "bg-green-100",  text: "text-green-700",  dot: true  },
  Upcoming:  { bg: "bg-blue-100",   text: "text-blue-700",   dot: false },
  Completed: { bg: "bg-gray-100",   text: "text-gray-500",   dot: false },
  Cancelled: { bg: "bg-red-100",    text: "text-red-600",    dot: false },
};

const statCards: StatCard[] = [
  { label: "Total Parking Lots", value: "4",     sub: "1,150 total spots",       icon: "📍", iconBg: "bg-blue-50"   },
  { label: "Available Spots",    value: "421",   sub: "Across all locations",    icon: "🚗", iconBg: "bg-green-50"  },
  { label: "Occupancy Rate",     value: "63.4%", sub: "729 occupied",            icon: "📈", iconBg: "bg-orange-50" },
  { label: "Total Revenue",      value: "$192",  sub: "From completed bookings", icon: "💰", iconBg: "bg-purple-50" },
];

const parkingLots: ParkingLot[] = [
  {
    name: "Downtown Plaza",
    addr: "123 Main Street, Downtown",
    spots: 42,
    chipBg: "bg-amber-100", chipText: "text-amber-600",
    img: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=80&h=60&fit=crop",
  },
  {
    name: "Shopping Mall Parking",
    addr: "456 Commerce Ave, West Side",
    spots: 127,
    chipBg: "bg-green-100", chipText: "text-green-600",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=60&fit=crop",
  },
  {
    name: "Airport Parking",
    addr: "789 Airport Rd, Terminal 1",
    spots: 234,
    chipBg: "bg-blue-100", chipText: "text-blue-600",
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=80&h=60&fit=crop",
  },
];

const activityItems: ActivityItem[] = [
  { loc: "Downtown Plaza",        spot: "Spot: A6", date: "2/26/2026 - 2/27/2026", status: "Active"    },
  { loc: "Shopping Mall Parking", spot: "Spot: B3", date: "2/28/2026 - 2/28/2026", status: "Upcoming"  },
  { loc: "Airport Parking",       spot: "Spot: C1", date: "2/25/2026 - 2/26/2026", status: "Completed" },
  { loc: "Shopping Mall Parking", spot: "Spot: A2", date: "2/8/2026 - 2/8/2026",   status: "Cancelled" },
];

const spotTypes: SpotType[] = [
  { label: "Standard",    count: 15, icon: "🚗", grad: "from-blue-500 to-blue-700"    },
  { label: "EV Charging", count: 24, icon: "⚡", grad: "from-green-500 to-green-700"  },
  { label: "Large",       count: 16, icon: "🚌", grad: "from-purple-500 to-purple-700" },
  { label: "Disabled",    count: 18, icon: "♿", grad: "from-orange-500 to-orange-700" },
];


function Main() {
  return (
    <div>
        
{/* ───────────── MAIN CONTENT ───────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4">

        {/* Page header */}
        <div className="fade-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back! Here's your parking overview.</p>
        </div>

        {/* ── Stat cards ── */}
        <div className="fade-2 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {statCards.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium leading-tight">{s.label}</span>
                <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center text-base shrink-0 ml-2`}>
                  {s.icon}
                </div>
              </div>
              <div className="mono text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight leading-none mb-1">
                {s.value}
              </div>
              <div className="text-xs text-slate-300">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Active bookings banner ── */}
        <div className="fade-3 bg-indigo-50 border border-indigo-200 rounded-xl px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <span className="text-base shrink-0 mt-0.5">ℹ️</span>
            <div>
              <div className="text-sm font-bold text-indigo-600">Active Bookings</div>
              <p className="text-sm text-indigo-500 mt-0.5">
                You have <span className="font-bold">1 active booking</span> and{" "}
                <span className="font-bold">1 upcoming booking</span>.
              </p>
            </div>
          </div>
          <button className="bg-white text-indigo-600 border border-indigo-200 rounded-lg px-4 py-1.5 text-sm font-semibold hover:bg-indigo-50 transition-colors cursor-pointer shrink-0">
            View All
          </button>
        </div>

        {/* ── Nearby lots + Recent activity ── */}
        <div className="fade-4 grid grid-cols-1 lg:grid-cols-[1fr_1.45fr] gap-4">

          {/* Nearby lots */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-800">Nearby Parking Lots</span>
              <button className="text-xs text-indigo-500 font-semibold hover:underline bg-transparent border-none cursor-pointer">
                View All
              </button>
            </div>

            {parkingLots.map((lot, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 py-3 ${i < parkingLots.length - 1 ? "border-b border-slate-50" : ""}`}
              >
                <img
                  src={lot.img}
                  alt={lot.name}
                  className="w-14 h-12 rounded-xl object-cover shrink-0 bg-slate-100"
                  onError={(e) => { (e.target as HTMLImageElement).style.background = "#e5e7eb"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">{lot.name}</div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">{lot.addr}</div>
                  <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mt-1.5 ${lot.chipBg} ${lot.chipText}`}>
                    {lot.spots} spots available
                  </span>
                </div>
                <button className="bg-slate-800 text-white rounded-lg px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-700 active:scale-95 transition-all cursor-pointer border-none shrink-0">
                  Book
                </button>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <div className="text-sm font-bold text-slate-800 mb-2">Recent Activity</div>

            {activityItems.map((item, i) => {
              const s = statusConfig[item.status];
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 py-3 ${i < activityItems.length - 1 ? "border-b border-slate-50" : ""}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-base shrink-0">
                    📅
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 truncate">{item.loc}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.spot}</div>
                    <div className="text-xs text-slate-300 mt-0.5">{item.date}</div>
                  </div>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${s.bg} ${s.text}`}>
                    {s.dot && (
                      <span className="pulse-anim w-1.5 h-1.5 rounded-full bg-green-500 inline-block shrink-0" />
                    )}
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Spot type cards ── */}
        <div className="fade-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {spotTypes.map((type, i) => (
            <div
              key={i}
              className={`type-shimmer relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white bg-linear-to-br ${type.grad} hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 cursor-default`}
            >
              <div className="text-xl mb-1.5 relative z-10">{type.icon}</div>
              <div className="text-xs font-medium opacity-80 relative z-10">{type.label}</div>
              <div className="mono text-3xl sm:text-4xl font-bold mt-1 leading-none relative z-10">
                {type.count}
              </div>
              <div className="text-xs opacity-65 mt-1 relative z-10">Available</div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default Main