import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Trash2 } from 'lucide-react';

interface Report {
  id: string;
  reason: string;
  createdAt: string;
  user: { name: string; email: string };
  listing?: { id: string; title: string };
}

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await axios.get(`${apiUrl}/reports`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveReport = async (id: string) => {
    try {
      await axios.post(`${apiUrl}/reports/${id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setReports(reports.filter(r => r.id !== id));
    } catch (error) {
      alert('Failed to resolve report');
    }
  };

  const deleteListing = async (listingId: string, reportId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.post(`${apiUrl}/reports/listing/${listingId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      resolveReport(reportId);
    } catch (error) {
      alert('Failed to delete listing');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">User Reports</h2>
        <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-bold">
          {reports.length} Active Reports
        </span>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div className="bg-red-50 p-3 rounded-xl text-red-500">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{report.reason}</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Reported by {report.user.name} ({report.user.email}) on {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  
                  {report.listing && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase mb-1">Associated Listing</p>
                      <p className="font-semibold text-gray-700">{report.listing.title}</p>
                      <p className="text-xs text-gray-400">ID: {report.listing.id}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                {report.listing && (
                  <button 
                    onClick={() => deleteListing(report.listing!.id, report.id)}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all text-sm font-bold"
                  >
                    <Trash2 size={16} />
                    <span>Delete Listing</span>
                  </button>
                )}
                <button 
                  onClick={() => resolveReport(report.id)}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition-all text-sm font-bold"
                >
                  <CheckCircle size={16} />
                  <span>Mark Resolved</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {reports.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
            <p className="text-gray-500 font-medium">No active reports. Good job!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
