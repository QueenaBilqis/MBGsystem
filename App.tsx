
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import DashboardBGN from './components/DashboardBGN';
import DashboardSPPG from './components/DashboardSPPG';
import DashboardSchool from './components/DashboardSchool';
import DashboardStudent from './components/DashboardStudent';
import UserProfile from './components/UserProfile';
import { UserRole } from './types';
import { db } from './utils/db'; // Import Database Adapter
import { RefreshCw, Database } from 'lucide-react';

function App() {
  // --- APPLICATION STATE ---
  const [isAppLoading, setIsAppLoading] = useState(true);
  
  // User Session
  const [userRole, setUserRole] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Data Bisnis
  const [globalPolls, setGlobalPolls] = useState([]);
  const [globalReports, setGlobalReports] = useState([]);
  const [attendanceCount, setAttendanceCount] = useState(0);
  const [isStudentScanned, setIsStudentScanned] = useState(false);

  // UI States
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deliveryActive, setDeliveryActive] = useState(false);
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  // --- INITIALIZATION (Load from DB) ---
  useEffect(() => {
    const initData = async () => {
        setIsAppLoading(true);
        
        // 1. Load Session
        const role = db.session.getRole();
        const profile = db.session.getProfile();
        
        setUserRole(role);
        setUserProfile(profile);

        // 2. Load Business Data (Async Simulation)
        const [polls, reports, att] = await Promise.all([
            db.polls.getAll(),
            db.reports.getAll(),
            db.attendance.getCount()
        ]);

        setGlobalPolls(polls);
        setGlobalReports(reports);
        setAttendanceCount(att);
        setIsStudentScanned(db.attendance.getScanStatus());

        // 3. Set Active Tab
        if (role) {
            if (role === UserRole.STUDENT) setActiveTab('menu');
            else setActiveTab('dashboard');
        }

        setIsAppLoading(false);
    };

    initData();
  }, []);

  // --- BUSINESS LOGIC HANDLERS ---

  // Handle Pengiriman
  useEffect(() => {
    let interval;
    if (deliveryActive) {
      interval = window.setInterval(() => {
        setDeliveryProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            return prev + 1;
        });
      }, 1000); 
    }
    return () => clearInterval(interval);
  }, [deliveryActive]);

  const handleUpdatePolls = async (newPolls) => {
      // Optimistic Update
      setGlobalPolls(newPolls);
      await db.polls.update(newPolls);
  };
  
  const handleStudentVote = async (pollId) => {
    const updatedPolls = await db.polls.vote(pollId);
    setGlobalPolls(updatedPolls);
  };

  const handleSendReport = async (newReport) => {
    // Optimistic UI update
    setGlobalReports(prev => [newReport, ...prev]);
    // DB Update
    const freshReports = await db.reports.add(newReport);
    setGlobalReports(freshReports);
  };

  const handleUpdateReportStatus = async (id, status) => {
    const freshReports = await db.reports.updateStatus(id, status);
    setGlobalReports(freshReports);
  };

  const handleStudentScan = async () => {
    if (!isStudentScanned) {
      const newCount = await db.attendance.increment();
      setAttendanceCount(newCount);
      setIsStudentScanned(true);
      db.attendance.setScanStatus(true);
      return true;
    }
    return false;
  };

  const handleLogin = (role, identifier, nationalData) => {
    const newProfile = {
        name: nationalData ? nationalData.name : (identifier || 'Admin MBG'),
        email: nationalData ? `${nationalData.nis}@siswa.mbg.gov.id` : `${identifier?.replace(/\s/g, '').toLowerCase() || 'admin'}@mbg.gov.id`,
        phone: '081234567890',
        role: role,
        address: nationalData ? nationalData.school : 'Malang Hub',
        verified: !!nationalData,
        avatar: `https://ui-avatars.com/api/?name=${nationalData ? nationalData.name : (identifier || role)}&background=random&color=fff`
    };

    setUserRole(role);
    setUserProfile(newProfile);
    
    // Save Session
    db.session.setRole(role);
    db.session.saveProfile(newProfile);

    if (role === UserRole.STUDENT) setActiveTab('menu');
    else setActiveTab('dashboard');
  };

  const handleLogout = () => {
    db.session.logout();
    setUserRole(null);
    setDeliveryActive(false);
    setDeliveryProgress(0);
    setActiveTab('dashboard');
  };

  const handleUpdateProfile = (updatedProfile) => {
      setUserProfile(updatedProfile);
      db.session.saveProfile(updatedProfile);
  };

  // --- RENDERERS ---

  if (isAppLoading) {
      return (
          <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white gap-4">
              <RefreshCw className="animate-spin text-blue-500" size={48} />
              <div className="text-center">
                  <h2 className="text-xl font-bold font-display">Menghubungkan Database...</h2>
                  <p className="text-slate-500 text-sm mt-2 font-mono">
                    {db.isCloudEnabled ? 'Supabase Connection: Active' : 'Local Storage: Active'}
                  </p>
              </div>
          </div>
      );
  }

  const renderDashboard = () => {
    if (activeTab === 'profile') return <UserProfile userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />;
    if (!userRole) return null;

    switch (userRole) {
      case UserRole.BGN:
        return (
          <DashboardBGN 
            activeTab={activeTab} 
            reports={globalReports} 
            onUpdateStatus={handleUpdateReportStatus} 
          />
        );
      case UserRole.SPPG:
        return (
          <DashboardSPPG 
            activeTab={activeTab} 
            globalPolls={globalPolls}
            reports={globalReports}
            onUpdatePolls={handleUpdatePolls}
            onSendReport={handleSendReport}
            isDelivering={deliveryActive}
            setIsDelivering={setDeliveryActive}
            deliveryProgress={deliveryProgress}
          />
        );
      case UserRole.SCHOOL:
        return (
          <DashboardSchool 
            activeTab={activeTab} 
            attendanceCount={attendanceCount}
            deliveryActive={deliveryActive}
            deliveryProgress={deliveryProgress}
          />
        );
      case UserRole.STUDENT:
        return (
          <DashboardStudent 
            activeTab={activeTab} 
            pollOptions={globalPolls}
            onVote={handleStudentVote}
            onScan={handleStudentScan}
            isScanned={isStudentScanned}
          />
        );
      default: return null;
    }
  };

  if (!userRole) return <Login onLogin={handleLogin} />;

  return (
    <Layout role={userRole} onLogout={handleLogout} activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderDashboard()}
    </Layout>
  );
}

export default App;
