import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Coffee,
  ClipboardList,
  Settings,
  Calendar,
  MessageSquare,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Customers', path: '/customers' },
  {
    icon: Coffee,
    label: 'Menu',
    path: '/menu',
    children: [
      { label: 'View Menu', path: '/menu' },
      { label: 'Add Category', path: '/menu/add-category' },
      { label: 'Add Item', path: '/menu/add-item' },
    ],
  },
  {
    icon: ClipboardList,
    label: 'Orders',
    path: '/orders',
    children: [
      { label: 'View Orders', path: '/orders' },
      { label: 'Create Order', path: '/orders/create' },
    ],
  },
  {
    icon: Calendar,
    label: 'Reservations',
    path: '/reservations',
    children: [
      { label: 'View Reservation', path: '/reservations' },
      { label: 'Reserve Table', path: '/reservations/reserve' }
    ],
  },
  { icon: MessageSquare, label: 'Reviews', path: '/reviews' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const logout = useAuthStore((state) => state.logout);
  const location = useLocation();
  const [expandedMenu, setExpandedMenu] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Auto-expand the submenu if current route matches any of its children
    const activeMenu = menuItems.find(item =>
      item.children?.some(child => child.path === location.pathname)
    );
    if (activeMenu) {
      setExpandedMenu(activeMenu.label);
    }
  }, [location.pathname]);

  const toggleSubmenu = (label: string) => {
    setExpandedMenu((prev) => (prev === label ? null : label));
  };

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: isSidebarOpen ? 0 : -250 }}
      transition={{ duration: 0.3 }}
      className={`fixed left-0 top-0 h-screen bg-white shadow-lg p-4 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Coffee className="w-8 h-8 text-indigo-600" />
          {isSidebarOpen && <h1 className="text-xl font-bold ml-2">Restaurant MS</h1>}
        </div>
        <button onClick={() => setIsSidebarOpen(prev => !prev)} className="text-gray-600">
          {isSidebarOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </button>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div key={item.label}>
            {item.children ? (
              <button
                onClick={() => toggleSubmenu(item.label)}
                className={`flex items-center w-full px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {isSidebarOpen && (
                  <div className="flex items-center justify-between w-full">
                    {item.label}
                    {expandedMenu === item.label ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                )}
              </button>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {isSidebarOpen && item.label}
              </NavLink>
            )}

            {/* Submenu rendering */}
            {item.children && expandedMenu === item.label && isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="ml-10 mt-1 space-y-1"
              >
                {item.children.map((child) => {
                  const isChildActive = location.pathname === child.path;
                  return (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={`block text-sm px-2 py-1 rounded-md transition-colors duration-200 ${
                        isChildActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'text-gray-500 hover:bg-gray-100'
                      }`}
                    >
                      {child.label}
                    </NavLink>
                  );
                })}
              </motion.div>
            )}
          </div>
        ))}

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          {isSidebarOpen && 'Logout'}
        </button>
      </nav>
    </motion.div>
  );
};
