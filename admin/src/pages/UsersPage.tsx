import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Shield, ShieldOff, Search, Filter } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL || 'https://hausly-backend-fs0v.onrender.com';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'TENANT' | 'LANDLORD' | 'ADMIN';
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  createdAt: string;
}

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUserStatus = async (id: string, status: 'ACTIVE' | 'BANNED') => {
    try {
      await axios.patch(`${apiUrl}/users/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => 
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-outfit">User Management</h1>
          <p className="text-gray-500">View and manage all registered users on the platform.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#2D60FF] transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-[#2D60FF] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-semibold">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-blue-900/5">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                        {user.name ? user.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{user.name || 'Anonymous User'}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${user.role === 'LANDLORD' ? 'bg-purple-50 text-purple-600' : user.role === 'ADMIN' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-gray-500 text-sm font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {user.role !== 'ADMIN' && (
                        user.status === 'ACTIVE' ? (
                          <button 
                            onClick={() => updateUserStatus(user.id, 'BANNED')}
                            title="Ban User" 
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <ShieldOff size={18} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => updateUserStatus(user.id, 'ACTIVE')}
                            title="Unban User" 
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                          >
                            <Shield size={18} />
                          </button>
                        )
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
