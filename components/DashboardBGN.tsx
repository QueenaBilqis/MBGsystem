
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_STATS, MOCK_COMPLIANCE_DATA, MOCK_DELIVERIES } from '../constants';
import { FileText, Check, Camera, Receipt, MapPin, X, ShieldCheck } from 'lucide-react';
import L from 'leaflet';

const DashboardBGN = ({ activeTab, reports, onUpdateStatus }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const truckMarkerRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'dashboard' && mapRef.current) {
         if (mapInstance.current) mapInstance.current.remove();
         const map = L.map(mapRef.current).setView([-7.9666, 112.6326], 13);
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

         const truckIcon = L.divIcon({
            className: 'custom-truck-icon',
            html: `
              <div style="background: #2563eb; color: white; padding: 6px; border-radius: 8px; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
            `,
            iconSize: [32, 32]
         });

         MOCK_COMPLIANCE_DATA.forEach(school => {
            const color = school.status === 'High' ? '#10b981' : school.status === 'Medium' ? '#f59e0b' : '#ef4444';
            const icon = L.divIcon({
                className: 'custom-icon',
                html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 8px rgba(0,0,0,0.1);"></div>`,
                iconSize: [14, 14]
            });
            L.marker([school.lat, school.lng], { icon }).addTo(map).bindPopup(`<b>${school.name}</b><br>Kepatuhan: ${school.complianceScore}%`);
         });

         const delivery = MOCK_DELIVERIES[0];
         truckMarkerRef.current = L.marker([delivery.originLat, delivery.originLng], { icon: truckIcon }).addTo(map).bindPopup("<b>Logistik SPPG</b>");

         mapInstance.current = map;
    }
  }, [activeTab]);

  if (activeTab === 'compliance') {
    return (
        <div className="space-y-6 animate-slide-up">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3"><ShieldCheck className="text-blue-500" /> Kepatuhan Gizi Sekolah</h2>
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-400">
                        <tr>
                            <th className="p-6">Sekolah</th>
                            <th className="p-6 text-center">Skor</th>
                            <th className="p-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {MOCK_COMPLIANCE_DATA.map(s => (
                            <tr key={s.id} className="border-b hover:bg-slate-50">
                                <td className="p-6 font-bold text-slate-800">{s.name}</td>
                                <td className="p-6 text-center font-bold text-blue-600">{s.complianceScore}%</td>
                                <td className="p-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${s.status === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                        {s.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
  }

  if (activeTab === 'reports') {
    return (
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-2xl font-bold text-slate-800">Validasi Laporan Unit</h2>
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b text-[10px] uppercase font-bold text-slate-400">
              <tr>
                <th className="p-6">Laporan</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-bold text-slate-800">{report.title}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${report.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : report.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {report.status}
                    </span>
                  </td>
                  <td className="p-6 text-center flex justify-center gap-2">
                        <button onClick={() => setSelectedReport(report)} className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><FileText size={18} /></button>
                        <button onClick={() => onUpdateStatus(report.id, 'Approved')} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Check size={18} /></button>
                        {/* TOMBOL X SEBAGAI PENOLAKAN (REJECTED) */}
                        <button onClick={() => onUpdateStatus(report.id, 'Rejected')} className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"><X size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedReport && (
            <div className="fixed inset-0 bg-slate-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl p-8 animate-pop">
                    <button onClick={() => setSelectedReport(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
                    <h3 className="text-2xl font-bold mb-6">{selectedReport.title}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <img src={selectedReport.attachments.cookingPhoto} className="rounded-2xl h-48 object-cover border" />
                        <img src={selectedReport.attachments.packingPhoto} className="rounded-2xl h-48 object-cover border" />
                    </div>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => { onUpdateStatus(selectedReport.id, 'Rejected'); setSelectedReport(null); }} className="px-6 py-2.5 bg-rose-100 text-rose-600 rounded-xl font-bold">Tolak Laporan</button>
                        <button onClick={() => { onUpdateStatus(selectedReport.id, 'Approved'); setSelectedReport(null); }} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold">Validasi & Setujui</button>
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-[2rem] border-b-4 border-blue-600 shadow-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Porsi Hari Ini</p>
                <p className="text-3xl font-display font-bold text-slate-800">{MOCK_STATS.totalDistribution.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border-b-4 border-emerald-500 shadow-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sekolah</p>
                <p className="text-3xl font-display font-bold text-slate-800">{MOCK_STATS.schoolsServed}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border-b-4 border-cyan-500 shadow-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Siswa</p>
                <p className="text-3xl font-display font-bold text-slate-800">{MOCK_STATS.studentsBenefited.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border-b-4 border-amber-500 shadow-lg">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kepatuhan</p>
                <p className="text-3xl font-display font-bold text-slate-800">{MOCK_STATS.complianceRate}%</p>
            </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3"><MapPin className="text-rose-500" /> Tracking Distribusi</h3>
             <div ref={mapRef} className="h-[500px] w-full rounded-[2rem] overflow-hidden border"></div>
        </div>
    </div>
  );
};

export default DashboardBGN;
