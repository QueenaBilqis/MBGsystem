import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import DashboardBGN from './components/DashboardBGN';
import DashboardSPPG from './components/DashboardSPPG';
import DashboardSchool from './components/DashboardSchool';
import DashboardStudent from './components/DashboardStudent';
import UserProfile from './components/UserProfile';
import { UserRole } from './types';

// Initial Mock Data for Polls
const INITIAL_POLLS = [
  { id: 1, name: 'Soto Ayam Lamongan', desc: 'Kuah kuning segar dengan koya gurih', img: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=500&auto=format&fit=crop', votes: 120 },
  { id: 2, name: 'Rendang Sapi', desc: 'Daging empuk bumbu meresap', img: 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?q=80&w=500&auto=format&fit=crop', votes: 85 },
];

// Security Constants
const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 Minutes in ms

function App() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userName, setUserName] = useState<string>('');

  // Global State for Polling System (Simulating Backend)
  const [globalPolls, setGlobalPolls] = useState(INITIAL_POLLS);

  // User Profile State
  const [userProfile, setUserProfile] = useState({
    name: 'Pengguna Baru',
    email: 'user@mbg.gov.id',
    phone: '08123456789',
    role: 'User',
    address: 'Jl. Merdeka No. 1, Jakarta Pusat'
  });

  // Session Management Logic
  useEffect(() => {
    let timeoutId: number;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (userRole) {
        timeoutId = window.setTimeout(() => {
          handleLogout();
          alert("Sesi Anda telah berakhir karena tidak ada aktivitas. Silakan login kembali demi keamanan.");
        }, SESSION_TIMEOUT);
      }
    };

    // Events to track activity
    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];
    
    if (userRole) {
      resetTimer(); // Init
      events.forEach(event => window.addEventListener(event, resetTimer));
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [userRole]);

  // Function for SPPG to publish new polls
  const handleUpdatePolls = (newPolls: any) => {
    setGlobalPolls(newPolls);
  };

  // Function for Students to vote
  const handleStudentVote = (pollId: number) => {
    const updatedPolls = globalPolls.map(p => 
      p.id === pollId ? { ...p, votes: p.votes + 1 } : p
    );
    setGlobalPolls(updatedPolls);
  };

  const handleLogin = (role: string, identifier: string) => {
    setUserRole(role);
    setUserName(identifier);
    // Init profile based on role
    setUserProfile({
        name: identifier || 'Pengguna',
        email: `${identifier.replace(/\s/g, '').toLowerCase()}@mbg.gov.id`,
        phone: '081234567890',
        role: role,
        address: 'Kantor Pusat'
    });

    // Reset tab based on role default
    switch(role) {
       case UserRole.STUDENT: setActiveTab('menu'); break;
       case UserRole.SCHOOL: setActiveTab('attendance'); break;
       default: setActiveTab('dashboard');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
  };

  const handleUpdateProfile = (newProfile: any) => {
      setUserProfile(newProfile);
      setUserName(newProfile.name);
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    // Shared Profile View
    if (activeTab === 'profile') {
        return <UserProfile userProfile={userProfile} onUpdateProfile={handleUpdateProfile} />;
    }

    switch (userRole) {
      case UserRole.BGN:
        return <DashboardBGN activeTab={activeTab} />;
      case UserRole.SPPG:
        return (
          <DashboardSPPG 
            activeTab={activeTab} 
            globalPolls={globalPolls}
            onUpdatePolls={handleUpdatePolls}
          />
        );
      case UserRole.SCHOOL:
        return <DashboardSchool activeTab={activeTab} />;
      case UserRole.STUDENT:
        return (
          <DashboardStudent 
            activeTab={activeTab} 
            pollOptions={globalPolls}
            onVote={handleStudentVote}
          />
        );
      default:
        return <div>Role not recognized</div>;
    }
  };

  return (
    <Layout 
      role={userRole} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      children={renderDashboard()}
    />
  );
}

export default App;