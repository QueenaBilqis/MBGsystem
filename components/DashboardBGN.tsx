
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_STATS, MOCK_COMPLIANCE_DATA, MOCK_DELIVERIES } from '../constants';
import { FileText, Check, Camera, Receipt, MapPin, X, ShieldCheck, ChevronRight, Eye, CheckCircle, XCircle } from 'lucide-react';
import L from 'leaflet';

const DashboardBGN = ({ activeTab, reports, onUpdateStatus }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (activeTab === 'dashboard' && mapRef.current) {
         if (mapInstance.current) mapInstance.current.remove();
         const map = L.map(mapRef.current).setView([-7.9666, 112.6326], 13);
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

         const truckIcon = L.divIcon({
            className: 'custom-truck-icon',
            html: `<div style="background: #2563eb; color: white; padding: 6px; border-radius: 8px; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.2);"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`,
            iconSize: [32, 32]
         });

         MOCK_COMPLIANCE_DATA.forEach(school => {
            const color = school.status === 'High' ? '#10b981' : school.status === 'Medium' ? '#f59e0b' : '#ef4444';
            const icon = L.divIcon({
                className: 'custom-icon',
                html: `<div style="background-color: ${color}; width: 14px; height: 14px; border: 2px solid white; border-radius: 50%;"></div>`,
                iconSize: [14, 14]
            });
            L.marker([school.lat, school.lng], { icon }).addTo(map).bindPopup(`<b>${school.name}</b>`);
         });

         const delivery = MOCK_DELIVERIES[0];
         L.marker([delivery.originLat, delivery.originLng], { icon: truckIcon }).addTo(map);

         mapInstance.current = map;
    }
  }, [activeTab]);

  if (activeTab === 'compliance') {
    return (
        <div className="space-y-6 animate-slide-up">
            <h2 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center gap-3"><ShieldCheck className="text-blue-500" /> Kepatuhan Sekolah</h2>
            <div className="space-y-4">
                {MOCK_COMPLIANCE_DATA.map(s => (
                    <div key={s.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-800">{s.name}</p>
                            <p className="text-xs text-slate-400 font-medium">Skor: <span className="text-blue-600 font-bold">{s.complianceScore}%</span></p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${s.status === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                            {s.status}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  if (activeTab === 'reports') {
    return (
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800">Validasi Laporan SPPG</h2>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-[2rem] shadow-md border border-slate-100 group transition-all hover:shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><FileText size={24}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">{report.title}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{report.sender} • {report.date}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${report.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : report.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                        {report.status}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setSelectedReport(report)} className="flex-1 bg-slate-900 text-white py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                        <Eye size={16} /> Lihat Detail
                    </button>
                    {report.status === 'Pending' && (
                        <>
                            <button onClick={() => onUpdateStatus(report.id, 'Approved')} className="w-14 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"><Check size={20}/></button>
                            <button onClick={() => onUpdateStatus(report.id, 'Rejected')} className="w-14 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors"><X size={20}/></button>
                        </>
                    )}
                </div>
            </div>
          ))}
        </div>

        {selectedReport && (
            <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-md">
                <div className="bg-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl p-6 md:p-10 animate-pop overflow-y-auto max-h-[90vh]">
                    <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>
                    <div className="flex justify-between items-start mb-8">
                        <div>
                           <h3 className="text-2xl font-bold text-slate-800">{selectedReport.title}</h3>
                           <p className="text-sm text-slate-400 font-medium">Laporan realisasi gizi dari {selectedReport.sender}</p>
                        </div>
                        <button onClick={() => setSelectedReport(null)} className="p-3 bg-slate-100 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-colors"><X size={24} /></button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Bukti Dokumentasi</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-500 ml-1">Proses Memasak</p>
                                    <div className="aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner group">
                                        <img src={selectedReport.attachments?.cookingPhoto || 'https://via.placeholder.com/400x300?text=No+Photo'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-500 ml-1">Proses Pengemasan</p>
                                    <div className="aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner group">
                                        <img src={selectedReport.attachments?.packingPhoto || 'https://via.placeholder.com/400x300?text=No+Photo'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                           <div className="flex items-center justify-between mb-4">
                              <p className="text-sm font-bold text-slate-700">Dokumen Digital</p>
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase tracking-widest">Signed by Unit</span>
                           </div>
                           <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200">
                              <div className="w-10 h-10 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><FileText size={24}/></div>
                              <div className="flex-1 overflow-hidden">
                                 <p className="text-xs font-bold text-slate-800 truncate">Laporan_Realisasi_12Nov.pdf</p>
                                 <p className="text-[10px] text-slate-400">2.4 MB • PDF Document</p>
                              </div>
                              <button className="text-blue-600 text-xs font-bold">Preview</button>
                           </div>
                        </div>

                        {selectedReport.status === 'Pending' ? (
                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button onClick={() => { onUpdateStatus(selectedReport.id, 'Approved'); setSelectedReport(null); }} className="bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-transform active:scale-95">
                                    <CheckCircle size={20} /> Validasi Laporan
                                </button>
                                <button onClick={() => { onUpdateStatus(selectedReport.id, 'Rejected'); setSelectedReport(null); }} className="bg-rose-50 text-rose-600 py-4 rounded-2xl font-bold border border-rose-100 flex items-center justify-center gap-2 transition-transform active:scale-95">
                                    <XCircle size={20} /> Tolak Laporan
                                </button>
                            </div>
                        ) : (
                            <div className={`p-5 rounded-2xl text-center font-bold text-sm ${selectedReport.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                Laporan ini telah {selectedReport.status === 'Approved' ? 'Disetujui' : 'Ditolak'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border-b-4 border-blue-600 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Porsi</p>
                <p className="text-xl font-bold text-slate-800">{MOCK_STATS.totalDistribution.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border-b-4 border-emerald-500 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sekolah</p>
                <p className="text-xl font-bold text-slate-800">{MOCK_STATS.schoolsServed}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border-b-4 border-cyan-500 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Siswa</p>
                <p className="text-xl font-bold text-slate-800">{MOCK_STATS.studentsBenefited.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border-b-4 border-amber-500 shadow-sm">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Kepatuhan</p>
                <p className="text-xl font-bold text-slate-800">{MOCK_STATS.complianceRate}%</p>
            </div>
        </div>
        <div className="bg-white p-4 rounded-[2.5rem] shadow-xl border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-3"><MapPin className="text-rose-500" /> Tracking Armada Nasional</h3>
             <div ref={mapRef} className="h-[350px] md:h-[500px] w-full rounded-[2rem] overflow-hidden border"></div>
        </div>
    </div>
  );
};

export default DashboardBGN;
