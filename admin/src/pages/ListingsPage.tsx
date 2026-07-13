import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, CheckCircle, XCircle, Clock, Plus, X } from 'lucide-react';

const apiUrl = import.meta.env.VITE_API_URL || 'https://hausly-backend-fs0v.onrender.com';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: string;
  rooms: number;
  address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  images: { url: string }[];
  user?: { name: string } | null;
}

const ListingsPage = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [propertyType, setPropertyType] = useState('APARTMENT');
  const [rooms, setRooms] = useState('1');
  const [imageUrl, setImageUrl] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/listings/admin/all`, {
        params: { status: activeTab },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setListings(response.data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [activeTab]);

  const updateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      await axios.patch(`${apiUrl}/listings/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchListings();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const data = {
        title,
        description,
        price: parseFloat(price),
        address,
        propertyType,
        rooms: parseInt(rooms),
        imageUrls: imageUrl ? [imageUrl] : [],
        latitude: 0,
        longitude: 0,
      };

      // Create listing as PENDING
      const response = await axios.post(`${apiUrl}/listings`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Immediately approve it since it was posted by admin
      await axios.patch(`${apiUrl}/listings/${response.data.id}/status`, { status: 'APPROVED' }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Reset Form & Close Modal
      setTitle('');
      setDescription('');
      setPrice('');
      setAddress('');
      setPropertyType('APARTMENT');
      setRooms('1');
      setImageUrl('');
      setIsModalOpen(false);
      
      // Select APPROVED tab to show the new listing
      setActiveTab('APPROVED');
      fetchListings();
      alert('Listing created and approved successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-outfit">Listing Moderation</h1>
          <p className="text-gray-500">Approve or reject property listings submitted by landlords.</p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2D60FF] text-white rounded-xl text-sm font-bold hover:bg-blue-600 shadow-lg shadow-blue-200 transition-all"
          >
            <Plus size={16} /> Post Property Ad
          </button>
          
          <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
            {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-[#2D60FF] text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-24">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-[#2D60FF] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-semibold">Loading listings...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {listings.length > 0 ? listings.map((listing) => (
            <div key={listing.id} className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 p-6 shadow-xl shadow-blue-900/5 flex flex-col lg:flex-row lg:items-center gap-8 group hover:border-[#2D60FF]/30 transition-all">
              <div className="w-full lg:w-48 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                {listing.images && listing.images.length > 0 ? (
                  <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Home size={40} />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-[#2D60FF] bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">{listing.propertyType}</span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} /> {new Date(listing.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 font-outfit">{listing.title}</h3>
                <p className="text-sm text-gray-500 font-medium">
                  Landlord: <span className="text-gray-700">{listing.user?.name || 'Hausly Admin'}</span>
                </p>
                <p className="text-xs text-gray-400 font-medium mt-1">Location: {listing.address}</p>
                <div className="mt-4 text-2xl font-bold text-[#2D60FF] font-outfit">${listing.price.toLocaleString()}/mo</div>
              </div>

              {activeTab === 'PENDING' && (
                <div className="flex flex-row lg:flex-col gap-3">
                  <button 
                    onClick={() => updateStatus(listing.id, 'APPROVED')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200"
                  >
                    <CheckCircle size={18} /> Approve
                  </button>
                  <button 
                    onClick={() => updateStatus(listing.id, 'REJECTED')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all"
                  >
                    <XCircle size={18} /> Reject
                  </button>
                </div>
              )}
              {activeTab === 'APPROVED' && (
                <button 
                  onClick={() => updateStatus(listing.id, 'REJECTED')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all"
                >
                  <XCircle size={18} /> Reject/Deactivate
                </button>
              )}
              {activeTab === 'REJECTED' && (
                <button 
                  onClick={() => updateStatus(listing.id, 'APPROVED')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200"
                >
                  <CheckCircle size={18} /> Re-Approve
                </button>
              )}
            </div>
          )) : (
            <div className="text-center py-24 bg-white/50 rounded-[2rem] border border-dashed border-gray-200">
              <div className="text-gray-300 mb-4 flex justify-center"><Home size={64} /></div>
              <h3 className="text-xl font-bold text-gray-400">No {activeTab.toLowerCase()} listings found</h3>
            </div>
          )}
        </div>
      )}

      {/* Post Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800">Post Property Advertisement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateListing} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#2D60FF] outline-none font-medium text-slate-700 text-sm"
                  placeholder="e.g. Modern Loft in Downtown"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Description</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#2D60FF] outline-none font-medium text-slate-700 text-sm"
                  placeholder="Describe details like views, amenities, proximity to city center..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Price ($ / mo)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#2D60FF] outline-none font-medium text-slate-700 text-sm"
                    placeholder="2500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Bedrooms</label>
                  <input
                    type="number"
                    required
                    value={rooms}
                    onChange={(e) => setRooms(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#2D60FF] outline-none font-medium text-slate-700 text-sm"
                    placeholder="2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#2D60FF] outline-none font-medium text-slate-700 text-sm appearance-none"
                  >
                    <option value="APARTMENT">Apartment</option>
                    <option value="HOUSE">House</option>
                    <option value="VILLA">Villa</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Image URL</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#2D60FF] outline-none font-medium text-slate-700 text-sm"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-[#2D60FF] outline-none font-medium text-slate-700 text-sm"
                  placeholder="e.g. 123 Luxury Ln, Los Angeles, CA"
                />
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full py-4 bg-[#2D60FF] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {formLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Publish Listing'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingsPage;
