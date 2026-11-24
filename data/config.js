/* =========================================================
   GEO SOLUTION – config.js
   Semua pengaturan yang perlu diisi ada di sini.
   Kosongkan (biarkan '') kalau belum punya: web tetap jalan
   dalam MODE DEMO (email dilewati, WA belum aktif).
   ========================================================= */

const CONFIG = {
  // Identitas
  namaBrand: 'Geo Solution',
  namaPerusahaan: 'PT GS',
  tagline: 'Integrated Geospatial Products and Services',

  // WhatsApp admin: format 62..., tanpa + dan tanpa 0 di depan
  // contoh: '6281234567890'
  waNumber: '',

  // Email admin (untuk ditampilkan di web)
  emailTujuan: '',

  // Instagram (tanpa @)
  instagram: '',

  // EmailJS (daftar gratis di emailjs.com), isi ketiganya kalau sudah punya
  emailjs: {
    publicKey: '',
    serviceId: '',
    templateId: ''
  }
};

// Pengecekan otomatis, dipakai oleh order.js dan sukses.js
const WA_AKTIF = CONFIG.waNumber.trim() !== '';
const EMAIL_AKTIF =
  CONFIG.emailjs.publicKey.trim() !== '' &&
  CONFIG.emailjs.serviceId.trim() !== '' &&
  CONFIG.emailjs.templateId.trim() !== '';