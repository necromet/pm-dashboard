import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  Users,
  FileText,
  BarChart3,
  Settings,
  Building2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { clients } from '../../data/mockData';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/pipeline', label: 'Pipeline', icon: Kanban },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/briefs', label: 'Briefs', icon: FileText },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen = true, onToggle }) {
  const location = useLocation();
  const isClientsActive = location.pathname.startsWith('/clients');

  return (
    <aside
      className={`bg-slate-900 text-white flex flex-col shrink-0 min-h-screen transition-all duration-200 ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className={`py-5 border-b border-slate-800 flex items-center ${isOpen ? 'px-6 justify-between' : 'px-3 justify-center'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          {isOpen && <span className="text-lg font-bold tracking-tight">Agency Ops</span>}
        </div>
        {isOpen && (
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}
      </div>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="mx-auto mt-2 mb-1 text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          title="Expand sidebar"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>
      )}

      <nav className={`flex-1 py-4 space-y-1 ${isOpen ? 'px-3' : 'px-2'}`}>
        {navItems.map(({ to, label, icon: NavIcon }) => {
          if (to === '/clients') {
            return (
              <div key={to}>
                <NavLink
                  to={to}
                  title={label}
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isOpen ? 'px-3' : 'px-0 justify-center'
                    } ${
                      isActive || isClientsActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <NavIcon className="w-5 h-5 shrink-0" />
                  {isOpen && label}
                </NavLink>
                {isClientsActive && isOpen && (
                  <div className="ml-9 mt-1 space-y-0.5">
                    {clients.map((client) => (
                      <NavLink
                        key={client.id}
                        to={`/clients/${client.id}`}
                        className={({ isActive }) =>
                          `block px-3 py-1.5 rounded-md text-xs transition-colors ${
                            isActive
                              ? 'text-white bg-slate-700'
                              : 'text-slate-400 hover:text-white hover:bg-slate-800'
                          }`
                        }
                      >
                        <span className="mr-1.5">{client.logo}</span>
                        {client.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={label}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isOpen ? 'px-3' : 'px-0 justify-center'
                } ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <NavIcon className="w-5 h-5 shrink-0" />
              {isOpen && label}
            </NavLink>
          );
        })}
      </nav>

      <div className={`py-4 border-t border-slate-800 ${isOpen ? 'px-4' : 'px-2'}`}>
        <div className={`flex items-center ${isOpen ? 'gap-3' : 'justify-center'}`}>
          <Avatar name="Alex Morgan" size="sm" />
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Alex Morgan</p>
              <p className="text-xs text-slate-400 truncate">Agency Leader</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
