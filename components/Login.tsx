import React, { useState } from 'react';
import { UserRole } from '../types';
import { MOCK_NATIONAL_STUDENTS } from '../constants';
import { ChefHat, School, Building2, User, ArrowRight, RefreshCw, ShieldAlert } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(UserRole.STUDENT);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState('');
  
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  
  const registeredPhone = "+62 812-****-5678";

  const handleIdentifierChange = (e) => {
    // Hanya batasi angka jika role adalah SISWA (NIS)
    const val = selectedRole === UserRole.STUDENT 
      ? e.target.value.replace(/[^0-9]/g, '') 
      : e.target.value;
    setIdentifier(val);
  };

  const handleSubmitCredentials = (e) => {
    e.preventDefault();
    setError('');
    
    if (!identifier) {
      setError(`Mohon isi ${selectedRole === UserRole.STUDENT ? 'NIS' : 'Username'} Anda.`);
      return;
    }
    if (!captchaChecked) {
      setError('Mohon centang verifikasi keamanan.');
      return;
    }

    setIsLoading(true);
    
    if (selectedRole === UserRole.STUDENT) {
        setVerificationStep('Sinkronisasi Pusdatin...');
        setTimeout(() => {
            const student = MOCK_NATIONAL_STUDENTS.find(s => s.nis === identifier);
            if (student) {
                setVerificationStep(`Siswa Terverifikasi: ${student.name}`);
                setTimeout(() => {
                    setIsLoading(false);
                    onLogin(selectedRole, identifier, student);
                }, 1000);
            } else {
                setIsLoading(false);
                setVerificationStep('');
                setError('Nomor NIS tidak ditemukan. Gunakan NIS contoh: 241507864 atau 241507862.');
            }
        }, 1500);
    } else {
        setTimeout(() => {
            setIsLoading(false);
            setShow2FA(true);
        }, 1200);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) element.nextSibling.focus();
  };

  const handleVerify2FA = () => {
    if (otp.join('') === '123456') {
        onLogin(selectedRole, identifier);
    } else {
        setError('Kode OTP Salah (Simulasi: 123456)');
    }
  };

  const roles = [
    { id: UserRole.BGN, label: 'Badan Gizi', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: UserRole.SPPG, label: 'SPPG', icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { id: UserRole.SCHOOL, label: 'Sekolah', icon: School, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: UserRole.STUDENT, label: 'Siswa', icon: User, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse"></div>
         <div className="absolute -bottom-[10%] right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-white/20 animate-fade-in">
        <div className="hidden md:flex flex-col justify-between w-5/12 p-12 bg-slate-900 text-white relative">
          <div className="z-10">
            <div className="flex items-center gap-3 mb-10">
               <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
                  <ChefHat size={32} />
               </div>
               <div>
                  <span className="font-display font-bold text-2xl tracking-wide block">MBG</span>
                  <span className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Systems</span>
               </div>
            </div>
            <div className="space-y-6">
                <h1 className="text-4xl font-display font-bold leading-tight">Membangun <span className="text-blue-400">Generasi Bangsa</span></h1>
                <p className="text-slate-400 text-sm leading-relaxed">Platform digital pemantauan gizi nasional untuk masa depan Indonesia yang lebih sehat.</p>
            </div>
          </div>
          <div className="z-10 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
             <div className="flex items-center gap-4">
                <RefreshCw className="text-blue-400 animate-spin-slow" />
                <p className="text-xs font-medium text-slate-300 tracking-widest uppercase">Monitoring Aktif</p>
             </div>
          </div>
        </div>

        <div className="w-full md:w-7/12 p-8 md:p-16 bg-white flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            {!show2FA ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Masuk Akun</h2>
                  <p className="text-slate-500 text-sm">Pilih role dan masukkan {selectedRole === UserRole.STUDENT ? 'NIS' : 'Username'}.</p>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-8">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelectedRole(r.id);
                        setIdentifier('');
                      }}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                        selectedRole === r.id ? `${r.bg} ${r.border} border-2 shadow-md` : 'border border-slate-100 opacity-50 grayscale'
                      }`}
                    >
                      <r.icon size={20} className={selectedRole === r.id ? r.color : ''} />
                      <span className="text-[8px] font-bold mt-2 uppercase">{r.label}</span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSubmitCredentials} className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      {selectedRole === UserRole.STUDENT ? 'Nomor Induk Siswa (NIS)' : 'Username'}
                    </label>
                    <input
                      type="text"
                      value={identifier}
                      onChange={handleIdentifierChange}
                      className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none font-bold"
                      placeholder={selectedRole === UserRole.STUDENT ? "NIS Siswa" : "Username Admin"}
                    />
                  </div>

                  {selectedRole !== UserRole.STUDENT && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-5 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer" onClick={() => setCaptchaChecked(!captchaChecked)}>
                    <input type="checkbox" checked={captchaChecked} readOnly className="w-4 h-4 text-blue-600 rounded" />
                    <span className="text-xs text-slate-600 font-medium">Verifikasi Keamanan</span>
                  </div>

                  {verificationStep && <div className="text-blue-600 text-xs font-bold animate-pulse flex items-center gap-2"><RefreshCw size={12} className="animate-spin" /> {verificationStep}</div>}
                  {error && <div className="text-rose-600 text-xs font-bold bg-rose-50 p-3 rounded-lg flex items-center gap-2 animate-pop"><ShieldAlert size={14} /> {error}</div>}

                  <button disabled={isLoading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-slate-200">
                    {isLoading ? <RefreshCw className="animate-spin" /> : <>Masuk Sekarang <ArrowRight size={18} /></>}
                  </button>
                </form>
              </>
            ) : (
                <div className="animate-slide-up">
                    <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Verifikasi OTP</h2>
                    <p className="text-slate-500 text-sm text-center mb-8">Masukkan kode 6-digit dari SMS Anda</p>
                    <div className="flex justify-center gap-2 mb-8">
                        {otp.map((d, i) => (
                            <input key={i} className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-xl font-bold focus:border-blue-500 outline-none" type="text" maxLength={1} value={d} onChange={e => handleOtpChange(e.target, i)} />
                        ))}
                    </div>
                    {error && <p className="text-rose-500 text-xs font-bold text-center mb-4">{error}</p>}
                    <button onClick={handleVerify2FA} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200">Verifikasi & Masuk</button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;