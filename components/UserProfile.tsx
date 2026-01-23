import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Edit2, Camera, Shield, Lock, ShieldCheck, XCircle, RefreshCw, Smartphone, CheckCircle } from 'lucide-react';

const UserProfile = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  
  // Security Modals State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [is2FAActive, setIs2FAActive] = useState(true); // Default mock status

  const [passwordState, setPasswordState] = useState({ old: '', new: '', confirm: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setSuccessMsg('Password berhasil diperbarui!');
        setTimeout(() => {
            setSuccessMsg('');
            setShowPasswordModal(false);
            setPasswordState({ old: '', new: '', confirm: '' });
        }, 2000);
    }, 1500);
  };

  const toggle2FA = () => {
    setIsSubmitting(true);
    setTimeout(() => {
        setIsSubmitting(false);
        setIs2FAActive(!is2FAActive);
        setShow2FAModal(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up relative">
      {/* Header Profile */}
      <div className="relative h-48 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute -bottom-12 left-8 md:left-12 flex items-end">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-xl">
               <img 
                 src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name}&background=0D8ABC&color=fff`} 
                 alt="Profile" 
                 className="w-full h-full object-cover"
               />
            </div>
            {isEditing && (
              <button className="absolute bottom-2 right-2 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-700 shadow-lg transition-transform hover:scale-110">
                <Camera size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="pt-14 px-4 md:px-0">
         <div className="flex justify-between items-start mb-8">
            <div>
               <h1 className="text-3xl font-bold text-slate-900">{formData.name}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Shield size={12} /> {formData.role}
                 </span>
                 <span className="text-slate-500 text-sm">Unit: Malang City</span>
               </div>
            </div>
            <button 
              onClick={() => isEditing ? handleSubmit({preventDefault:()=>{}}) : setIsEditing(true)}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                isEditing 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-200' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {isEditing ? <><Save size={18} /> Simpan</> : <><Edit2 size={18} /> Edit Profil</>}
            </button>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal Info Form */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <User size={20} className="text-blue-500" /> Informasi Pribadi
               </h3>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Nama Lengkap</label>
                        <input 
                          type="text" 
                          name="name"
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500">Jabatan / Role</label>
                        <input 
                          type="text" 
                          disabled
                          value={formData.role}
                          className="w-full px-4 py-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed font-medium"
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 flex items-center gap-1">
                           <Mail size={14} /> Email
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          disabled={!isEditing}
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none disabled:opacity-70"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-500 flex items-center gap-1">
                           <Phone size={14} /> Telepon
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          disabled={!isEditing}
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none disabled:opacity-70"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-500 flex items-center gap-1">
                         <MapPin size={14} /> Alamat Unit Kerja
                      </label>
                      <textarea 
                        name="address"
                        disabled={!isEditing}
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none disabled:opacity-70 resize-none"
                      />
                  </div>
               </form>
            </div>

            {/* Right Column: Account Status */}
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Keamanan Akun</h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                              <Shield size={16} />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-emerald-800">Akun Terverifikasi</p>
                              <p className="text-xs text-emerald-600">KYC Level 2</p>
                           </div>
                        </div>
                     </div>
                     
                     <div className={`flex items-center justify-between p-3 rounded-xl border ${is2FAActive ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center ${is2FAActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                              <Smartphone size={16} />
                           </div>
                           <div>
                              <p className={`text-sm font-bold ${is2FAActive ? 'text-blue-800' : 'text-slate-600'}`}>SMS 2FA</p>
                              <p className={`text-xs ${is2FAActive ? 'text-blue-600' : 'text-slate-400'}`}>{is2FAActive ? 'Aktif' : 'Nonaktif'}</p>
                           </div>
                        </div>
                     </div>

                     <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="w-full py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition active:scale-[0.98]"
                     >
                        Ubah Password
                     </button>
                     <button 
                        onClick={() => setShow2FAModal(true)}
                        className={`w-full py-3 rounded-xl text-sm font-bold transition active:scale-[0.98] ${
                          is2FAActive ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        }`}
                     >
                        {is2FAActive ? 'Nonaktifkan 2FA' : 'Aktifkan 2FA'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* MODAL: UBAH PASSWORD */}
      {showPasswordModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-pop">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                          <Lock size={20} className="text-blue-600" /> Ubah Password
                      </h3>
                      <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-slate-600">
                          <XCircle size={24} />
                      </button>
                  </div>
                  <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                      {successMsg && (
                          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-center gap-2 font-bold animate-pop">
                              <CheckCircle size={18} /> {successMsg}
                          </div>
                      )}
                      <div className="space-y-4">
                          <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Password Lama</label>
                              <input 
                                type="password" 
                                required
                                value={passwordState.old}
                                onChange={(e) => setPasswordState({...passwordState, old: e.target.value})}
                                className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                              />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Password Baru</label>
                              <input 
                                type="password" 
                                required
                                value={passwordState.new}
                                onChange={(e) => setPasswordState({...passwordState, new: e.target.value})}
                                className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                              />
                          </div>
                          <div>
                              <label className="text-xs font-bold text-slate-400 uppercase">Konfirmasi Password Baru</label>
                              <input 
                                type="password" 
                                required
                                value={passwordState.confirm}
                                onChange={(e) => setPasswordState({...passwordState, confirm: e.target.value})}
                                className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" 
                              />
                          </div>
                      </div>
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                      >
                          {isSubmitting ? <RefreshCw className="animate-spin" size={20} /> : 'Simpan Password Baru'}
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* MODAL: VERIFIKASI 2FA */}
      {show2FAModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-pop">
                  <div className="p-8 text-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${is2FAActive ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'}`}>
                          {is2FAActive ? <Shield size={40} /> : <ShieldCheck size={40} />}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">
                          {is2FAActive ? 'Nonaktifkan 2FA?' : 'Aktifkan 2FA?'}
                      </h3>
                      <p className="text-slate-500 mb-8 leading-relaxed">
                          {is2FAActive 
                            ? 'Setelah dinonaktifkan, akun Anda hanya akan dilindungi oleh password saja. Keamanan akan berkurang.' 
                            : 'Setiap kali Anda login, sistem akan mengirimkan kode verifikasi 6-digit ke nomor SMS terdaftar Anda.'}
                      </p>
                      <div className="space-y-3">
                          <button 
                            onClick={toggle2FA}
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 ${
                                is2FAActive ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200 shadow-lg' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 shadow-lg'
                            }`}
                          >
                             {isSubmitting ? <RefreshCw className="animate-spin" /> : (is2FAActive ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan Sekarang')}
                          </button>
                          <button 
                            onClick={() => setShow2FAModal(false)}
                            className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition"
                          >
                              Batalkan
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default UserProfile;