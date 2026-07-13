import React, { useState } from 'react';
import { Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'https://hausly-backend-fs0v.onrender.com';

const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, { email, password });
      const { access_token, user } = response.data;
      
      if (user.role !== 'ADMIN') {
        setError('Access denied. Only administrators can access this portal.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials or connection issue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-[#2D60FF] rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-200">
              H
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
              <p className="text-sm text-gray-500 font-medium">Hausly Management System</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-medium animate-shake">
              <AlertTriangle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#2D60FF] outline-none transition-all font-medium text-gray-800"
                  placeholder="admin@hausly.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-[#2D60FF] outline-none transition-all font-medium text-gray-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#2D60FF] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
              <span className="bg-white px-4 text-gray-400">Security Verified</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
              Google SSO
            </button>
            <button className="flex items-center justify-center gap-2 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600">
              <img src="https://www.svgrepo.com/show/511330/apple-fill.svg" className="w-4 h-4" alt="Apple" />
              Apple ID
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 px-10 py-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium">
          <span>&copy; 2026 Hausly Admin</span>
          <a href="#" className="hover:text-[#2D60FF] transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
