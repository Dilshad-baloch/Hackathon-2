import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/dashboard/Dashboard';
import Events from './pages/events/Events';
import EventDetails from './pages/events/EventDetails';
import CreateEvent from './pages/events/CreateEvent';
import EditEvent from './pages/events/EditEvent';
import Participants from './pages/participants/Participants';
import Profile from './pages/profile/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import PendingEvents from './pages/admin/PendingEvents';
import AllEvents from './pages/admin/AllEvents';
import Customers from './pages/admin/Customers';
import CustomerDetails from './pages/admin/CustomerDetails';
import NotFound from './pages/NotFound';

function App() {
  const { user, profile, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<DashboardLayout />}>
            {/* Common Routes */}
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/events" element={user ? <Events /> : <Navigate to="/login" />} />
            <Route path="/events/:id" element={user ? <EventDetails /> : <Navigate to="/login" />} />
            <Route path="/events/create" element={user ? <CreateEvent /> : <Navigate to="/login" />} />
            <Route path="/events/edit/:id" element={user ? <EditEvent /> : <Navigate to="/login" />} />
            <Route path="/events/:id/participants" element={user ? <Participants /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={user && profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/admin/pending-events" 
              element={user && profile?.role === 'admin' ? <PendingEvents /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/admin/all-events" 
              element={user && profile?.role === 'admin' ? <AllEvents /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/admin/customers" 
              element={user && profile?.role === 'admin' ? <Customers /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/admin/customers/:id" 
              element={user && profile?.role === 'admin' ? <CustomerDetails /> : <Navigate to="/dashboard" />} 
            />
          </Route>

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </>
  );
}

export default App;