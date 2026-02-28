import { useState } from "react";

interface Amenity {
  icon: string;
  label: string;
}

interface ParkingLot {
  id: number;
  name: string;
  address: string;
  price: number;
  spots: number;
  spotColor: string;
  img: string;
  amenities: Amenity[];
}

const navItems = ["Dashboard", "Parking Lots", "My Bookings", "Admin Panel"] as const;
type NavItem = (typeof navItems)[number];

const navIcons: Record<NavItem, string> = {
  "Dashboard":    "⊞",
  "Parking Lots": "📍",
  "My Bookings":  "📅",
  "Admin Panel":  "⚙",
};

const parkingLots: ParkingLot[] = [
  {
    id: 1,
    name: "Downtown Plaza",
    address: "123 Main Street, Downtown",
    price: 5,
    spots: 42,
    spotColor: "bg-amber-400 text-amber-900",
    img: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&h=280&fit=crop",
    amenities: [
      { icon: "🛡️", label: "24/7 Security" },
      { icon: "⚡", label: "EV Charging" },
      { icon: "🏗️", label: "Covered Parking" },
      { icon: "📷", label: "CCTV" },
    ],
  },
  {
    id: 2,
    name: "Shopping Mall Parking",
    address: "456 Commerce Ave, West Side",
    price: 4,
    spots: 127,
    spotColor: "bg-green-400 text-green-900",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=280&fit=crop",
    amenities: [
      { icon: "⚡", label: "EV Charging" },
      { icon: "🏗️", label: "Covered Parking" },
      { icon: "🚗", label: "Car Wash" },
      { icon: "🚻", label: "Restrooms" },
    ],
  },
  {
    id: 3,
    name: "Airport Parking",
    address: "789 Airport Rd, Terminal 1",
    price: 8,
    spots: 234,
    spotColor: "bg-blue-400 text-blue-900",
    img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=280&fit=crop",
    amenities: [
      { icon: "🛡️", label: "24/7 Security" },
      { icon: "🚌", label: "Shuttle Service" },
      { icon: "🅿️", label: "Long-term Parking" },
      { icon: "📷", label: "CCTV" },
    ],
  },
  {
    id: 4,
    name: "City Center Garage",
    address: "321 Urban Plaza, City Center",
    price: 6,
    spots: 18,
    spotColor: "bg-red-400 text-red-900",
    img: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&h=280&fit=crop",
    amenities: [
      { icon: "🏗️", label: "Covered Parking" },
      { icon: "⚡", label: "EV Charging" },
      { icon: "🔓", label: "24/7 Access" },
      { icon: "🤵", label: "Valet Service" },
    ],
  },
];

export default function ParkingLots() {
  const [activeNav, setActiveNav] = useState<NavItem>("Parking Lots");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [bookedId, setBookedId] = useState<number | null>(null);

  const filtered = parkingLots.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-800"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
  

      {/* ── MAIN ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Page header */}
        <div className="fade-1 mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Parking Lots</h1>
          <p className="text-slate-400 text-sm mt-1">Find and book parking spots near you</p>
        </div>

        {/* Search bar */}
        <div className="fade-2 relative mb-6">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location or name..."
            className="search-input w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer text-base leading-none"
            >
              ✕
            </button>
          )}
        </div>

        {/* Results count */}
        {search && (
          <p className="text-xs text-slate-400 mb-4 -mt-2">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
          </p>
        )}

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-4xl mb-3">🅿️</div>
            <p className="font-medium">No parking lots found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((lot, i) => (
              <div
                key={lot.id}
                className="lot-card bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 stagger flex flex-col"
                style={{ animationDelay: `${0.06 + i * 0.07}s` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden h-44 sm:h-48 bg-slate-200 shrink-0">
                  <img
                    src={lot.img}
                    alt={lot.name}
                    className="card-img w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-liner-to-t from-black/20 to-transparent pointer-events-none" />
                  {/* Spots badge */}
                  <span className={`absolute top-3 right-3 ${lot.spotColor} text-xs font-bold px-2.5 py-1 rounded-full shadow-sm`}>
                    {lot.spots} spots
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  {/* Title + Price */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-sm font-bold text-slate-800 leading-tight">{lot.name}</h2>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <span className="text-slate-400 text-xs">$</span>
                      <span className="mono font-bold text-slate-800 text-sm">{lot.price}</span>
                      <span className="text-slate-400 text-xs">/hr</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-slate-400 text-xs shrink-0">📍</span>
                    <span className="text-xs text-slate-400 truncate">{lot.address}</span>
                  </div>

                  {/* Amenity chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
                    {lot.amenities.map((a, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-500 text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        <span className="text-xs leading-none">{a.icon}</span>
                        {a.label}
                      </span>
                    ))}
                  </div>

                  {/* Book Now button */}
                  <button
                    onClick={() => setBookedId(bookedId === lot.id ? null : lot.id)}
                    className={`
                      book-btn-main w-full py-2.5 rounded-xl text-sm font-semibold
                      cursor-pointer border-none transition-all
                      ${bookedId === lot.id
                        ? "bg-green-500 text-white"
                        : "bg-slate-900 text-white"}
                    `}
                  >
                    {bookedId === lot.id ? "✓ Booked!" : "Book Now"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Floating help button */}
      <button className="fixed bottom-5 right-5 w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-bold shadow-lg hover:bg-slate-800 transition-colors cursor-pointer border-none z-40">
        ?
      </button>
    </div>
  );
}