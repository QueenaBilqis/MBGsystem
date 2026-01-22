import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { ChefHat, School, Building2, User, ArrowRight, ShieldCheck, Lock, Fingerprint, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState(UserRole.STUDENT);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Security States
  const [show2FA, setShow2FA] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  // Sanitization Function (Simulated XSS/SQL Injection Protection)
  const sanitizeInput = (input) => {
    const dangerousChars = /[<>;'"/]/g;
    return input.replace(dangerousChars, '');
  };

  const handleIdentifierChange = (e) => {
    const safeInput = sanitizeInput(e.target.value);
    setIdentifier(safeInput);
  };

  const validateInputs = () => {
    if (!identifier) return 'Mohon isi Identitas Anda.';
    if (identifier.length < 3) return 'Identitas terlalu pendek.';
    if (selectedRole !== UserRole.STUDENT && !password) return 'Password wajib diisi.';
    if (!captchaChecked) return 'Mohon selesaikan verifikasi keamanan (Captcha).';
    return null;
  };

  const handleSubmitCredentials = (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    
    // Simulate Server Verification
    setTimeout(() => {
        setIsLoading(false);
        // If credentials are "valid", trigger 2FA
        setShow2FA(true);
        setOtpTimer(30);
    }, 1000);
  };

  // OTP Logic
  useEffect(() => {
    let interval;
    if (show2FA && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [show2FA, otpTimer]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify2FA = () => {
    const code = otp.join('');
    if (code.length < 6) {
        setError('Kode OTP harus 6 digit.');
        return;
    }
    
    setIsLoading(true);
    // Simulate OTP Verification
    setTimeout(() => {
        if (code === '123456') { // Mock Correct OTP
            onLogin(selectedRole, identifier);
        } else {
            setError('Kode OTP Salah. Coba lagi (Gunakan 123456).');
            setIsLoading(false);
            setOtp(['', '', '', '', '', '']);
        }
    }, 1000);
  };

  const roles = [
    { id: UserRole.BGN, label: 'Badan Gizi', icon: Building2, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { id: UserRole.SPPG, label: 'SPPG', icon: ChefHat, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { id: UserRole.SCHOOL, label: 'Sekolah', icon: School, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: UserRole.STUDENT, label: 'Siswa', icon: User, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse-slow"></div>
         <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]"></div>
         <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]"></div>
         <div className="batik-overlay opacity-[0.03]"></div>
      </div>

      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10 z-10 m-4 animate-fade-in ring-1 ring-white/20">
        
        {/* Left Side: Brand & Visuals */}
        <div className="hidden md:flex flex-col justify-between w-5/12 p-12 relative bg-gradient-to-br from-slate-900 to-blue-950 overflow-hidden">
          <div className="absolute inset-0 batik-overlay opacity-50 mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10 group cursor-default">
               <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg group-hover:bg-white/20 transition-all duration-500">
                  <ChefHat size={32} className="text-white drop-shadow-md" />
               </div>
               <div>
                  <span className="text-white font-display font-bold text-2xl tracking-wide block leading-none">MBG</span>
                  <span className="text-blue-300 text-xs font-bold uppercase tracking-[0.2em]">Systems</span>
               </div>
            </div>
            
            <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-display font-bold text-white leading-[1.15]">
                  <span className="opacity-90">Keamanan Data</span> <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Prioritas Utama</span>
                </h1>
                <div className="w-20 h-1.5 bg-blue-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="relative z-10">
             <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <div className="flex items-start gap-4">
                   <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400">
                      <Lock size={24} />
                   </div>
                   <div>
                      <p className="text-white font-bold text-lg">Enkripsi End-to-End</p>
                      <p className="text-blue-200/80 text-sm mt-1 leading-relaxed">
                         Data Anda dilindungi dengan standar keamanan pemerintah. Otentikasi ganda aktif.
                      </p>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-16 bg-white relative flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {!show2FA ? (
            <>
                <div className="mb-8 text-center md:text-left">
                  <h2 className="text-3xl font-display font-bold text-slate-800 mb-2">Selamat Datang</h2>
                  <p className="text-slate-500">Silakan pilih peran dan masuk dengan aman.</p>
                </div>

                <div className="grid grid-cols-4 gap-3 mb-8">
                  {roles.map((r) => {
                     const isActive = selectedRole === r.id;
                     return (
                        <button
                          key={r.id}
                          onClick={() => setSelectedRole(r.id)}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                            isActive
                              ? `${r.bg} ${r.border} border-2 shadow-lg scale-105 z-10`
                              : 'border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 text-slate-400 grayscale hover:grayscale-0'
                          }`}
                        >
                          <r.icon size={26} className={`mb-2 transition-transform duration-300 ${isActive ? `${r.color} scale-110` : 'group-hover:scale-110'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-slate-800' : ''}`}>{r.label}</span>
                        </button>
                     );
                  })}
                </div>

                <form onSubmit={handleSubmitCredentials} className="space-y-5">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                       {selectedRole === UserRole.STUDENT ? <Fingerprint size={20} /> : <User size={20} />}
                    </div>
                    <input
                      type="text"
                      id="identifier"
                      value={identifier}
                      onChange={handleIdentifierChange}
                      className="peer block w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white text-slate-900 placeholder-transparent focus:outline-none transition-all font-medium text-base shadow-inner-sm"
                      placeholder="Identitas"
                    />
                    <label 
                       htmlFor="identifier"
                       className="absolute left-12 -top-2.5 bg-white px-2 text-xs font-bold text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:text-xs pointer-events-none"
                    >
                       {selectedRole === UserRole.STUDENT ? 'Nomor Induk Siswa (NIS)' : 'Username'}
                    </label>
                  </div>

                  {selectedRole !== UserRole.STUDENT && (
                    <div className="relative group">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                          <Lock size={20} />
                       </div>
                       <input
                         type="password"
                         id="password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         className="peer block w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white text-slate-900 placeholder-transparent focus:outline-none transition-all font-medium text-base shadow-inner-sm"
                         placeholder="Password"
                       />
                       <label 
                          htmlFor="password"
                          className="absolute left-12 -top-2.5 bg-white px-2 text-xs font-bold text-slate-400 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-blue-500 peer-focus:text-xs pointer-events-none"
                       >
                          Password
                       </label>
                    </div>
                  )}

                  {/* Simulated CAPTCHA */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <input 
                        type="checkbox" 
                        id="captcha" 
                        checked={captchaChecked}
                        onChange={(e) => setCaptchaChecked(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor="captcha" className="text-sm text-slate-600 font-medium select-none cursor-pointer">
                        Saya bukan robot (Verifikasi Keamanan)
                    </label>
                  </div>

                  {error && (
                    <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-xl border border-rose-100 text-sm animate-pop">
                       <ShieldAlert size={18} className="shrink-0" />
                       {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <span>Lanjut ke Verifikasi</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                  </button>
                </form>
            </>
            ) : (
                /* 2FA Form Section */
                <div className="animate-slide-up">
                    <button onClick={() => setShow2FA(false)} className="text-sm text-slate-500 hover:text-blue-600 mb-6 flex items-center gap-1 font-bold">
                        ← Kembali
                    </button>
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <ShieldCheck size={32} className="text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800">Verifikasi Dua Langkah</h2>
                        <p className="text-slate-500 text-sm mt-2">Kode OTP telah dikirim ke perangkat terdaftar Anda.</p>
                        <p className="text-slate-400 text-xs mt-1">(Simulasi: Masukkan 123456)</p>
                    </div>

                    <div className="flex justify-center gap-2 mb-8">
                        {otp.map((data, index) => {
                            return (
                                <input
                                    className="w-12 h-14 border-2 border-slate-200 rounded-xl text-center text-xl font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                    type="text"
                                    name="otp"
                                    maxLength={1}
                                    key={index}
                                    value={data}
                                    onChange={e => handleOtpChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                />
                            );
                        })}
                    </div>
                    
                    {error && (
                        <div className="text-center text-rose-600 bg-rose-50 p-3 rounded-lg text-sm font-bold mb-4 animate-pop">
                           {error}
                        </div>
                    )}

                    <button
                        onClick={handleVerify2FA}
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30 mb-6 flex justify-center"
                    >
                         {isLoading ? <RefreshCw className="animate-spin" /> : 'Verifikasi & Masuk'}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-slate-500">
                            Tidak menerima kode? 
                            {otpTimer > 0 ? (
                                <span className="font-bold text-slate-700 ml-1">Tunggu {otpTimer}s</span>
                            ) : (
                                <button className="text-blue-600 font-bold ml-1 hover:underline">Kirim Ulang</button>
                            )}
                        </p>
                    </div>
                </div>
            )}

            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
               <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
                 <Lock size={10} /> 256-Bit Secure SSL Connection
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;