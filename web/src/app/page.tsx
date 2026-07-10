"use client";

import React, { useState, useEffect } from 'react';
import { Search, Home, MapPin, DollarSign, Bed, Compass, ChevronRight, Star, Shield, HelpCircle, Layers } from 'lucide-react';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  propertyType: string;
  rooms: number;
  facilities: string[];
  status: string;
  createdAt: string;
  images: { url: string }[];
  user: {
    name: string;
    avatarUrl: string | null;
    isVerified: boolean;
  };
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & filter states
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [rooms, setRooms] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Local fallback data if backend is empty/offline
  const mockListings: Listing[] = [
    {
      id: "mock-1",
      title: "Penthouse Overlooking Central Park",
      description: "Live in absolute luxury. High floor penthouse with full floor-to-ceiling windows, wrap-around terrace, private elevator access, and a custom designer kitchen.",
      price: 12500,
      address: "Central Park West, New York",
      propertyType: "APARTMENT",
      rooms: 4,
      facilities: ["Wifi", "Gym", "Concierge", "Terrace"],
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      images: [{ url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800" }],
      user: { name: "Sarah Landlord", avatarUrl: null, isVerified: true }
    },
    {
      id: "mock-2",
      title: "Ultra Modern Sunset Villa",
      description: "Stunning architectural marvel. Private infinity pool, smart-home automation, professional theater room, and breathtaking sunset panoramas.",
      price: 9500,
      address: "Hollywood Hills, Los Angeles",
      propertyType: "VILLA",
      rooms: 5,
      facilities: ["Pool", "Cinema", "Smart Home", "Security"],
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      images: [{ url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=800" }],
      user: { name: "Marcus Sterling", avatarUrl: null, isVerified: true }
    },
    {
      id: "mock-3",
      title: "Charming Coastal House",
      description: "Step directly onto the sand. Bright and airy cottage with exposed wooden beams, open deck, ocean views, and a cozy fireplace for cool evenings.",
      price: 4800,
      address: "Malibu Beach Road, Malibu",
      propertyType: "HOUSE",
      rooms: 3,
      facilities: ["Beach Access", "Fireplace", "Wifi", "Deck"],
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      images: [{ url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800" }],
      user: { name: "Elena Ocean", avatarUrl: null, isVerified: false }
    },
    {
      id: "mock-4",
      title: "Minimalist Loft Apartment",
      description: "Located in the heart of the arts district. High ceilings, industrial concrete finishes, natural lighting, and close proximity to public transport.",
      price: 2900,
      address: "SoHo, New York",
      propertyType: "APARTMENT",
      rooms: 2,
      facilities: ["AC", "Subway Access", "Elevator"],
      status: "APPROVED",
      createdAt: new Date().toISOString(),
      images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800" }],
      user: { name: "David Loftus", avatarUrl: null, isVerified: true }
    }
  ];

  useEffect(() => {
    async function fetchListings() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const res = await fetch(`${apiUrl}/listings`);
        if (!res.ok) throw new Error("Could not load backend data");
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setListings(data);
        } else {
          setListings(mockListings);
        }
      } catch (err) {
        console.warn("Backend listings API unreachable, using local fallback data.");
        setListings(mockListings);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  useEffect(() => {
    let result = [...listings];

    // Search filter
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(l => 
        l.title.toLowerCase().includes(term) || 
        l.description.toLowerCase().includes(term) || 
        l.address.toLowerCase().includes(term)
      );
    }

    // Property Type filter
    if (type) {
      result = result.filter(l => l.propertyType === type);
    }

    // Rooms filter
    if (rooms) {
      result = result.filter(l => l.rooms >= parseInt(rooms));
    }

    // Price Range filter
    if (priceRange) {
      if (priceRange === 'under-3k') {
        result = result.filter(l => l.price < 3000);
      } else if (priceRange === '3k-6k') {
        result = result.filter(l => l.price >= 3000 && l.price <= 6000);
      } else if (priceRange === 'over-6k') {
        result = result.filter(l => l.price > 6000);
      }
    }

    setFilteredListings(result);
  }, [search, type, rooms, priceRange, listings]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Premium Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2D60FF] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            H
          </div>
          <div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Hausly</span>
            <span className="text-[10px] block font-bold text-[#2D60FF] tracking-widest uppercase">Marketplace</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#" className="text-[#2D60FF] hover:text-[#2D60FF]/80 transition-colors">Marketplace</a>
          <a href="#" className="hover:text-[#2D60FF] transition-colors">About Us</a>
          <a href="#" className="hover:text-[#2D60FF] transition-colors">Resources</a>
          <a href="#" className="hover:text-[#2D60FF] transition-colors font-bold text-slate-700 bg-slate-100/50 px-3 py-1.5 rounded-xl">Portal</a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-md transition-all">
            Get App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 px-6 max-w-7xl mx-auto">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#2D60FF]/5 rounded-full blur-3xl -z-10" />

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            Find the perfect place to <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2D60FF] to-blue-400">call home</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            Hausly bridges the gap between tenants and landlords. Discover beautiful listings near you with transparent pricing.
          </p>
        </div>

        {/* Floating Search Filter Bar */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] p-4 shadow-2xl shadow-slate-200/50 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative flex items-center border-r border-slate-100/80 pr-2">
              <Search className="absolute left-4 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search location or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm font-semibold text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Property Type Dropdown */}
            <div className="relative flex items-center border-r border-slate-100/80 pr-2">
              <Home className="absolute left-4 text-slate-400" size={18} />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm font-semibold text-slate-600 appearance-none"
              >
                <option value="">All Types</option>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="VILLA">Villa</option>
              </select>
            </div>

            {/* Price Range Dropdown */}
            <div className="relative flex items-center border-r border-slate-100/80 pr-2">
              <DollarSign className="absolute left-4 text-slate-400" size={18} />
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm font-semibold text-slate-600 appearance-none"
              >
                <option value="">Any Price</option>
                <option value="under-3k">Under $3,000 / mo</option>
                <option value="3k-6k">$3,000 - $6,000 / mo</option>
                <option value="over-6k">Over $6,000 / mo</option>
              </select>
            </div>

            {/* Rooms Dropdown */}
            <div className="relative flex items-center">
              <Bed className="absolute left-4 text-slate-400" size={18} />
              <select
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-sm font-semibold text-slate-600 appearance-none"
              >
                <option value="">Any Rooms</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Recommended Properties</h2>
            <p className="text-slate-400 text-sm mt-1">Found {filteredListings.length} matching rentals</p>
          </div>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">Grid View</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-[#2D60FF]/20 border-t-[#2D60FF] rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-semibold text-sm">Searching listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredListings.map((listing) => (
              <div 
                key={listing.id} 
                className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-xl shadow-slate-100/40 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0].url} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <Home size={48} />
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-xs font-bold text-slate-900 shadow-sm">
                      {listing.propertyType.charAt(0) + listing.propertyType.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <span className="px-3.5 py-2 bg-[#2D60FF] text-white rounded-2xl text-lg font-bold shadow-lg shadow-blue-500/20">
                      ${listing.price.toLocaleString()}<span className="text-xs font-medium">/mo</span>
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium mb-3">
                    <MapPin size={14} className="text-[#2D60FF]" />
                    <span>{listing.address}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-950 line-clamp-1 mb-2 group-hover:text-[#2D60FF] transition-colors">
                    {listing.title}
                  </h3>

                  <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6">
                    {listing.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                        {listing.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          {listing.user.name}
                          {listing.user.isVerified && (
                            <span className="w-3.5 h-3.5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[8px] font-black">✓</span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">Landlord</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400 text-xs font-semibold">
                      <div className="flex items-center gap-1">
                        <Bed size={14} className="text-slate-400" />
                        <span>{listing.rooms} BR</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredListings.length === 0 && (
          <div className="text-center py-32 bg-white border border-slate-100 rounded-[2.5rem]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
              <Compass size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No properties found</h3>
            <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
}
