
import { UserRole } from './types';

export const APP_NAME = "MBG Systems - Kota Malang";

export const MOCK_STATS = {
  totalDistribution: 12500,
  schoolsServed: 85,
  studentsBenefited: 42000,
  complianceRate: 96.2,
};

export const MOCK_NATIONAL_STUDENTS = [
  { 
    nis: '241507864', 
    name: 'QUEENA BILQIS AZALIA', 
    school: 'SDN Kauman 1 Malang', 
    statusGizi: 'Normal',
    allergies: [],
    region: 'Jawa Timur'
  },
  { 
    nis: '241507862', 
    name: 'SATRIA ELLANG', 
    school: 'SDN Kauman 1 Malang', 
    statusGizi: 'Normal',
    allergies: ['Cokelat'],
    region: 'Jawa Timur'
  },
  { 
    nis: '123456789', 
    name: 'Budi Santoso', 
    school: 'SMPN 1 Malang', 
    statusGizi: 'Perlu Perhatian',
    allergies: ['Kacang'],
    region: 'Jawa Timur'
  }
];

export const MOCK_COMPLIANCE_DATA = [
  { id: '1', name: 'SDN Kauman 1', lat: -7.9826, lng: 112.6308, complianceScore: 98, status: 'High' },
  { id: '2', name: 'SMPN 1 Malang', lat: -7.9715, lng: 112.6285, complianceScore: 85, status: 'Medium' },
  { id: '3', name: 'SDN Lowokwaru 3', lat: -7.9542, lng: 112.6221, complianceScore: 65, status: 'Low' },
  { id: '4', name: 'SMAN 3 Malang', lat: -7.9774, lng: 112.6339, complianceScore: 92, status: 'High' },
  { id: '5', name: 'SDN Klojen', lat: -7.9765, lng: 112.6258, complianceScore: 88, status: 'Medium' },
];

export const MOCK_MENU = {
  id: 'm1',
  date: new Date().toISOString().split('T')[0],
  name: 'Nasi Merah Ayam Bakar & Sayur Asem',
  description: 'Menu seimbang dengan protein tinggi dan serat, dimasak dengan rempah tradisional pilihan khas Malang.',
  calories: 450,
  protein: 25,
  carbs: 50,
  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
  allergens: ['Kacang Tanah (di sayur)', 'Terasi'],
};

export const MOCK_INGREDIENTS = [
  { id: 'i1', name: 'Daging Ayam', expiryDate: '2024-12-20', quantity: 50, unit: 'kg', status: 'Safe' },
  { id: 'i2', name: 'Sayur Bayam', expiryDate: '2024-11-28', quantity: 20, unit: 'kg', status: 'Critical' },
  { id: 'i3', name: 'Beras Merah', expiryDate: '2025-01-15', quantity: 200, unit: 'kg', status: 'Safe' },
  { id: 'i4', name: 'Tahu Putih', expiryDate: '2024-11-30', quantity: 30, unit: 'kg', status: 'Warning' },
];

export const MOCK_DELIVERIES = [
  { 
    id: 'd1', 
    driverName: 'Slamet Malang', 
    schoolName: 'SDN Kauman 1', 
    status: 'In Delivery', 
    departureTime: '09:00',
    arrivalTime: null,
    originLat: -7.9450, 
    originLng: 112.6300,
    destLat: -7.9826,   
    destLng: 112.6308 
  },
];

export const MOCK_REPORTS_INITIAL = [
  { 
    id: 'r1', 
    date: '2024-11-10', 
    title: 'Laporan Harian Unit Malang Tengah', 
    status: 'Pending', 
    sender: 'SPPG Malang Pusat', 
    role: UserRole.SPPG,
    attachments: {
      cookingPhoto: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=400&auto=format&fit=crop',
      packingPhoto: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop',
      pdfUrl: '#',
      hasBon: true
    }
  }
];
