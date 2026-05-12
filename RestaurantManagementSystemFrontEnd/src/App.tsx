import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { AuthForm } from './components/AuthForm';
import { Dashboard } from './pages/Dashboard';
import Menu from './pages/Menu';
import { MenuCategory } from './pages/MenuCategory';
import { MenuItemDetails } from './pages/MenuItemDetails';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { ViewReservations } from './pages/ViewReservations';
import { Reviews } from './pages/Reviews';
import { Settings } from './pages/Settings';
import { Unauthorized } from './pages/Unauthorized';
import { useState } from 'react';
import { CreateOrderPage } from './pages/CreateOrderPage';
import AddCategory from './pages/AddCategory';
import AddMenuItem from './pages/AddMenu';
import { CreateReservation } from './pages/ReserveTable';

const RoleBasedRoute: React.FC<{ allowedRoles: string[], children: JSX.Element }> = ({ allowedRoles, children }) => {
  const userRole = useAuthStore(state => state.userRole);
  return allowedRoles.includes(userRole!) ? children : <Navigate to="/unauthorized" replace />;
};

export const App: React.FC = () => {
  const isAuthenticated: boolean = useAuthStore(state => state.isAuthenticated);
  const theme: string = useThemeStore(state => state.theme) || 'bg-gray-50 dark:bg-gray-900';

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  return (
    <Router>
      <div className={`min-h-screen flex ${theme}`}>
        {isAuthenticated ? (
          <>
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
              <Header toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
              <Routes>
                <Route path="/dashboard" element={<RoleBasedRoute allowedRoles={['ADMIN']} children={<Dashboard />} />} />
                <Route path="/menu" element={<RoleBasedRoute allowedRoles={['ADMIN', 'USER']} children={<Menu />} />} />
                <Route path="/menu/add-category" element={<AddCategory />} />
                <Route path="/menu/add-item" element={<AddMenuItem />} />
                <Route path="/menu/category/:categoryId" element={<RoleBasedRoute allowedRoles={['ADMIN', 'USER']} children={<MenuCategory />} />} />
                <Route path="/menu/item/:itemId" element={<RoleBasedRoute allowedRoles={['ADMIN', 'USER']} children={<MenuItemDetails />} />} />
                <Route path="/orders/create" element={<RoleBasedRoute allowedRoles={['ADMIN', 'USER']} children={<CreateOrderPage />} />} />
                <Route path="/orders" element={<RoleBasedRoute allowedRoles={['ADMIN']} children={<OrdersPage />} />} />
                <Route path="/orders/:orderId" element={<RoleBasedRoute allowedRoles={['ADMIN']} children={<OrderDetailsPage />} />} />
                <Route path="/reservations" element={<RoleBasedRoute allowedRoles={['ADMIN', 'USER']} children={<ViewReservations />} />} />
                <Route path="/reservations/reserve" element={<RoleBasedRoute allowedRoles={['ADMIN', 'USER']} children={<CreateReservation />} />} />                <Route path="/reviews" element={<RoleBasedRoute allowedRoles={['ADMIN', 'USER']} children={<Reviews />} />} />
                <Route path="/settings" element={<RoleBasedRoute allowedRoles={['ADMIN']} children={<Settings />} />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<Navigate to="/unauthorized" replace />} />
              </Routes>
            </div>
          </>
        ) : (
          <div className="w-full h-screen flex items-center justify-center p-4">
            <Routes>
              <Route path="/login" element={<AuthForm />} />
              <Route path="/signup" element={<AuthForm />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
};
