
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import DashboardBGN from './components/DashboardBGN';
import DashboardSPPG from './components/DashboardSPPG';
import DashboardSchool from './components/DashboardSchool';
import DashboardStudent from './components/DashboardStudent';
import UserProfile from './components/UserProfile';
import { UserRole } from './types';
import { MOCK_REPORTS_INITIAL } from './constants';

const INITIAL_POLLS = [
  { id: 1, name: 'Soto Ayam Lamongan', desc: 'Kuah kuning segar dengan koya gurih', img: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=500&auto=format&fit=crop', votes: 120 },
  { id: 2, name: 'Rendang Sapi', desc: 'Daging empuk bumbu meresap', img: 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?q=80&w=500&auto=format&fit=crop', votes: 85 },
];

const SESSION_TIMEOUT = 15 * 60 * 1000;

function App() {
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState('');
  
  const [globalPolls, setGlobalPolls] = useState(INITIAL_POLLS);
  const [globalReports, setGlobalReports] = useState(MOCK_REPORTS_INITIAL);
  
  const [deliveryActive, setDeliveryActive] = useState(false);
  const [deliveryProgress, setDeliveryProgress] = useState(0);

  const [attendanceCount, setAttendanceCount] = useState(285);
  const [isStudentScanned, setIsStudentScanned] = useState(false);

  const [userProfile, setUserProfile] = useState({
    name: 'Pengguna Baru',
    email: 'user@mbg.gov.id',
    phone: '08123456789',
    role: 'User',
    address: 'Kota Malang',
    verified: false
  });

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
      }, 1000); // Gerakan truk setiap detik
    }
    return () => clearInterval(interval);
  }, [deliveryActive]);

  const handleUpdatePolls = (newPolls) => setGlobalPolls(newPolls);
  const handleStudentVote = (pollId) => {
    setGlobalPolls(prev => prev.map(p => p.id === pollId ? { ...p, votes: p.votes + 1 } : p));
  };

  const handleSendReport = (newReport) => {
    setGlobalReports(prev => [newReport, ...prev]);
  };

  const handleUpdateReportStatus = (id, status) => {
    setGlobalReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleStudentScan = () => {
    if (!isStudentScanned) {
      setAttendanceCount(prev => prev + 1);
      setIsStudentScanned(true);
      return true;
    }
    return false;
  };

  const handleLogin = (role, identifier, nationalData) => {
    setUserRole(role);
    if (role === UserRole.STUDENT && nationalData) {
        setUserName(nationalData.name);
        setUserProfile({
            name: nationalData.name,
            email: `${nationalData.nis}@siswa.mbg.gov.id`,
            phone: '0812****5678',
            role: 'Siswa Terverifikasi',
            address: nationalData.school,
            verified: true
        });
        setActiveTab('menu');
    } else {
        setUserName(identifier);
        setUserProfile({
            name: identifier || 'Admin MBG',
            email: `${identifier.replace(/\s/g, '').toLowerCase()}@mbg.gov.id`,
            phone: '081234567890',
            role: role,
            address: 'Malang Hub',
            verified: false
        });
        switch(role) {
           case UserRole.SCHOOL: setActiveTab('dashboard'); break;
           case UserRole.STUDENT: setActiveTab('menu'); break;
           default: setActiveTab('dashboard');
        }
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
    setDeliveryActive(false);
    setDeliveryProgress(0);
  };

  const renderDashboard = () => {
    if (activeTab === 'profile') return <UserProfile userProfile={userProfile} onUpdateProfile={setUserProfile} />;
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
