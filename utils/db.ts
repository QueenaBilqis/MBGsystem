
import { createClient } from '@supabase/supabase-js';
import { MOCK_REPORTS_INITIAL } from '../constants';

// --- KONFIGURASI SUPABASE ---
// 1. Buat project di https://supabase.com
// 2. Buat tabel: 'reports', 'polls', 'attendance'
// 3. Masukkan URL dan ANON KEY di bawah ini
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_PUBLIC_ANON_KEY';

// Ubah ke 'true' jika Anda telah mengisi kredensial di atas
const ENABLE_CLOUD_DB = false;

// --- INITIALIZATION ---
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const INITIAL_POLLS = [
  { id: 1, name: 'Soto Ayam Lamongan', desc: 'Kuah kuning segar dengan koya gurih', img: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?q=80&w=500&auto=format&fit=crop', votes: 120 },
  { id: 2, name: 'Rendang Sapi', desc: 'Daging empuk bumbu meresap', img: 'https://images.unsplash.com/photo-1605333396915-47ed6b68a00e?q=80&w=500&auto=format&fit=crop', votes: 85 },
];

const STORAGE_KEYS = {
  ROLE: 'mbg_role',
  PROFILE: 'mbg_profile',
  POLLS: 'mbg_polls',
  REPORTS: 'mbg_reports',
  ATTENDANCE: 'mbg_attendance',
  SCAN_STATUS: 'mbg_student_scanned'
};

// --- LOCAL STORAGE HELPER (Fallback Robust) ---
const local = {
  get: (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Error parsing local storage key "${key}":`, e);
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error saving to local storage key "${key}":`, e);
    }
  },
  remove: (key) => localStorage.removeItem(key),
  clear: () => localStorage.clear()
};

// --- DATABASE SERVICE ADAPTER ---
// Semua komponen harus mengakses data melalui object `db` ini
export const db = {
  // Config
  isCloudEnabled: ENABLE_CLOUD_DB,
  
  // Auth & Session (Local Only for demo, Supabase Auth is complex to setup in 1 file)
  session: {
    getRole: () => local.get(STORAGE_KEYS.ROLE, null),
    setRole: (role) => {
        if (role) local.set(STORAGE_KEYS.ROLE, role);
        else local.remove(STORAGE_KEYS.ROLE);
    },
    getProfile: () => local.get(STORAGE_KEYS.PROFILE, {
      name: 'Pengguna Baru',
      email: 'user@mbg.gov.id',
      phone: '08123456789',
      role: 'User',
      address: 'Kota Malang',
      verified: false
    }),
    saveProfile: (profile) => local.set(STORAGE_KEYS.PROFILE, profile),
    logout: () => local.remove(STORAGE_KEYS.ROLE),
    resetAll: () => {
        if (window.confirm("Hapus semua data lokal?")) {
            local.clear();
            window.location.reload();
        }
    }
  },

  // Reports
  reports: {
    getAll: async () => {
      if (ENABLE_CLOUD_DB) {
         const { data, error } = await supabase.from('reports').select('*').order('date', { ascending: false });
         if (!error && data) return data;
      }
      // Simulasi network delay agar terasa seperti DB asli
      await new Promise(r => setTimeout(r, 800)); 
      return local.get(STORAGE_KEYS.REPORTS, MOCK_REPORTS_INITIAL);
    },
    add: async (report) => {
       const reports = local.get(STORAGE_KEYS.REPORTS, MOCK_REPORTS_INITIAL);
       const newReports = [report, ...reports];
       
       if (ENABLE_CLOUD_DB) {
           await supabase.from('reports').insert([report]);
       }
       
       local.set(STORAGE_KEYS.REPORTS, newReports);
       return newReports;
    },
    updateStatus: async (id, status) => {
        const reports = local.get(STORAGE_KEYS.REPORTS, MOCK_REPORTS_INITIAL);
        const newReports = reports.map(r => r.id === id ? { ...r, status } : r);
        
        if (ENABLE_CLOUD_DB) {
            await supabase.from('reports').update({ status }).eq('id', id);
        }
        
        local.set(STORAGE_KEYS.REPORTS, newReports);
        return newReports;
    }
  },

  // Polls
  polls: {
      getAll: async () => {
          if (ENABLE_CLOUD_DB) {
              const { data } = await supabase.from('polls').select('*');
              if (data) return data;
          }
          await new Promise(r => setTimeout(r, 600));
          return local.get(STORAGE_KEYS.POLLS, INITIAL_POLLS);
      },
      update: async (newPolls) => {
          // Note: In real DB we would upsert individual items
          local.set(STORAGE_KEYS.POLLS, newPolls);
          return newPolls;
      },
      vote: async (pollId) => {
          const polls = local.get(STORAGE_KEYS.POLLS, INITIAL_POLLS);
          const newPolls = polls.map(p => p.id === pollId ? { ...p, votes: p.votes + 1 } : p);
          local.set(STORAGE_KEYS.POLLS, newPolls);
          return newPolls;
      }
  },

  // Attendance
  attendance: {
      getCount: async () => {
          return local.get(STORAGE_KEYS.ATTENDANCE, 285);
      },
      increment: async () => {
          const current = local.get(STORAGE_KEYS.ATTENDANCE, 285);
          const next = current + 1;
          local.set(STORAGE_KEYS.ATTENDANCE, next);
          return next;
      },
      getScanStatus: () => local.get(STORAGE_KEYS.SCAN_STATUS, false),
      setScanStatus: (status) => local.set(STORAGE_KEYS.SCAN_STATUS, status)
  }
};
