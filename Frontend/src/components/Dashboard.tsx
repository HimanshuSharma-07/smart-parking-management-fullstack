import React from "react";

const stats = [
  { title: "Total Parking Lots", value: "4", sub: "1150 total spots", color: "text-blue-600" },
  { title: "Available Spots", value: "421", sub: "Across all locations", color: "text-green-600" },
  { title: "Occupancy Rate", value: "63.4%", sub: "729 occupied", color: "text-orange-500" },
  { title: "Total Revenue", value: "$192", sub: "From completed bookings", color: "text-purple-600" },
];

const nearbyLots = [
  { name: "Downtown Plaza", address: "123 Main Street, Downtown", available: 42 },
  { name: "Shopping Mall Parking", address: "456 Commerce Ave, West Side", available: 127 },
  { name: "Airport Parking", address: "789 Airport Rd Terminal 1", available: 234 },
];

const recentActivity = [
  { lot: "Downtown Plaza", spot: "A6", date: "2/26/2026 - 2/27/2026", status: "Active" },
  { lot: "Shopping Mall Parking", spot: "B3", date: "2/28/2026 - 2/28/2026", status: "Upcoming" },
  { lot: "Airport Parking", spot: "C1", date: "2/25/2026 - 2/26/2026", status: "Completed" },
  { lot: "Shopping Mall Parking", spot: "A2", date: "2/8/2026 - 2/8/2026", status: "Cancelled" },
];

export default function Dashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
      <p className="text-gray-500 mb-6">Welcome back! Here's your parking overview.</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 text-sm">{s.title}</p>
            <h2 className={`text-2xl font-bold ${s.color}`}>{s.value}</h2>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Active Booking */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-blue-700">Active Bookings</h3>
          <p className="text-sm text-blue-600">
            You have 1 active booking and 1 upcoming booking.
          </p>
        </div>
        <button className="px-4 py-2 bg-white border rounded-lg text-sm">
          View All
        </button>
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nearby Parking Lots */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Nearby Parking Lots</h3>
            <button className="text-sm text-blue-600">View All</button>
          </div>

          {nearbyLots.map((lot, i) => (
            <div key={i} className="flex justify-between items-center border-b py-3 last:border-none">
              <div>
                <p className="font-medium">{lot.name}</p>
                <p className="text-sm text-gray-500">{lot.address}</p>
                <p className="text-sm text-red-500">{lot.available} spots available</p>
              </div>
              <button className="px-4 py-1 bg-black text-white rounded-lg text-sm">
                Book
              </button>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold mb-4">Recent Activity</h3>

          {recentActivity.map((a, i) => (
            <div key={i} className="flex justify-between items-center border-b py-3 last:border-none">
              <div>
                <p className="font-medium">{a.lot}</p>
                <p className="text-sm text-gray-500">Spot {a.spot}</p>
                <p className="text-xs text-gray-400">{a.date}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  a.status === "Active"
                    ? "bg-green-100 text-green-600"
                    : a.status === "Upcoming"
                    ? "bg-blue-100 text-blue-600"
                    : a.status === "Completed"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Spot Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {[
          { name: "Standard", count: 15, color: "bg-blue-600" },
          { name: "EV Charging", count: 24, color: "bg-green-600" },
          { name: "Large", count: 16, color: "bg-purple-600" },
          { name: "Disabled", count: 18, color: "bg-orange-500" },
        ].map((s, i) => (
          <div key={i} className={`${s.color} text-white rounded-xl p-4`}>
            <p className="text-sm">{s.name}</p>
            <h2 className="text-2xl font-bold">{s.count}</h2>
            <p className="text-xs opacity-80">Available</p>
          </div>
        ))}
      </div>
    </div>
  );
}