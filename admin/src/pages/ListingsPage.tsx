import React, { useState } from 'react';
import { Home, CheckCircle, XCircle, Clock, Eye, Filter, Search } from 'lucide-react';

const ListingsPage = () => {
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const mockListings = [
    { id: '1', title: 'Modern Loft in Downtown', user: 'John Doe', price: '$2,500', status: 'PENDING', type: 'Apartment', date: '2 hours ago' },
    { id: '2', title: 'Cozy Beach House', user: 'Jane Smith', price: '$3,200', status: 'PENDING', type: 'House', date: '5 hours ago' },
    { id: '3', title: 'Luxury Villa with Pool', user: 'Mike Ross', price: '$8,500', status: 'APPROVED', type: 'Villa', date: 'Yesterday' },
  ];

  const filteredListings = mockListings.filter(l => l.status === activeTab);

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 font-outfit">Listing Moderation</h1>
          <p className="text-gray-500">Approve or reject property listings submitted by landlords.</p>
        </div>
        
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

      <div className="grid grid-cols-1 gap-6">
        {filteredListings.length > 0 ? filteredListings.map((listing) => (
          <div key={listing.id} className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-gray-100 p-6 shadow-xl shadow-blue-900/5 flex flex-col lg:flex-row lg:items-center gap-8 group hover:border-[#2D60FF]/30 transition-all">
            <div className="w-full lg:w-48 h-32 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
               <div className="w-full h-full flex items-center justify-center text-gray-300">
                 <Home size={40} />
               </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-[#2D60FF] bg-blue-50 px-2 py-1 rounded-md uppercase tracking-wider">{listing.type}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {listing.date}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1 font-outfit">{listing.title}</h3>
              <p className="text-sm text-gray-500 font-medium">Landlord: <span className="text-gray-700">{listing.user}</span></p>
              <div className="mt-4 text-2xl font-bold text-[#2D60FF] font-outfit">{listing.price}</div>
            </div>

            <div className="flex flex-row lg:flex-col gap-3">
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-200">
                <CheckCircle size={18} /> Approve
              </button>
              <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all">
                <XCircle size={18} /> Reject
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-24 bg-white/50 rounded-[2rem] border border-dashed border-gray-200">
            <div className="text-gray-300 mb-4 flex justify-center"><Home size={64} /></div>
            <h3 className="text-xl font-bold text-gray-400">No {activeTab.toLowerCase()} listings</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
