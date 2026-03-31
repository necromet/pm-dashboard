import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, ChevronDown } from 'lucide-react';
import Avatar from '../ui/Avatar';
import { notifications } from '../../data/mockData';

export default function Header({ title = 'Dashboard' }) {
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3.5 shrink-0">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-64 h-9 pl-9 pr-3 rounded-lg border border-slate-300 bg-slate-50 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>

          <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Avatar name="Alex Morgan" size="sm" />
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">Alex Morgan</p>
                    <p className="text-xs text-slate-500">alex@agencyops.com</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    Profile
                  </button>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    Settings
                  </Link>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
