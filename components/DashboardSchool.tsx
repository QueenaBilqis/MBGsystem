import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw, Truck, Clock, MapPin, Search, CheckCircle, ShieldAlert, Send, FileCheck, Info } from 'lucide-react';
import { MOCK_DELIVERIES } from '../constants';
import L from 'leaflet';

const DashboardSchool = ({ activeTab, attendanceCount, deliveryActive, deliveryProgress }) => {
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); 
  const [incidentMsg, setIncidentMsg] = useState('');
  const [reportsSent, setReportsSent] = useState([
    { id: 101, msg: "Distribusi porsi lengkap 320 box harian.", date: "10:15", type: "info" },
    { id: 102, msg: "Kualitas nasi sangat baik hari ini.", date: "Kemarin", type: "info" }
  ]);
  
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const truckMarkerRef = useRef(null);

  useEffect(() => {
    if (activeTab === 'dashboard' && mapRef.current) {
         if (mapInstance.current) mapInstance.current.remove();
         const map = L.map(mapRef.current).setView([-7.9666, 112.6326], 13);
         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

         const delivery = MOCK_DELIVERIES[0];

         const truckIcon = L.divIcon({
            className: 'school-truck-icon',
            html: `<div style="background: #2563eb; color: white; padding: 5px; border-radius: 6px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>`,
            iconSize: [28, 28]
         });

         L.marker([delivery.destLat, delivery.destLng]).addTo(map).bindPopup("<b>SDN Kauman 1</b> (Lokasi Kami)");
         L.polyline([[delivery.originLat, delivery.originLng], [delivery.destLat, delivery.destLng]], {
            color: '#3b82f6', weight: 4, dashArray: '5, 10', opacity: 0.3
         }).addTo(map);

         if (deliveryActive) {
            truckMarkerRef.current = L.marker([delivery.originLat, delivery.originLng], { icon: truckIcon }).addTo(map).bindPopup("Armada Logistik Gizi");
         }

         mapInstance.current = map;
    }
  }, [activeTab, deliveryActive]);

  useEffect(() => {
    if (deliveryActive && truckMarkerRef.current) {
        const delivery = MOCK_DELIVERIES[0];
        const lat = delivery.originLat + (delivery.destLat - delivery.originLat) * (deliveryProgress / 100);
        const lng = delivery.originLng + (delivery.destLng - delivery.originLng) * (deliveryProgress / 100);
        truckMarkerRef.current.setLatLng([lat, lng]);
    }
  }, [deliveryProgress, deliveryActive]);

  useEffect(() => {
    const generateQR = () => {
      setQrValue(`MLG-SCHOOL-VERIFY-${Date.now()}`);
      setTimeLeft(60);
    };
    generateQR();
    const interval = setInterval(() => setTimeLeft(prev => prev <= 1 ? 60 : prev - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSendIncident = () => {
    if (!incidentMsg.trim()) {
        alert("Mohon isi detail laporan.");
        return;
    }
    const newReport = { 
        id: Date.now(), 
        msg: incidentMsg, 
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: "incident" 
    };
    setReportsSent([newReport, ...reportsSent]);
    setIncidentMsg('');
    alert("Umpan balik berhasil dikirim ke Badan Gizi Nasional!");
  };

  const handleDownloadReport = () => {
    const dateStr = new Date().toLocaleDateString('id-ID');
    const content = `LAPORAN DISTRIBUSI GIZI\nSekolah: SDN Kauman 1\nTanggal: ${dateStr}\nHadir Makan: ${attendanceCount}\nStatus: Terverifikasi Digital`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Laporan_Gizi_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (activeTab === 'incident') {
    return (
        <div className="space-y-8 animate-slide-up pb-20">
            <div className="flex justify-between items-end px-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-800">Umpan Balik Sekolah</h2>
                    <p className="text-slate-500 mt-1">Sampaikan masukan atau kendala distribusi harian.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest border border-emerald-100 flex items-center gap-2">
                    <FileCheck size={16} /> KOMUNIKASI AKTIF
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 group">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                        <ShieldAlert className="text-rose-500 group-hover:animate-bounce" /> Buat Laporan / Feedback
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Detail Laporan</label>
                            <textarea 
                                value={incidentMsg}
                                onChange={e => setIncidentMsg(e.target.value)}
                                className="w-full p-6 border-2 border-slate-50 rounded-3xl bg-slate-50 outline-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 transition-all min-h-[180px] font-medium resize-none shadow-inner"
                                placeholder="Cth: Porsi makan hari ini sangat disukai siswa, namun pengiriman terlambat 5 menit..."
                            />
                        </div>
                        <button onClick={handleSendIncident} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-bold text-lg hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 active:scale-95">
                           <Send size={24} /> Kirim Ke Pusat Data
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
                            <span>Riwayat Umpan Balik</span>
                            <Search size={18} className="text-slate-300" />
                        </h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                            {reportsSent.length === 0 ? (
                              <div className="text-center py-10 opacity-40">Belum ada laporan terkirim.</div>
                            ) : reportsSent.map(r => (
                                <div key={r.id} className={`p-6 rounded-3xl border transition-all hover:translate-x-1 ${r.type === 'incident' ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${r.type === 'incident' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white'}`}>
                                            {r.type === 'incident' ? 'Laporan Baru' : 'Info Sistem'}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><Clock size={10} /> {r.date}</span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed">{r.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl text-white">
                        <div className="flex items-center gap-3 mb-4">
                           <Info size={24} />
                           <h4 className="font-bold">Info Bantuan</h4>
                        </div>
                        <p className="text-sm leading-relaxed opacity-80 mb-6">Setiap laporan umpan balik akan direspon oleh tim Badan Gizi Nasional dalam waktu 1x24 jam.</p>
                        <div className="flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                            <CheckCircle size={14} /> Terenkripsi End-to-End
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  if (activeTab === 'attendance') {
     return (
       <div className="flex flex-col items-center justify-center min-h-[70vh] py-10 animate-fade-in pb-32">
         <div className="text-center mb-12">
           <h2 className="text-4xl font-display font-bold text-slate-800 tracking-tight">Presensi Gizi Digital</h2>
           <p className="text-slate-500 mt-2 font-medium">Siswa memindai kode QR untuk klaim jatah porsi makan.</p>
         </div>
         
         <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-8 border-slate-50 relative group">
            <QRCodeSVG value={qrValue} size={280} fgColor="#0f172a" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-xl border border-blue-50 text-[10px] font-bold text-slate-800 flex items-center gap-3 tracking-widest uppercase">
               <RefreshCw size={16} className="animate-spin text-blue-500" /> Token Refresh: <span className="text-rose-500 font-mono text-xs">{timeLeft}s</span>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mt-20 px-4">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center border border-slate-50">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hadir Makan</p>
               <p className="text-5xl font-display font-bold text-emerald-600">{attendanceCount}</p>
            </div>
            <button 
               onClick={handleDownloadReport}
               className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-center flex flex-col items-center justify-center group cursor-pointer hover:bg-blue-600 transition-all text-white"
            >
               <Download size={28} className="mb-2 group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-bold uppercase tracking-widest">Unduh Log</span>
            </button>
         </div>
       </div>
     );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center px-2">
        <div>
            <h2 className="text-3xl font-display font-bold text-slate-800">Pelacakan Pengiriman</h2>
            <p className="text-slate-500 font-medium">Monitoring armada pengantar gizi dari SPPG Hub.</p>
        </div>
        <div className="bg-white px-6 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimasi Tiba</span>
                <span className="font-bold text-blue-600">{deliveryActive ? `${Math.max(0, 15 - Math.floor(deliveryProgress / 6.6))} Menit` : '---'}</span>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Clock size={20} /></div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-blue-50 overflow-hidden">
          <div ref={mapRef} className="h-[480px] w-full rounded-[2.5rem] border shadow-inner"></div>
      </div>

      {deliveryActive && (
          <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-2xl text-white animate-slide-up">
              <div className="flex justify-between items-center mb-4 px-2">
                  <p className="font-bold text-lg flex items-center gap-3"><Truck size={24} /> Logistik On Progress</p>
                  <p className="font-bold">{deliveryProgress}%</p>
              </div>
              <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden p-1">
                  <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${deliveryProgress}%` }}></div>
              </div>
          </div>
      )}
    </div>
  );
};

export default DashboardSchool;