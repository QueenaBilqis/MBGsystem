import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Save, Edit2, Camera, Shield } from 'lucide-react';

const UserProfile = ({ userProfile, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

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

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-slide-up">
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
                 <span className="text-slate-500 text-sm">Member since 2024</span>
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
                     <button className="w-full py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                        Ubah Password
                     </button>
                     <button className="w-full py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition">
                        Aktifkan 2FA
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default UserProfile;