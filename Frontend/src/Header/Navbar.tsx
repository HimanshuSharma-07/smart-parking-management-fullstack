import {useState} from 'react'
import { useNavigate } from 'react-router-dom';

const navItems = ["Dashboard", "Parking Lots", "My Bookings", "Admin Panel"] as const;
type NavItem = (typeof navItems)[number];

const navIcons: Record<NavItem, string> = {
  "Dashboard":     "⊞",
  "Parking Lots":  "📍",
  "My Bookings":   "📅",
  "Admin Panel":   "⚙",
};

function Navbar() {
    const [activeNav, setActiveNav] = useState<NavItem>("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate()

  return (
    <div>
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-sm text-slate-800 shrink-0 select-none">
            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-400 flex items-center justify-center text-white text-xs">
              🅿
            </div>
            Parkify
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                  transition-all cursor-pointer border-none
                  ${activeNav === item
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"}
                `}
              >
                <a href="" className="text-xs">{navIcons[item]}</a>
                {item}
              </button>
            ))}
          </div>

          {/* User avatar + hamburger */}
          <div className="flex items-center gap-2.5">
            <div className="hidden md:block text-right">
              <div className="text-sm font-semibold leading-tight">John Doe</div>
              <div className="text-xs text-slate-400">john.doe@email.com</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shrink-0">
              JD
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`md:hidden flex flex-col justify-center gap-1.25 p-1.5 rounded-lg hover:bg-slate-100 border-none bg-transparent cursor-pointer ${menuOpen ? "open" : ""}`}
              aria-label="Toggle navigation"
            >
              <span className="ham-top block w-5 h-0.5 bg-slate-800 rounded" />
              <span className="ham-mid block w-5 h-0.5 bg-slate-800 rounded" />
              <span className="ham-bot block w-5 h-0.5 bg-slate-800 rounded" />
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="mobile-menu md:hidden bg-white border-t border-slate-100 px-4 pb-4 pt-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => { setActiveNav(item); setMenuOpen(false); }}
                className={`
                  flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium
                  text-left transition-all cursor-pointer border-none
                  ${activeNav === item
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800"}
                `}
              >
                <span className="text-xs">{navIcons[item]}</span>
                {item}
              </button>
            ))}
            <div className="flex items-center gap-3 pt-3 mt-1 border-t border-slate-100">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-indigo-400 text-white flex items-center justify-center font-bold text-xs shrink-0">
                JD
              </div>
              <div>
                <div className="text-sm font-semibold">John Doe</div>
                <div className="text-xs text-slate-400">john.doe@email.com</div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default Navbar