import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Users, AlertOctagon, Download, RefreshCw, Send, Truck } from 'lucide-react';

const DashboardSchool = ({ activeTab }) => {
  const [qrValue, setQrValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); 
  
  // Real-time ETA Simulation
  const [etaMinutes, setEtaMinutes] = useState(45);
  const [etaSeconds, setEtaSeconds] = useState(0);

  useEffect(() => {
    // Generate QR Logic
    const generateQR = () => {
      const timestamp = Date.now();
      const secret = "SCHOOL_SECRET_ID_123";
      setQrValue(`${secret}-${timestamp}`);
      setTimeLeft(60);
    };

    generateQR();
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateQR();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // ETA Countdown Logic
    const timer = setInterval(() => {
       if (etaSeconds > 0) {
          setEtaSeconds(etaSeconds - 1);
       } else if (etaMinutes > 0) {
          setEtaMinutes(etaMinutes - 1);
          setEtaSeconds(59);
       }
    }, 1000);
    return () => clearInterval(timer);
  }, [etaMinutes, etaSeconds]);

  if (activeTab === 'incident') {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-red-50 mt-4">
        <div className="flex items-center gap-4 mb-8 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
           <AlertOctagon size={40} />
           <div>
             <h2 className="text-2xl font-bold">Laporan Insiden</h2>
             <p className="text-red-400 text-sm">Laporkan keracunan atau kualitas makanan buruk segera.</p>
           </div>
        </div>
        <form className="space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Kejadian</label>
                <input type="date" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Jml Siswa Terdampak</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-200 outline-none" placeholder="0" />
              </div>
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Gejala yang dialami</label>
              <textarea className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-32 focus:ring-2 focus:ring-red-200 outline-none" placeholder="Contoh: Mual, Pusing setelah makan siang..."></textarea>
           </div>
           <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Bukti Foto / Surat Dokter</label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 cursor-pointer transition-colors group">
                 <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Send className="text-slate-400" />
                 </div>
                 <p className="text-sm font-bold text-slate-600">Klik untuk ambil foto (Kamera Langsung)</p>
                 <p className="text-xs text-slate-400 mt-1">Akses galeri dinonaktifkan untuk keamanan</p>
              </div>
           </div>
           <button type="button" className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">
             Kirim Laporan Darurat
           </button>
        </form>
      </div>
    );
  }

  if (activeTab === 'attendance') {
     return (
       <div className="flex flex-col items-center justify-center space-y-8 py-8 animate-fade-in">
         <div className="text-center">
           <h2 className="text-3xl font-bold text-primary">Scan Absensi Makan Siang</h2>
           <p className="text-slate-500 mt-2 font-medium">QR Code ini berubah setiap 60 detik untuk mencegah kecurangan.</p>
         </div>
         
         <div className="bg-white p-10 rounded-[2rem] shadow-2xl border-4 border-blue-100 relative group">
            <QRCodeSVG value={qrValue} size={280} fgColor="#1e3a8a" />
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-blue-100 text-sm font-mono font-bold text-primary flex items-center gap-2 z-10">
               <RefreshCw size={16} className="animate-spin text-secondary" />
               Refresh: <span className="text-red-500 w-6">{timeLeft}s</span>
            </div>
         </div>

         <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mt-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-blue-50">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Siswa</p>
              <p className="text-4xl font-bold text-slate-800 mt-2">320</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-b-4 border-emerald-500">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Sudah Scan</p>
              <p className="text-4xl font-bold text-emerald-600 mt-2">285</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-b-4 border-red-500">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Belum Makan</p>
              <p className="text-4xl font-bold text-red-600 mt-2">35</p>
            </div>
         </div>
       </div>
     );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Dashboard Sekolah</h2>
        <button className="flex items-center gap-2 bg-white text-primary border border-blue-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 shadow-sm transition">
           <Download size={18} /> Unduh Laporan Bulanan
        </button>
      </div>

      <div className="bg-primary/5 rounded-2xl p-1">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-lg text-primary flex items-center gap-2">
              <Truck size={20} /> Jadwal Pengiriman Hari Ini
            </h3>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-primary animate-pulse">
                          <Users size={36} />
                      </div>
                      <span className="absolute top-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div>
                      <p className="text-sm font-bold text-slate-500 uppercase">Estimasi Tiba (Real-time)</p>
                      <p className="text-4xl font-mono font-bold text-slate-800 tracking-tight">
                        {etaMinutes}:{etaSeconds < 10 ? `0${etaSeconds}` : etaSeconds} <span className="text-lg font-sans font-normal text-slate-500">menit lagi</span>
                      </p>
                  </div>
                </div>
                <div className="text-right bg-blue-50 px-6 py-4 rounded-xl border border-blue-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-1">Status Pengiriman</p>
                  <span className="text-primary text-lg font-bold flex items-center gap-2 justify-end">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                    </span>
                    Dalam Perjalanan
                  </span>
                </div>
            </div>

            <div className="border-t border-slate-100 pt-8">
                <h4 className="font-bold text-slate-700 mb-4">Detail Siswa Berkebutuhan Khusus</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                      <p className="text-red-800 font-bold mb-2">Alergi Kacang</p>
                      <p className="text-3xl font-bold text-red-600">5 <span className="text-sm font-normal text-red-400">Siswa</span></p>
                      <p className="text-xs mt-2 text-red-500 bg-red-100 inline-block px-2 py-1 rounded">Perlu menu pengganti</p>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
                      <p className="text-amber-800 font-bold mb-2">Lactose Intolerant</p>
                      <p className="text-3xl font-bold text-amber-600">2 <span className="text-sm font-normal text-amber-400">Siswa</span></p>
                  </div>
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                      <p className="text-emerald-800 font-bold mb-2">Vegetarian</p>
                      <p className="text-3xl font-bold text-emerald-600">1 <span className="text-sm font-normal text-emerald-400">Siswa</span></p>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSchool;
