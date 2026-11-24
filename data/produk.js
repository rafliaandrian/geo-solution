/* =========================================================
   GEO SOLUTION – produk.js
   4 sektor, 15 produk/jasa, dan form khusus tiap produk.
   Harga hanya contoh, sesuaikan dengan kalkulasi kalian.

   CARA MEMBACA FORM
   - tipe: text | textarea | number | select | radio | checkbox | swatch | template
   - o('Nama pilihan', tambahanHarga)  -> pilihan dengan biaya tambahan (opsional)
   - jumlah: false  -> produk tanpa kolom jumlah (jasa per proyek)
   - jumlah: { label, min, max, default } -> mengatur kolom jumlah
   ========================================================= */

const o = (nilai, tambah = 0) => ({ nilai, label: nilai, tambah });

// dipakai bersama oleh GeoWeb dan GeoMap Interactive
const fTitik = {
  id: 'jumlahTitik', label: 'Perkiraan jumlah titik lokasi', tipe: 'select', wajib: true,
  opsi: [o('Sampai 25 titik'), o('26–75 titik', 750000), o('76–150 titik', 1500000), o('Lebih dari 150 titik (dihitung khusus)', 3000000)]
};

const SEKTOR = [

  /* ============================ 1. GEOMAP ============================ */
  {
    id: 'geomap',
    nama: 'GeoMap',
    ikon: 'fa-solid fa-map-location-dot',
    ringkas: 'Memetakan lokasi wisata, penginapan, kuliner, dan fasilitas umum.',
    deskripsi: 'Dari survei lapangan sampai peta jadi, cetak maupun digital. Cocok untuk desa wisata, sekolah, instansi, dan pengelola kawasan.',
    produk: [
      {
        kode: 'geomap-service', nama: 'GeoMap Service', ikon: 'fa-solid fa-draw-polygon', unggulan: false,
        deskripsi: 'Jasa pemetaan lapangan untuk lokasi wisata, penginapan, kuliner, dan fasilitas umum.',
        target: 'Desa wisata, pengelola kawasan, instansi, dan perusahaan',
        fitur: ['Survei dan pengambilan titik lokasi', 'Pengolahan data menjadi peta', 'Peta dalam format cetak dan digital'],
        hargaMulai: 2000000, satuan: 'per proyek', jumlah: false,
        form: [
          { id: 'objek', label: 'Objek yang dipetakan', tipe: 'checkbox', wajib: true,
            opsi: [o('Objek wisata'), o('Penginapan & homestay'), o('Kuliner & UMKM'), o('Fasilitas umum (toilet, parkir, musala)'), o('Jalur & akses jalan')] },
          { id: 'luas', label: 'Perkiraan luas area', tipe: 'select', wajib: true,
            opsi: [o('Kurang dari 50 ha'), o('50–200 ha', 1000000), o('200–500 ha', 3000000), o('Lebih dari 500 ha (dihitung khusus)', 5000000)] },
          { id: 'data', label: 'Data lokasi saat ini', tipe: 'radio', wajib: true,
            opsi: [o('Belum ada, perlu survei lapangan'), o('Sudah ada daftar lokasi (Excel / Google Maps)')] },
          { id: 'keluaran', label: 'Hasil yang diinginkan', tipe: 'checkbox', wajib: true,
            opsi: [o('Peta digital (GeoJSON / Shapefile)'), o('Peta cetak', 250000), o('Laporan singkat hasil pemetaan', 250000)] }
        ]
      },
      {
        kode: 'geomap-print', nama: 'GeoMap Print', ikon: 'fa-solid fa-print', unggulan: false,
        deskripsi: 'Peta tematik yang dicetak sesuai kebutuhan Anda.',
        target: 'Sekolah, desa, instansi, dan pengelola wisata',
        fitur: ['Peta wisata dan peta administrasi', 'Peta persebaran fasilitas umum', 'Peta penggunaan lahan'],
        hargaMulai: 150000, satuan: 'per lembar', jumlah: { label: 'Jumlah lembar', min: 1, max: 999, default: 1 },
        form: [
          { id: 'jenis', label: 'Jenis peta', tipe: 'select', wajib: true,
            opsi: [o('Peta wisata'), o('Peta administrasi'), o('Peta persebaran fasilitas umum'), o('Peta penggunaan lahan')] },
          { id: 'ukuran', label: 'Ukuran cetak', tipe: 'select', wajib: true,
            opsi: [o('A3 (30 × 42 cm)'), o('A2 (42 × 59 cm)', 100000), o('A1 (59 × 84 cm)', 200000), o('A0 (84 × 119 cm)', 350000)] },
          { id: 'bahan', label: 'Bahan cetak', tipe: 'radio', wajib: true,
            opsi: [o('Art paper'), o('Foto paper', 50000), o('Banner / flexi', 25000)] },
          { id: 'finishing', label: 'Finishing', tipe: 'radio', opsi: [o('Tanpa finishing'), o('Laminasi', 30000), o('Bingkai', 120000)] },
          { id: 'sumber', label: 'Sumber peta', tipe: 'radio', wajib: true,
            opsi: [o('Kami yang membuatkan petanya'), o('Saya sudah punya file peta')] }
        ]
      },
      {
        kode: 'geofoldmap', nama: 'GeoFoldMap', ikon: 'fa-solid fa-map', unggulan: false,
        deskripsi: 'Peta lipat berukuran saku untuk dibagikan ke wisatawan, lengkap dengan daftar tempat dan QR Code.',
        target: 'Desa wisata, hotel, homestay, dan pengelola kawasan',
        fitur: ['Desain peta wisata ringkas', 'Daftar kuliner, penginapan, dan kontak penting', 'QR Code ke peta digital'],
        hargaMulai: 450000, satuan: 'per paket (100 lembar)', jumlah: { label: 'Jumlah paket (1 paket = 100 lembar)', min: 1, max: 99, default: 1 },
        form: [
          { id: 'lipatan', label: 'Model lipatan', tipe: 'radio', wajib: true, opsi: [o('Lipat 3'), o('Lipat 4', 100000)] },
          { id: 'bahasa', label: 'Bahasa', tipe: 'checkbox', wajib: true, opsi: [o('Indonesia'), o('Inggris', 150000)] },
          { id: 'isi', label: 'Isi tambahan', tipe: 'checkbox', opsi: [o('Daftar kuliner'), o('Daftar penginapan'), o('Kontak darurat'), o('QR Code ke peta digital')] },
          { id: 'wilayah', label: 'Wilayah yang dipetakan', tipe: 'text', wajib: true, placeholder: 'Contoh: Desa Wisata Kaliurang' }
        ]
      },
      {
        kode: 'geoposter', nama: 'GeoPoster', ikon: 'fa-solid fa-image', unggulan: false,
        deskripsi: 'Poster peta dengan desain visual menarik yang mengangkat karakteristik suatu wilayah.',
        target: 'Mahasiswa, wisatawan, komunitas, dan instansi',
        fitur: ['Peta wisata daerah, kampus, dan landmark kota', 'Peta topografi dekoratif', 'Cetak kualitas tinggi'],
        hargaMulai: 100000, satuan: 'per poster', jumlah: { label: 'Jumlah poster', min: 1, max: 999, default: 1 },
        form: [
          { id: 'tema', label: 'Tema poster', tipe: 'select', wajib: true,
            opsi: [o('Peta wisata daerah'), o('Peta kampus'), o('Peta landmark kota'), o('Peta topografi dekoratif')] },
          { id: 'gaya', label: 'Gaya visual', tipe: 'swatch', wajib: true,
            opsi: [
              { nilai: 'Klasik Vintage', label: 'Klasik Vintage', warna: ['#3B2F2F', '#E8DCC0', '#B08D57'] },
              { nilai: 'Modern Minimalis', label: 'Modern Minimalis', warna: ['#2A2A2A', '#EFEFEF', '#C9A24D'] },
              { nilai: 'Ilustrasi Berwarna', label: 'Ilustrasi Berwarna', warna: ['#2E6F6B', '#F6D55C', '#ED553B'] },
              { nilai: 'Topografi Hijau', label: 'Topografi Hijau', warna: ['#15370D', '#728E6D', '#E5CD82'] }
            ] },
          { id: 'ukuran', label: 'Ukuran', tipe: 'select', wajib: true, opsi: [o('A3'), o('A2', 75000), o('A1', 150000)] },
          { id: 'bingkai', label: 'Bingkai', tipe: 'radio', opsi: [o('Tanpa bingkai'), o('Dengan bingkai', 120000)] },
          { id: 'wilayah', label: 'Wilayah atau landmark yang diangkat', tipe: 'text', wajib: true, placeholder: 'Contoh: Kota Surakarta' }
        ]
      }
    ]
  },

  /* ========================== 2. GEOANALYZE ========================== */
  {
    id: 'geoanalyze',
    nama: 'GeoAnalyze',
    ikon: 'fa-solid fa-magnifying-glass-chart',
    ringkas: 'Menganalisis persebaran fasilitas dan aksesibilitas kawasan wisata.',
    deskripsi: 'Analisis spasial berbasis data untuk membantu keputusan lokasi, pengembangan kawasan, dan perencanaan wisata.',
    produk: [
      {
        kode: 'geoanalyze', nama: 'GeoAnalyze', ikon: 'fa-solid fa-magnifying-glass-chart', unggulan: true,
        deskripsi: 'Jasa analisis spasial untuk persebaran fasilitas, aksesibilitas, kesesuaian lahan, dan lokasi potensial.',
        target: 'Pengelola wisata, pemerintah daerah, perusahaan, dan pengembang',
        fitur: ['Analisis sesuai tujuan Anda', 'Peta hasil analisis', 'Rekomendasi tertulis'],
        hargaMulai: 2500000, satuan: 'per analisis', jumlah: false,
        form: [
          { id: 'jenis', label: 'Jenis analisis', tipe: 'checkbox', wajib: true,
            opsi: [o('Persebaran fasilitas wisata'), o('Aksesibilitas kawasan'), o('Kesesuaian lahan'), o('Lokasi potensial usaha'), o('Daerah rawan bencana')] },
          { id: 'tujuan', label: 'Pertanyaan yang ingin dijawab', tipe: 'textarea', wajib: true,
            placeholder: 'Contoh: Di mana sebaiknya toilet umum baru dibangun agar mudah dijangkau wisatawan?' },
          { id: 'data', label: 'Data pendukung', tipe: 'radio', wajib: true,
            opsi: [o('Belum ada data'), o('Sudah ada (Excel, Shapefile, atau GeoJSON)')] },
          { id: 'keluaran', label: 'Hasil yang diinginkan', tipe: 'checkbox', wajib: true,
            opsi: [o('Peta hasil analisis'), o('Tabel & grafik'), o('Rekomendasi tertulis'), o('Presentasi hasil', 500000)] }
        ]
      },
      {
        kode: 'geoaccess', nama: 'GeoAccess', ikon: 'fa-solid fa-route', unggulan: false,
        deskripsi: 'Analisis aksesibilitas kawasan wisata: seberapa mudah wisatawan menjangkau dan berpindah antar lokasi.',
        target: 'Pengelola kawasan wisata, dinas pariwisata, dan desa wisata',
        fitur: ['Jarak dan waktu tempuh dari titik asal wisatawan', 'Penilaian kondisi jalan dan transportasi', 'Rekomendasi perbaikan akses'],
        hargaMulai: 1800000, satuan: 'per kawasan', jumlah: false,
        form: [
          { id: 'kawasan', label: 'Nama kawasan wisata', tipe: 'text', wajib: true, placeholder: 'Contoh: Kawasan Tawangmangu' },
          { id: 'asal', label: 'Titik asal wisatawan', tipe: 'text', wajib: true, placeholder: 'Contoh: Stasiun Solo Balapan' },
          { id: 'aspek', label: 'Aspek yang dianalisis', tipe: 'checkbox', wajib: true,
            opsi: [o('Jarak & waktu tempuh'), o('Kondisi dan jenis jalan'), o('Transportasi umum'), o('Parkir & fasilitas penunjang'), o('Jarak antar objek wisata')] },
          { id: 'laporan', label: 'Bentuk laporan', tipe: 'radio', wajib: true, opsi: [o('Peta + ringkasan'), o('Laporan lengkap', 700000)] }
        ]
      },
      {
        kode: 'geoinsight-report', nama: 'GeoInsight Report', ikon: 'fa-solid fa-file-lines', unggulan: false,
        deskripsi: 'Laporan digital berbasis analisis spasial yang membantu Anda memahami kondisi suatu wilayah.',
        target: 'Pengembang properti, petani, perusahaan, dan instansi',
        fitur: ['Analisis kesesuaian lahan dan lokasi potensial usaha', 'Analisis daerah rawan bencana dan aksesibilitas', 'Format PDF siap presentasi'],
        hargaMulai: 1000000, satuan: 'per laporan', jumlah: false,
        form: [
          { id: 'jenis', label: 'Jenis laporan', tipe: 'select', wajib: true,
            opsi: [o('Kesesuaian lahan'), o('Lokasi potensial usaha'), o('Daerah rawan bencana'), o('Aksesibilitas')] },
          { id: 'pemakai', label: 'Laporan ini untuk', tipe: 'select', wajib: true,
            opsi: [o('Pengembang properti'), o('Pertanian'), o('Perusahaan'), o('Instansi / pemerintah'), o('Lainnya')] },
          { id: 'kedalaman', label: 'Kedalaman laporan', tipe: 'radio', wajib: true,
            opsi: [o('Ringkas (sekitar 10–15 halaman)'), o('Lengkap (sekitar 25–40 halaman)', 1000000)] },
          { id: 'area', label: 'Area yang dianalisis', tipe: 'text', wajib: true, placeholder: 'Nama area atau koordinat' }
        ]
      },
      {
        kode: 'geodashboard', nama: 'GeoDashboard', ikon: 'fa-solid fa-chart-pie', unggulan: false,
        deskripsi: 'Dashboard digital yang menyajikan informasi geografis dan statistik wilayah dalam satu tampilan.',
        target: 'Pemerintah desa, perusahaan, dan instansi',
        fitur: ['Persebaran penduduk dan UMKM', 'Fasilitas publik dan penggunaan lahan', 'Grafik dan peta saling terhubung'],
        hargaMulai: 3000000, satuan: 'per proyek', jumlah: false,
        form: [
          { id: 'data', label: 'Data yang ditampilkan', tipe: 'checkbox', wajib: true,
            opsi: [o('Persebaran penduduk'), o('Persebaran UMKM'), o('Fasilitas publik'), o('Informasi penggunaan lahan')] },
          { id: 'sumber', label: 'Sumber data', tipe: 'radio', wajib: true,
            opsi: [o('Saya sediakan (Excel / CSV)'), o('Mohon dibantu dikumpulkan', 1500000)] },
          { id: 'pengguna', label: 'Pengguna dashboard', tipe: 'select', wajib: true,
            opsi: [o('Pemerintah desa'), o('Perusahaan'), o('Instansi'), o('Lainnya')] },
          { id: 'akses', label: 'Hak akses', tipe: 'radio', wajib: true, opsi: [o('Terbuka untuk publik'), o('Khusus admin (perlu login)', 500000)] }
        ]
      }
    ]
  },

  /* ============================ 3. GEOWEB ============================ */
  {
    id: 'geoweb',
    nama: 'GeoWeb',
    ikon: 'fa-solid fa-qrcode',
    ringkas: 'Membuat peta wisata digital yang dapat diakses melalui QR Code.',
    deskripsi: 'Peta wisata online yang dibuka pengunjung cukup dengan scan QR Code, dilengkapi papan, stiker, dan Web GIS.',
    produk: [
      {
        kode: 'geoweb', nama: 'GeoWeb', ikon: 'fa-solid fa-laptop-code', unggulan: true,
        deskripsi: 'Pengembangan Web GIS untuk menampilkan, mencari, dan mengelola data wisata secara online. Pilih template tampilan favorit Anda.',
        target: 'Desa wisata, pengelola kawasan, dan pemerintah daerah',
        fitur: ['Pilihan template tampilan', 'Tampilan responsif di HP', 'Pengelolaan data oleh admin'],
        hargaMulai: 4000000, satuan: 'per proyek', jumlah: false,
        form: [
          { id: 'template', label: 'Pilih template tampilan', tipe: 'template', wajib: true,
            bantuan: 'Template menjadi titik awal. Warna dan logo tetap bisa disesuaikan.',
            opsi: [
              { nilai: 'Eksplorasi', label: 'Eksplorasi', tata: 'sidebar', warna: ['#15370D', '#C9DABF', '#E5CD82'],
                deskripsi: 'Daftar tempat di samping peta. Cocok untuk kawasan dengan banyak titik.' },
              { nilai: 'Peta Penuh', label: 'Peta Penuh', tata: 'full', warna: ['#0F3D5E', '#BCD6E8', '#F2B84B'],
                deskripsi: 'Peta layar penuh dengan panel info geser dari bawah. Nyaman dibuka dari HP setelah scan QR.' },
              { nilai: 'Katalog Wisata', label: 'Katalog Wisata', tata: 'cards', warna: ['#7A3E1D', '#EBD9BC', '#C9A24D'],
                deskripsi: 'Halaman profil kawasan dengan kartu destinasi dan peta di bawahnya.' },
              { nilai: 'Desain Khusus', label: 'Desain Khusus', tata: 'custom', warna: ['#4E6A49', '#FFF2B4', '#15370D'], tambah: 2500000,
                deskripsi: 'Tampilan dirancang dari nol sesuai identitas Anda.' }
            ] },
          { id: 'identitas', label: 'Warna atau identitas yang diinginkan', tipe: 'text', placeholder: 'Contoh: hijau dan emas, logo menyusul' },
          fTitik,
          { id: 'fitur', label: 'Fitur tambahan', tipe: 'checkbox',
            opsi: [o('Filter kategori'), o('Tombol navigasi ke lokasi'), o('Galeri foto tiap lokasi', 500000), o('Dua bahasa (Indonesia & Inggris)', 750000), o('Statistik pengunjung', 500000)] },
          { id: 'domain', label: 'Alamat web', tipe: 'radio', wajib: true,
            opsi: [o('Sudah punya domain'), o('Pakai subdomain dari kami'), o('Dibelikan domain baru', 250000)] },
          { id: 'dataLokasi', label: 'Data titik lokasi', tipe: 'radio', wajib: true,
            opsi: [o('Sudah siap'), o('Belum, perlu dipetakan dulu (dihitung terpisah lewat GeoMap Service)')] }
        ]
      },
      {
        kode: 'geomap-interactive', nama: 'GeoMap Interactive', ikon: 'fa-solid fa-map-location-dot', unggulan: false,
        deskripsi: 'Peta digital interaktif yang bisa dibuka melalui smartphone atau komputer.',
        target: 'Wisatawan, pengelola kawasan, dan pemerintah desa',
        fitur: ['Menampilkan titik lokasi', 'Informasi fasilitas dan tempat', 'Navigasi dan filter kategori lokasi'],
        hargaMulai: 1500000, satuan: 'per proyek', jumlah: false,
        form: [
          { id: 'tema', label: 'Tema warna', tipe: 'swatch', wajib: true,
            opsi: [
              { nilai: 'Hijau Alam', label: 'Hijau Alam', warna: ['#15370D', '#728E6D', '#E5CD82'] },
              { nilai: 'Biru Pesisir', label: 'Biru Pesisir', warna: ['#0F3D5E', '#6FA8C9', '#F2B84B'] },
              { nilai: 'Emas Klasik', label: 'Emas Klasik', warna: ['#3B2F2F', '#B08D57', '#FFF2B4'] }
            ] },
          { id: 'kategori', label: 'Kategori lokasi', tipe: 'checkbox', wajib: true,
            opsi: [o('Objek wisata'), o('Penginapan'), o('Kuliner'), o('Fasilitas umum'), o('UMKM & oleh-oleh')] },
          fTitik,
          { id: 'fitur', label: 'Fitur', tipe: 'checkbox',
            opsi: [o('Filter kategori'), o('Tombol navigasi'), o('Foto tempat', 300000), o('Jam buka & kontak'), o('Rute wisata', 500000)] }
        ]
      },
      {
        kode: 'geoqr-board', nama: 'GeoQR Board', ikon: 'fa-solid fa-qrcode', unggulan: true,
        deskripsi: 'Papan informasi lokasi yang dilengkapi QR Code untuk mengakses peta digital.',
        target: 'Desa wisata, kafe, hotel, dan pengelola kawasan',
        fitur: ['Papan petunjuk destinasi wisata', 'Papan informasi fasilitas umum dan lokasi UMKM', 'Tahan cuaca, QR Code terhubung ke peta digital'],
        hargaMulai: 750000, satuan: 'per papan', jumlah: { label: 'Jumlah papan', min: 1, max: 99, default: 1 },
        form: [
          { id: 'jenis', label: 'Jenis papan', tipe: 'select', wajib: true,
            opsi: [o('Petunjuk destinasi wisata'), o('Informasi fasilitas umum'), o('Lokasi UMKM')] },
          { id: 'ukuran', label: 'Ukuran', tipe: 'select', wajib: true,
            opsi: [o('Kecil (30 × 40 cm)'), o('Sedang (50 × 70 cm)', 350000), o('Besar (80 × 120 cm)', 900000)] },
          { id: 'bahan', label: 'Bahan', tipe: 'radio', wajib: true, opsi: [o('ACP outdoor'), o('Akrilik', 250000)] },
          { id: 'pasang', label: 'Cara pemasangan', tipe: 'radio', wajib: true,
            opsi: [o('Tempel di dinding'), o('Dengan tiang penyangga', 350000)] },
          { id: 'jasaPasang', label: 'Pemasangan', tipe: 'radio', wajib: true,
            opsi: [o('Dikirim saja, saya pasang sendiri'), o('Dipasang oleh tim kami', 300000)] },
          { id: 'peta', label: 'Peta digital yang dihubungkan', tipe: 'radio', wajib: true,
            opsi: [o('Sudah punya peta digital'), o('Belum, mohon dibuatkan (GeoMap Interactive, dihitung terpisah)')] },
          { id: 'teks', label: 'Teks pada papan', tipe: 'textarea', placeholder: 'Judul, nama lokasi, atau informasi yang ingin dicantumkan' }
        ]
      },
      {
        kode: 'geoqr-mini', nama: 'GeoQR Mini', ikon: 'fa-solid fa-qrcode', unggulan: false,
        deskripsi: 'QR Code berukuran kecil untuk meja kafe, kamar hotel, dan homestay yang membuka peta wisata sekitar.',
        target: 'Kafe, hotel, homestay, dan tempat wisata skala kecil',
        fitur: ['Stiker atau standing acrylic meja', 'Desain sesuai identitas tempat Anda', 'Terhubung ke peta digital'],
        hargaMulai: 200000, satuan: 'per paket (10 pcs)', jumlah: { label: 'Jumlah paket (1 paket = 10 pcs)', min: 1, max: 99, default: 1 },
        form: [
          { id: 'bentuk', label: 'Bentuk', tipe: 'radio', wajib: true,
            opsi: [o('Stiker QR'), o('Standing acrylic meja', 150000), o('Kartu QR (kamar / meja)', 50000)] },
          { id: 'tujuan', label: 'QR dipakai untuk', tipe: 'checkbox', wajib: true,
            opsi: [o('Menu dan lokasi usaha'), o('Panduan tamu'), o('Peta wisata sekitar')] },
          { id: 'teks', label: 'Teks atau nama usaha yang dicantumkan', tipe: 'text', wajib: true, placeholder: 'Nama kafe / hotel / homestay' }
        ]
      }
    ]
  },

  /* ============================ 4. GEOCARE ============================ */
  {
    id: 'geocare',
    nama: 'GeoCare',
    ikon: 'fa-solid fa-rotate',
    ringkas: 'Memperbarui lokasi dan informasi wisata secara berkala.',
    deskripsi: 'Agar peta, papan QR, dan data wisata Anda selalu akurat dan tidak ketinggalan zaman.',
    produk: [
      {
        kode: 'geocare-update', nama: 'GeoCare Update', ikon: 'fa-solid fa-database', unggulan: true,
        deskripsi: 'Layanan langganan pembaruan lokasi dan informasi wisata, termasuk peta pada GeoQR Board.',
        target: 'Pengelola wisata, desa wisata, hotel, dan instansi',
        fitur: ['Pembaruan titik dan informasi lokasi', 'Pengecekan data berkala', 'Dukungan bila ada kendala'],
        hargaMulai: 250000, satuan: 'per bulan', jumlah: { label: 'Durasi langganan (bulan)', min: 1, max: 36, default: 6 },
        form: [
          { id: 'paket', label: 'Paket pembaruan', tipe: 'radio', wajib: true,
            opsi: [o('Dasar (sampai 10 titik / bulan)'), o('Standar (sampai 30 titik / bulan)', 150000), o('Lengkap (sampai 100 titik / bulan)', 400000)] },
          { id: 'objek', label: 'Yang dirawat', tipe: 'checkbox', wajib: true,
            opsi: [o('Peta digital (GeoMap Interactive)'), o('Web GIS (GeoWeb)'), o('Isi papan GeoQR Board'), o('GeoDashboard')] },
          { id: 'jenis', label: 'Jenis pembaruan', tipe: 'checkbox', wajib: true,
            opsi: [o('Jam buka & harga'), o('Foto lokasi'), o('Titik baru / tutup'), o('Kontak & informasi lain')] },
          { id: 'frekuensi', label: 'Frekuensi', tipe: 'radio', wajib: true, opsi: [o('Sebulan sekali'), o('Dua minggu sekali', 100000)] },
          { id: 'pj', label: 'Penanggung jawab data di pihak Anda', tipe: 'text', placeholder: 'Nama atau jabatan' }
        ]
      },
      {
        kode: 'geocare-audit', nama: 'GeoCare Audit', ikon: 'fa-solid fa-clipboard-check', unggulan: false,
        deskripsi: 'Pengecekan menyeluruh akurasi data peta, fungsi QR Code, dan kondisi papan di lapangan.',
        target: 'Pengelola wisata dan instansi yang sudah memiliki peta atau papan QR',
        fitur: ['Cek akurasi titik dan kelengkapan informasi', 'Uji fungsi QR Code dan tautan', 'Laporan temuan dan rekomendasi'],
        hargaMulai: 750000, satuan: 'per audit', jumlah: false,
        form: [
          { id: 'objek', label: 'Yang diaudit', tipe: 'checkbox', wajib: true,
            opsi: [o('Akurasi titik lokasi'), o('Kelengkapan informasi'), o('Fungsi QR Code & tautan'), o('Kondisi fisik papan (survei lapangan)', 500000)] },
          { id: 'jumlah', label: 'Jumlah titik / papan yang dicek', tipe: 'select', wajib: true,
            opsi: [o('Sampai 25'), o('26–75', 500000), o('Lebih dari 75 (dihitung khusus)', 1200000)] },
          { id: 'tautan', label: 'Alamat peta digital (jika ada)', tipe: 'text', placeholder: 'https://...' }
        ]
      },
      {
        kode: 'geocare-training', nama: 'GeoCare Training', ikon: 'fa-solid fa-chalkboard-user', unggulan: false,
        deskripsi: 'Pelatihan singkat agar pengelola bisa memperbarui peta dan data wisata secara mandiri.',
        target: 'Pengelola desa wisata, pokdarwis, dan staf instansi',
        fitur: ['Praktik langsung memperbarui data', 'Modul panduan', 'Pendampingan setelah pelatihan'],
        hargaMulai: 1500000, satuan: 'per sesi', jumlah: { label: 'Jumlah sesi', min: 1, max: 20, default: 1 },
        form: [
          { id: 'peserta', label: 'Perkiraan jumlah peserta', tipe: 'select', wajib: true,
            opsi: [o('Sampai 10 orang'), o('11–25 orang', 500000), o('26–50 orang', 1000000)] },
          { id: 'materi', label: 'Materi', tipe: 'checkbox', wajib: true,
            opsi: [o('Memperbarui titik & info peta'), o('Mengelola dashboard'), o('Membuat foto dan konten wisata'), o('Dasar GIS')] },
          { id: 'format', label: 'Format pelatihan', tipe: 'radio', wajib: true, opsi: [o('Daring (Zoom / Meet)'), o('Tatap muka di lokasi Anda', 500000)] }
        ]
      }
    ]
  }
];

/* Gambar produk otomatis: assets/images/produk/<kode>.jpg */
SEKTOR.forEach((s) => s.produk.forEach((p) => { p.gambar = `assets/images/produk/${p.kode}.jpg`; }));

/* ---------- Fungsi bantu ---------- */
function getSektor(id) {
  return SEKTOR.find((s) => s.id === id) || null;
}
function getProduk(kode) {
  for (const sektor of SEKTOR) {
    const produk = sektor.produk.find((p) => p.kode === kode);
    if (produk) return { produk, sektor };
  }
  return null;
}
function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}