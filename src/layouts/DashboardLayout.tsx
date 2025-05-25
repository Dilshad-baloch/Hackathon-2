import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  CalendarClock, 
  Menu, 
  X, 
  Home, 
  Calendar, 
  Users, 
  User, 
  LogOut,
  PlusCircle,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isAdmin = profile?.role === 'admin';
  
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
  // Close mobile menu when route changes
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Create Event', href: '/events/create', icon: PlusCircle },
    { name: 'Profile', href: '/profile', icon: User },
  ];
  
  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin', icon: ShieldCheck },
    { name: 'Pending Events', href: '/admin/pending-events', icon: Calendar },
    { name: 'All Events', href: '/admin/all-events', icon: Calendar },
    { name: 'Customers', href: '/admin/customers', icon: Users },
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu */}
      <div className="lg:hidden">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
          <div className="flex items-center space-x-3">
            <CalendarClock className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">Event Manager</span>
          </div>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="border-b border-gray-200 bg-white">
            <div className="space-y-1 px-2 py-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              
              {isAdmin && (
                <>
                  <div className="my-2 border-t border-gray-200 pt-2">
                    <p className="px-3 py-1 text-xs font-semibold uppercase text-gray-500">
                      Admin
                    </p>
                  </div>
                  
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center rounded-md px-3 py-2 text-base font-medium ${
                        location.pathname === item.href
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
              
              <button
                onClick={handleLogout}
                className="flex w-full items-center rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Desktop layout */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex flex-shrink-0 items-center px-4 py-5">
            <CalendarClock className="h-8 w-8 text-blue-600" />
            <span className="ml-3 text-xl font-semibold text-gray-900">Event Manager</span>
          </div>
          <div className="mt-5 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
              
              {isAdmin && (
                <>
                  <div className="my-2 border-t border-gray-200 pt-2">
                    <p className="px-2 py-1 text-xs font-semibold uppercase text-gray-500">
                      Admin
                    </p>
                  </div>
                  
                  {adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                        location.pathname === item.href
                          ? 'bg-blue-100 text-blue-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </>
              )}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">
                  {profile?.full_name || user?.email}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="mt-1 flex items-center text-xs text-gray-500"
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="lg:pl-64">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}