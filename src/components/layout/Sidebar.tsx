import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  Calendar, 
  Settings, 
  HelpCircle,
  PieChart
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navItems = [
    {
      name: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      to: '/'
    },
    {
      name: 'Tasks',
      icon: <CheckCircle2 size={20} />,
      to: '/tasks'
    },
    {
      name: 'Calendar',
      icon: <Calendar size={20} />,
      to: '/calendar'
    },
    {
      name: 'Reports',
      icon: <PieChart size={20} />,
      to: '/reports'
    },
    {
      name: 'Settings',
      icon: <Settings size={20} />,
      to: '/settings'
    },
    {
      name: 'Help',
      icon: <HelpCircle size={20} />,
      to: '/help'
    }
  ];

  return (
    <aside 
      className={`
        fixed top-16 left-0 bottom-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all transform ${
          isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 lg:translate-x-0 lg:w-64'
        } z-20 overflow-y-auto
      `}
    >
      <div className="p-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;