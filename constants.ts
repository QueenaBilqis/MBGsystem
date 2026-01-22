import { UserRole } from './types';

export const APP_NAME = "MBG Systems";

export const MOCK_STATS = {
  totalDistribution: 154200,
  schoolsServed: 450,
  studentsBenefited: 152000,
  complianceRate: 94.5,
};

export const MOCK_COMPLIANCE_DATA = [
  { id: '1', name: 'SD Negeri 01 Jakarta', complianceScore: 98, status: 'High' },
  { id: '2', name: 'SMP Tunas Bangsa', complianceScore: 85, status: 'Medium' },
  { id: '3', name: 'SD Inpres 05', complianceScore: 65, status: 'Low' },
  { id: '4', name: 'SMA Harapan', complianceScore: 92, status: 'High' },
  { id: '5', name: 'SD Pelita', complianceScore: 88, status: 'Medium' },
];

export const MOCK_MENU = {
  id: 'm1',
  date: new Date().toISOString().split('T')[0],
  name: 'Nasi Merah Ayam Bakar & Sayur Asem',
  description: 'Menu seimbang dengan protein tinggi dan serat, dimasak dengan rempah tradisional pilihan.',
  calories: 450,
  protein: 25,
  carbs: 50,
  image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop',
  allergens: ['Kacang Tanah (di sayur)', 'Terasi'],
};

export const MOCK_INGREDIENTS = [
  { id: 'i1', name: 'Daging Ayam', expiryDate: '2023-11-20', quantity: 50, unit: 'kg', status: 'Safe' },
  { id: 'i2', name: 'Sayur Bayam', expiryDate: '2023-10-28', quantity: 20, unit: 'kg', status: 'Critical' },
  { id: 'i3', name: 'Beras Merah', expiryDate: '2024-01-15', quantity: 200, unit: 'kg', status: 'Safe' },
  { id: 'i4', name: 'Tahu Putih', expiryDate: '2023-10-30', quantity: 30, unit: 'kg', status: 'Warning' },
];

export const MOCK_DELIVERIES = [
  { id: 'd1', driverName: 'Budi Santoso', schoolName: 'SD Negeri 01', status: 'On The Way', eta: '10:45 AM', coordinates: { lat: -6.200, lng: 106.816 } },
  { id: 'd2', driverName: 'Asep Kurir', schoolName: 'SMP Tunas Bangsa', status: 'Delivered', eta: '09:30 AM', coordinates: { lat: -6.210, lng: 106.820 } },
];

export const MOCK_REPORTS = [
  { id: 'r1', date: '2023-10-25', title: 'Laporan Distribusi Harian', status: 'Pending', sender: 'SPPG Wilayah 1', role: UserRole.SPPG },
  { id: 'r2', date: '2023-10-24', title: 'Laporan Kualitas Bahan', status: 'Approved', sender: 'SPPG Wilayah 2', role: UserRole.SPPG },
  { id: 'r3', date: '2023-10-25', title: 'Insiden Keterlambatan', status: 'Rejected', sender: 'SD Negeri 01', role: UserRole.SCHOOL },
];

export const BAD_WORDS = ['bodoh', 'jelek', 'sampah', 'tolol'];
