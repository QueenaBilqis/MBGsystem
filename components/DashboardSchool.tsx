
import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw, Truck, Clock, MapPin, Search, CheckCircle, ShieldAlert, Send, FileCheck, Phone, ChevronRight } from 'lucide-react';
import { MOCK_DELIVERIES, MOCK_HOSPITALS } from '../constants';
import L from 'leaflet';

const DashboardSchool = ({ activeTab, attendanceCount, deliveryActive, deliveryProgress }) => {
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); 
  const [incidentMsg, setIncidentMsg] = useState('');
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

         L.marker([delivery.destLat, delivery.destLng]).addTo(map).bindPopup("Lokasi Kami");
         if (deliveryActive) {
            truckMarkerRef.current = L.marker([delivery.originLat, delivery.originLng], { icon: truckIcon }).addTo(map);
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
    setQrValue(`MLG-SCHOOL-VERIFY-${Date.now()}`);
    const interval = setInterval(() => setTimeLeft(prev => prev <= 1 ? 60 : prev - 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (activeTab === 'attendance') {
     return (
       <div className="flex flex-col items-center justify-center min-h-[70vh] py-6 animate-fade-in">
         <div className="text-center mb-8 px-4">
           <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Presensi Gizi Digital</h2>
           <p className="text-slate-500 text-sm mt-1">Siswa scan QR untuk klaim porsi makan.</p>
         </div>
         
         <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-50 relative">
            <QRCodeSVG value={qrValue} size={220} fgColor="#0f172a" />
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2 rounded-full shadow-xl text-[9px] font-bold flex items-center gap-2 whitespace-nowrap uppercase tracking-widest">
               <RefreshCw size={14} className="animate-spin text-blue-400" /> Expired: <span className="text-blue-400 font-mono text-xs">{timeLeft}s</span>
            </div>
         </div>

         <div className="grid grid-cols-1 gap-4 w-full max-w-sm mt-12 px-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm text-center border border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Hadir Makan</p>
               <p className="text-4xl font-bold text-emerald-600">{attendanceCount}</p>
            </div>
            <button onClick={() => alert("Log harian diunduh!")} className="bg-slate-900 text-white p-5 rounded-3xl flex items-center justify-center gap-3 font-bold active:scale-95 transition-all">
               <Download size={20} /> Unduh Log Harian
            </button>
         </div>
       </div>
     );
  }

  if (activeTab === 'incident') {
    return (
        <div className="space-y-8 animate-slide-up pb-10">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-rose-50">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3"><ShieldAlert className="text-rose-500" /> Laporkan Kendala</h3>
                <textarea value={incidentMsg} onChange={e => setIncidentMsg(e.target.value)} className="w-full p-5 border-2 border-slate-50 rounded-2xl bg-slate-50 outline-none focus:bg-white focus:border-blue-500 transition-all min-h-[120px] text-sm" placeholder="Detail laporan distribusi atau kualitas..." />
                <button onClick={() => { setIncidentMsg(''); alert("Laporan terkirim ke Badan Gizi Nasional!"); }} className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95"><Send size={20} /> Kirim Feedback</button>
            </div>

            <div className="space-y-4">
               <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-4 flex items-center gap-2"><MapPin size={14}/> Rumah Sakit Terdekat</h4>
               {MOCK_HOSPITALS.map(h => (
                  <div key={h.id} className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><Phone size={20}/></div>
                        <div>
                           <p className="font-bold text-slate-800 text-sm">{h.name}</p>
                           <p className="text-[10px] text-slate-400">{h.address}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-rose-600">{h.distance}</p>
                        <ChevronRight size={18} className="text-slate-300 ml-auto mt-1" />
                     </div>
                  </div>
               ))}
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col gap-2 px-2">
        <h2 className="text-xl font-bold text-slate-800">Lacak Pengiriman</h2>
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <span className="text-xs font-bold text-blue-800 uppercase">Estimasi Tiba</span>
            <span className="font-bold text-blue-600 flex items-center gap-2"><Clock size={16}/> {deliveryActive ? '12 Menit' : '---'}</span>
        </div>
      </div>
      <div className="bg-white p-3 rounded-[2.5rem] shadow-xl border border-blue-50">
          <div ref={mapRef} className="h-[400px] w-full rounded-[2rem] overflow-hidden"></div>
      </div>
    </div>
  );
};

export default DashboardSchool;
