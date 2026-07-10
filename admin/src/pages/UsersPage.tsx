import React, { useState } from 'react';
import { User, Shield, ShieldOff, Search, MoreVertical, Filter } from 'lucide-react';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'TENANT', status: 'ACTIVE', joined: 'Oct 12, 2025' },
    { id: '2', name: 'Sarah Wilson', email: 'sarah.w@landlord.com', role: 'LANDLORD', status: 'ACTIVE', joined: 'Sep 28, 2025' },
    { id: '3', name: 'Mike Ross', email: 'mross@spam.com', role: 'TENANT', status: 'BANNED', joined: 'Nov 02, 2025' },
    { id: '4', name: 'Emma Thompson', email: 'emma.t@gmail.com', role: 'TENANT', status: 'ACTIVE', joined: 'Dec 15, 2025' },
  ];

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
          <button className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#2D60FF] hover:border-[#2D60FF] transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

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
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{user.name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${user.role === 'LANDLORD' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-gray-500 text-sm font-medium">
                  {user.joined}
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${user.status === 'ACTIVE' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.status === 'ACTIVE' ? (
                      <button title="Ban User" className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <ShieldOff size={18} />
                      </button>
                    ) : (
                      <button title="Unban User" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all">
                        <Shield size={18} />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersPage;
