import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, MessageSquare, AlertTriangle, LogOut } from 'lucide-react';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import UsersPage from './pages/UsersPage';
import ListingsPage from './pages/ListingsPage';

const DashboardHome = () => {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Users" value="1,284" change="+12%" />
        <StatCard label="Active Listings" value="452" change="+5%" />
        <StatCard label="New Reports" value="12" change="-2" color="red" />
        <StatCard label="Active Chats" value="89" change="+18%" />
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-blue-900/5">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 font-outfit">Pending Approvals</h3>
          <button className="text-[#2D60FF] font-medium text-sm">View All</button>
        </div>
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
            <ListingRow 
              title="Modern Loft in Downtown" 
              user="John Doe" 
              price="$2,500" 
              status="Pending" 
            />
            <ListingRow 
              title="Cozy Beach House" 
              user="Jane Smith" 
              price="$3,200" 
              status="Pending" 
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};


function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-[#F5F7FA]">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-[#2D60FF]">Hausly Admin</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <NavItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" end />
            <NavItem to="/users" icon={<Users size={20} />} label="Users" />
            <NavItem to="/listings" icon={<Home size={20} />} label="Listings" />
            <NavItem to="/messages" icon={<MessageSquare size={20} />} label="Messages" />
            <NavItem to="/reports" icon={<AlertTriangle size={20} />} label="Reports" />
          </nav>
          <div className="p-8">
            <button 
              onClick={() => setIsAuthenticated(false)}
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

function ListingRow({ title, user, price, status }: { title: string, user: string, price: string, status: string }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <p className="font-bold text-gray-800">{title}</p>
      </td>
      <td className="px-6 py-4 text-gray-500 font-medium">{user}</td>
      <td className="px-6 py-4 text-gray-800 font-semibold">{price}</td>
      <td className="px-6 py-4">
        <span className="bg-yellow-50 text-yellow-600 text-xs font-bold px-3 py-1 rounded-full">{status}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex space-x-2">
          <button className="text-green-600 hover:bg-green-50 px-3 py-1 rounded-lg transition-colors font-medium">Approve</button>
          <button className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors font-medium">Reject</button>
        </div>
      </td>
    </tr>
  );
}

export default App;
