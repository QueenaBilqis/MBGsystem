import React, { useState, useEffect, useRef } from 'react';
import { MOCK_STATS, MOCK_COMPLIANCE_DATA, MOCK_REPORTS } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line 
} from 'recharts';
import { CheckCircle, AlertTriangle, FileText, Check, X, XCircle, Download, User, Calendar, Receipt, Clock, Image as ImageIcon, MapPin } from 'lucide-react';
import L from 'leaflet';

const DashboardBGN = ({ activeTab }) => {
  const [showWarningDetail, setShowWarningDetail] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Initialize Map for National View (Overview Tab)
  useEffect(() => {
    if (activeTab === 'dashboard' && mapRef.current && !mapInstanceRef.current) {
         const map = L.map(mapRef.current).setView([-2.5489, 118.0149], 5); // Indonesia Center
         
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '&copy; OpenStreetMap contributors'
         }).addTo(map);

         // Add random distribution points
         const points = [
            { lat: -6.200, lng: 106.816, title: 'Jakarta' },
            { lat: -7.250, lng: 112.768, title: 'Surabaya' },
            { lat: 3.595, lng: 98.672, title: 'Medan' },
            { lat: -5.147, lng: 119.432, title: 'Makassar' },
            { lat: -8.670, lng: 115.212, title: 'Denpasar' }
         ];

         points.forEach(p => {
             const dotIcon = L.divIcon({
                 className: 'custom-dot',
                 html: `<div style="width: 12px; height: 12px; background-color: #3b82f6; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);"></div>`,
                 iconSize: [12, 12]
             });
             L.marker([p.lat, p.lng], { icon: dotIcon }).addTo(map).bindPopup(p.title);
         });

         mapInstanceRef.current = map;
    }
  }, [activeTab]); // Re-run when tab changes back to dashboard
  
  if (activeTab === 'compliance') {
    return (
      <div className="space-y-6 animate-fade-in">
        <h2 className="text-2xl font-bold text-primary mb-4">Statistik Kepatuhan Sekolah</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50">
            <h3 className="font-bold text-slate-700 mb-4">Ranking Kepatuhan</h3>
            <div className="space-y-4">
              {MOCK_COMPLIANCE_DATA.map((school) => (
                <div key={school.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="font-bold text-slate-800">{school.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                      school.status === 'High' ? 'bg-emerald-100 text-emerald-700' :
                      school.status === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {school.status} Risk
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">{school.complianceScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50">
            <h3 className="font-bold text-slate-700 mb-4">Tren Kepatuhan Nasional (6 Bulan)</h3>
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'Jan', score: 80 }, { name: 'Feb', score: 82 },
                    { name: 'Mar', score: 85 }, { name: 'Apr', score: 89 },
                    { name: 'May', score: 88 }, { name: 'Jun', score: 94 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                    <Line type="monotone" dataKey="score" stroke="#1e3a8a" strokeWidth={3} dot={{ fill: '#1e3a8a', r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'reports') {
    return (
      <div className="space-y-6 animate-slide-up">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-primary">Laporan Masuk (SPPG)</h2>
            <div className="flex gap-2">
                <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition">
                    Filter Tanggal
                </button>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition flex items-center gap-2">
                    <Download size={16} /> Ekspor Data
                </button>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-blue-50 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Tanggal</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Judul Laporan</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Pengirim (SPPG)</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Status</th>
                <th className="p-5 font-bold text-slate-600 text-sm uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5 text-sm font-bold text-slate-500 font-mono">{report.date}</td>
                  <td className="p-5 font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{report.title}</td>
                  <td className="p-5 text-sm text-slate-600 font-medium">{report.sender}</td>
                  <td className="p-5">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      report.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      report.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                      'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-5 flex space-x-2">
                     <button title="Lihat Detail" onClick={() => setSelectedReport(report)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-lg transition-colors">
                        <FileText size={18} />
                     </button>
                     <button title="Setujui" className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg transition-colors">
                        <Check size={18} />
                     </button>
                     <button title="Tolak" className="p-2 text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors">
                        <X size={18} />
                     </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Detail Laporan */}
        {selectedReport && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up relative flex flex-col max-h-[90vh]">
                    {/* Header */}
                    <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{selectedReport.title}</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">ID Laporan: #{selectedReport.id.toUpperCase()}</p>
                            </div>
                        </div>
                        <button onClick={() => setSelectedReport(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                            <XCircle size={28} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                        {/* Sender Info Card */}
                        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-white p-5 rounded-2xl border border-blue-100 shadow-sm">
                             <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-md border border-blue-50">
                                <User size={28} />
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Pengirim</p>
                                        <p className="font-bold text-lg text-slate-800">{selectedReport.sender}</p>
                                        <p className="text-sm font-medium text-blue-600">{selectedReport.role}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-1 text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                                            <Calendar size={14} />
                                            <span className="text-sm font-bold">{selectedReport.date}</span>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>

                        {/* Report Body & Verification Points */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                                Isi Laporan & Verifikasi
                            </h4>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-600 leading-relaxed text-justify">
                                <p className="mb-4">
                                    Dengan hormat, <br/><br/>
                                    Melalui dokumen ini kami sampaikan laporan realisasi distribusi dan kualitas terkait <strong>{selectedReport.title}</strong>. 
                                    Verifikasi dilakukan secara menyeluruh mencakup administrasi pembelian, logistik, dan standar kebersihan.
                                </p>
                                <p className="font-bold text-slate-800 mb-2">Poin Verifikasi Utama:</p>
                                <ul className="list-disc pl-5 space-y-2 mb-6">
                                    <li>Kuantitas bahan sesuai dengan order pembelian pusat (Lihat Bukti Bon Pembelian).</li>
                                    <li>Kualitas kesegaran sayur dan protein dalam kondisi Grade A.</li>
                                    <li>Waktu kedatangan armada logistik tepat waktu (On-Schedule) berdasarkan Data Tracking.</li>
                                    <li>Tidak ditemukan kerusakan kemasan pada saat serah terima.</li>
                                </ul>

                                {/* Section Bukti & Lampiran */}
                                <div className="border-t border-slate-200 pt-5 mt-4">
                                    <h5 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <FileText size={16} /> Bukti & Lampiran Fisik
                                    </h5>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Bukti 1: Bon Pembelian */}
                                        <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                                            <div className="bg-orange-100 text-orange-600 p-2 rounded-lg group-hover:bg-orange-200 transition-colors">
                                                <Receipt size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800">Bon Pembelian Bahan</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Ref: INV/2023/10/25-001</p>
                                                <p className="text-xs font-bold text-emerald-600 mt-1">Verified: Rp 15.400.000</p>
                                            </div>
                                        </div>

                                        {/* Bukti 2: Data Tracking */}
                                        <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group">
                                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                                                <Clock size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800">Log Live Tracking</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Route: Gudang Utama -&gt; Sekolah</p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                                    <p className="text-xs font-bold text-emerald-600">On-Time (06:45 AM)</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bukti 3: Dokumentasi Foto */}
                                    <div className="mt-4">
                                        <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                                            <ImageIcon size={12} /> Dokumentasi (Kebersihan & Menu)
                                        </p>
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {[
                                                'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=150&auto=format&fit=crop', // Masak
                                                'https://images.unsplash.com/photo-1576867757603-05b134ebc379?q=80&w=150&auto=format&fit=crop', // Kebersihan
                                                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=150&auto=format&fit=crop'  // Menu Jadi
                                            ].map((img, idx) => (
                                                <div key={idx} className="relative group w-24 h-24 flex-shrink-0">
                                                    <img src={img} alt="Bukti" className="w-full h-full object-cover rounded-lg border border-slate-200 shadow-sm" />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white cursor-pointer">
                                                        <Download size={16} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="mt-4 text-sm font-medium">
                                    Demikian laporan ini kami sampaikan untuk dapat diverifikasi lebih lanjut.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status & Actions Footer - Fixed at bottom */}
                    <div className="bg-white p-6 border-t border-slate-100 flex-shrink-0">
                        <div className="flex justify-between items-center">
                             <div className="flex items-center gap-3">
                                <p className="text-xs font-bold text-slate-400 uppercase">Status Verifikasi:</p>
                                <span className={`px-4 py-1.5 text-sm font-bold rounded-full flex items-center gap-1.5 ${
                                  selectedReport.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                  selectedReport.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {selectedReport.status === 'Approved' && <Check size={14} />}
                                  {selectedReport.status === 'Rejected' && <X size={14} />}
                                  {selectedReport.status}
                                </span>
                             </div>
                             <div className="flex gap-3">
                                 <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-900 transition shadow-sm">
                                    <Download size={18} /> Unduh PDF
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

      </div>
    );
  }

  // Default: Dashboard Overview
  return (
    <div className="space-y-8">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Distribusi', value: MOCK_STATS.totalDistribution.toLocaleString(), color: 'border-primary', text: 'text-primary' },
          { label: 'Sekolah Terlayani', value: MOCK_STATS.schoolsServed, color: 'border-secondary', text: 'text-secondary' },
          { label: 'Siswa Penerima', value: MOCK_STATS.studentsBenefited.toLocaleString(), color: 'border-emerald-500', text: 'text-emerald-600' },
          { label: 'Tingkat Kepatuhan', value: `${MOCK_STATS.complianceRate}%`, color: 'border-amber-500', text: 'text-amber-600' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white p-6 rounded-2xl shadow-lg border-l-[6px] ${stat.color} hover:transform hover:-translate-y-1 transition-transform duration-300`}>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <p className={`text-3xl font-bold mt-2 ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map Placeholder */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50 min-h-[400px]">
          <h3 className="font-bold text-lg mb-4 text-primary">Peta Sebaran Distribusi Nasional</h3>
          {/* Functional Leaflet Map */}
          <div className="w-full h-80 rounded-xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
               <div id="map-national" ref={mapRef} className="h-full w-full"></div>
          </div>
        </div>

        {/* Nutritional Data Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50 min-h-[400px]">
           <h3 className="font-bold text-lg mb-4 text-primary">Rata-rata Kandungan Gizi</h3>
           <ResponsiveContainer width="100%" height={320}>
             <BarChart data={[
               { name: 'Protein', val: 25, std: 20 },
               { name: 'Karbo', val: 50, std: 55 },
               { name: 'Lemak', val: 15, std: 15 },
               { name: 'Vitamin', val: 10, std: 10 },
             ]}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} />
               <XAxis dataKey="name" axisLine={false} tickLine={false} />
               <YAxis axisLine={false} tickLine={false} />
               <Tooltip cursor={{fill: '#eff6ff'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
               <Legend />
               <Bar dataKey="val" name="Aktual (g)" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
               <Bar dataKey="std" name="Standar (g)" fill="#bfdbfe" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>
      
      {/* Critical Alert Section with Detail Popup */}
      <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start justify-between shadow-sm">
        <div className="flex items-start">
          <div className="bg-red-100 p-2 rounded-lg mr-4">
             <AlertTriangle className="text-red-600" size={24} />
          </div>
          <div>
             <h4 className="font-bold text-red-800 text-lg">Peringatan Kritis SPPG</h4>
             <p className="text-red-600 mt-1">SPPG Wilayah 4 terdeteksi memiliki stok bahan kadaluarsa dalam 2 hari ke depan.</p>
          </div>
        </div>
        <button 
          onClick={() => setShowWarningDetail(true)}
          className="bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-50 transition shadow-sm"
        >
          Lihat Detail
        </button>
      </div>

      {/* Modal Detail Peringatan */}
      {showWarningDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-bounce-in">
              <div className="bg-red-600 p-4 flex justify-between items-center">
                 <h3 className="text-white font-bold flex items-center gap-2">
                    <AlertTriangle size={20} /> Detail Peringatan
                 </h3>
                 <button onClick={() => setShowWarningDetail(false)} className="text-white/80 hover:text-white">
                    <XCircle size={24} />
                 </button>
              </div>
              <div className="p-6">
                 <div className="mb-4">
                    <p className="text-sm text-gray-500 font-bold uppercase">Lokasi</p>
                    <p className="text-lg font-bold text-gray-800">SPPG Wilayah 4 (Jakarta Selatan)</p>
                 </div>
                 <div className="mb-4">
                    <p className="text-sm text-gray-500 font-bold uppercase mb-2">Item Bermasalah</p>
                    <ul className="bg-red-50 rounded-lg p-3 space-y-2">
                       <li className="flex justify-between items-center border-b border-red-100 pb-2">
                          <span className="text-red-800 font-medium">Sayur Bayam</span>
                          <span className="text-red-600 text-sm font-bold">Exp: BESOK</span>
                       </li>
                       <li className="flex justify-between items-center">
                          <span className="text-red-800 font-medium">Tahu Putih</span>
                          <span className="text-red-600 text-sm font-bold">Exp: 2 Hari</span>
                       </li>
                    </ul>
                 </div>
                 <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-yellow-800 text-sm mb-6">
                    <strong>Rekomendasi:</strong> Segera lakukan audit stok fisik dan hentikan penggunaan bahan tersebut untuk menu besok.
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => setShowWarningDetail(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200">Tutup</button>
                    <button className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200">Hubungi SPPG</button>
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default DashboardBGN;