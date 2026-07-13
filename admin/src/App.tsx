import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Users, Home, MessageSquare, AlertTriangle, LogOut } from 'lucide-react';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import ListingsPage from './pages/ListingsPage';

const apiUrl = import.meta.env.VITE_API_URL || 'https://hausly-backend-fs0v.onrender.com';

interface PendingListing {
  id: string;
  title: string;
  price: number;
  user?: { name: string } | null;
}

const DashboardHome = () => {
  const [stats, setStats] = useState({ users: 0, listings: 0, reports: 0 });
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
      
      const [usersRes, listingsRes, reportsRes, pendingRes] = await Promise.all([
        axios.get(`${apiUrl}/users`, { headers }),
        axios.get(`${apiUrl}/listings`, { headers }),
        axios.get(`${apiUrl}/reports`, { headers }),
        axios.get(`${apiUrl}/listings/admin/all?status=PENDING`, { headers }),
      ]);

      setStats({
        users: usersRes.data.length,
        listings: listingsRes.data.length,
        reports: reportsRes.data.length,
      });
      setPendingListings(pendingRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await axios.patch(`${apiUrl}/listings/${id}/status`, { status: 'APPROVED' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to approve listing');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.patch(`${apiUrl}/listings/${id}/status`, { status: 'REJECTED' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchDashboardData();
    } catch (err) {
      alert('Failed to reject listing');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#2D60FF] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 font-semibold">Loading dashboard stats...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total Users" value={stats.users.toString()} change="Real-time" />
        <StatCard label="Active Listings" value={stats.listings.toString()} change="Approved" />
        <StatCard label="New Reports" value={stats.reports.toString()} change="Requires Action" color={stats.reports > 0 ? 'red' : 'green'} />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-blue-900/5">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 font-outfit">Pending Approvals</h3>
          <NavLink to="/listings" className="text-[#2D60FF] font-medium text-sm">View All</NavLink>
        </div>
        
        {pendingListings.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Landlord</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-800">{listing.title}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-500 font-medium">{listing.user?.name || 'Hausly Landlord'}</td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">${listing.price.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="bg-yellow-50 text-yellow-600 text-xs font-bold px-3 py-1 rounded-full">Pending</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleApprove(listing.id)}
                        className="text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg transition-colors font-medium"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleReject(listing.id)}
                        className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-8 text-center text-gray-400 font-medium">
            No pending approvals. All listings are processed!
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'ADMIN') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-[#F5F7FA]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#2D60FF] font-outfit">Hausly Admin</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" end />
            <NavItem to="/users" icon={<Users size={20} />} label="Users" />
            <NavItem to="/listings" icon={<Home size={20} />} label="Listings" />
            <NavItem to="/reports" icon={<AlertTriangle size={20} />} label="Reports" />
          </nav>
          <div className="p-8">
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-3 text-gray-500 hover:text-red-600 transition-colors w-full"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <header className="bg-white border-b border-gray-200 p-8 flex justify-between items-center sticky top-0 z-10">
            <HeaderTitle />
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-[#2D60FF] flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </header>

          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="*" element={<div className="p-8">Page coming soon...</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function HeaderTitle() {
  const location = useLocation();
  const getTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/reports': return 'Moderation Reports';
      case '/users': return 'User Management';
      case '/listings': return 'Property Listings';
      default: return 'Admin Panel';
    }
  };
  return <h2 className="text-2xl font-bold text-gray-800">{getTitle()}</h2>;
}

function NavItem({ to, icon, label, end = false }: { to: string, icon: React.ReactNode, label: string, end?: boolean }) {
  return (
    <NavLink 
      to={to} 
      end={end}
      className={({ isActive }) => 
        `flex items-center space-x-3 p-3 rounded-xl transition-all ${isActive ? 'bg-[#2D60FF] text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-100'}`
      }
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </NavLink>
  );
}

function StatCard({ label, value, change, color = 'blue' }: { label: string, value: string, change: string, color?: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 group-hover:text-[#2D60FF] transition-colors">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-bold text-gray-800 font-outfit">{value}</h4>
        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${color === 'red' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {change}
        </span>
      </div>
    </div>
  );
}

export default App;
