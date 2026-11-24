/* =========================================================
   GEO SOLUTION – main.js (dipakai SEMUA halaman)
   Tugas: preloader, navbar, footer, WA melayang, animasi scroll,
          counter statistik, dan kartu 4 sektor di beranda.
   Wajib dimuat SETELAH data/config.js dan data/produk.js
   ========================================================= */

/* ---------- 1. NAVBAR & FOOTER OTOMATIS ---------- */
function buatNavbar() {
  const slot = document.getElementById('navbar-slot');
  if (!slot) return;
  slot.innerHTML = `
    <header class="navbar" id="navbar">
      <a href="index.html" class="logo">
        <i class="fa-solid fa-earth-asia"></i>
        <span>Geo<b>Solution</b></span>
      </a>
      <nav class="menu" id="menu">
        <a href="index.html">Beranda</a>
        <a href="index.html#tentang">Tentang</a>
        <a href="index.html#sektor">Sektor</a>
        <a href="index.html#keunggulan">Keunggulan</a>
        <a href="index.html#alur">Alur</a>
        <a href="index.html#sektor" class="btn btn-gold btn-sm">Pesan Sekarang</a>
      </nav>
      <button class="burger" id="burger" aria-label="Buka menu"><i class="fa-solid fa-bars"></i></button>
    </header>`;
}

function buatFooter() {
  const slot = document.getElementById('footer-slot');
  if (!slot) return;

  const linkSektor = SEKTOR.map(
    (s) => `<a href="sektor.html?s=${s.id}">${s.nama}</a>`
  ).join('');

  // kontak hanya tampil kalau sudah diisi di config.js
  const kontak = [];
  if (WA_AKTIF) kontak.push(`<li><i class="fa-brands fa-whatsapp"></i> +${CONFIG.waNumber}</li>`);
  if (CONFIG.emailTujuan) kontak.push(`<li><i class="fa-solid fa-envelope"></i> ${CONFIG.emailTujuan}</li>`);
  if (CONFIG.instagram) kontak.push(`<li><i class="fa-brands fa-instagram"></i> @${CONFIG.instagram}</li>`);
  const blokKontak = kontak.length
    ? `<div><h5>Kontak</h5><ul class="footer-contact">${kontak.join('')}</ul></div>`
    : `<div><h5>Kontak</h5><p style="font-size:.92rem">Informasi kontak segera tersedia.</p></div>`;

  slot.innerHTML = `
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <a href="index.html" class="logo"><i class="fa-solid fa-earth-asia"></i> <span>Geo<b>Solution</b></span></a>
          <p>${CONFIG.tagline}</p>
        </div>
        <div><h5>Sektor</h5>${linkSektor}</div>
        <div>
          <h5>Menu</h5>
          <a href="index.html#tentang">Tentang</a>
          <a href="index.html#keunggulan">Keunggulan</a>
          <a href="index.html#alur">Alur Pemesanan</a>
        </div>
        ${blokKontak}
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} ${CONFIG.namaBrand}. Dibuat oleh ${CONFIG.namaPerusahaan}.</p>
      </div>
    </footer>`;
}

function buatTombolWA() {
  if (!WA_AKTIF) return; // sembunyi dulu kalau nomor belum diisi
  const a = document.createElement('a');
  a.href = `https://wa.me/${CONFIG.waNumber}`;
  a.className = 'wa-float';
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat WhatsApp');
  a.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
  document.body.appendChild(a);
}

/* ---------- 2. PRELOADER (hanya sekali per sesi) ---------- */
function jalankanPreloader() {
  let sudah = false;
  try { sudah = sessionStorage.getItem('gs-preloader') === '1'; } catch (e) {}
  if (sudah) return;

  const el = document.createElement('div');
  el.className = 'preloader';
  el.innerHTML = `<i class="fa-solid fa-location-dot pin"></i><span>${CONFIG.namaBrand}</span>`;
  document.body.prepend(el);

  const tutup = () => {
    el.classList.add('hide');
    setTimeout(() => el.remove(), 700);
  };
  window.addEventListener('load', () => setTimeout(tutup, 700));
  setTimeout(tutup, 3500); // cadangan
  try { sessionStorage.setItem('gs-preloader', '1'); } catch (e) {}
}

/* ---------- 3. NAVBAR: perilaku scroll & menu HP ---------- */
function aktifkanNavbar() {
  const navbar = document.getElementById('navbar');
  const menu = document.getElementById('menu');
  const burger = document.getElementById('burger');
  if (!navbar) return;

  // di halaman tanpa hero, navbar langsung solid
  const adaHero = document.querySelector('.hero');
  const atur = () => navbar.classList.toggle('scrolled', !adaHero || window.scrollY > 60);
  window.addEventListener('scroll', atur, { passive: true });
  atur();

  burger.addEventListener('click', () => {
    const buka = menu.classList.toggle('open');
    burger.innerHTML = buka
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('open');
      burger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  });
}

/* ---------- 4. ANIMASI MUNCUL SAAT SCROLL ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

// dipakai juga oleh sektor.js untuk elemen yang dibuat belakangan
window.observeReveal = function (root = document) {
  root.querySelectorAll('.reveal:not(.in)').forEach((el) => revealObserver.observe(el));
};

/* ---------- 5. COUNTER STATISTIK ---------- */
function jalankanCounter(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const durasi = 1800;
  const mulai = performance.now();

  function tick(now) {
    const p = Math.min((now - mulai) / durasi, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function aktifkanCounter() {
  // angka sektor & produk diambil dari data, jadi selalu akurat
  const statSektor = document.getElementById('statSektor');
  const statProduk = document.getElementById('statProduk');
  if (statSektor) statSektor.dataset.count = SEKTOR.length;
  if (statProduk) {
    statProduk.dataset.count = SEKTOR.reduce((t, s) => t + s.produk.length, 0);
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        jalankanCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => obs.observe(el));
}

/* ---------- 6. KARTU 4 SEKTOR DI BERANDA ---------- */
function tampilkanSektorBeranda() {
  const grid = document.getElementById('sektorGrid');
  if (!grid) return;

  grid.innerHTML = SEKTOR.map((s) => `
    <a href="sektor.html?s=${s.id}" class="sektor-card reveal">
      <div class="sektor-icon"><i class="${s.ikon}"></i></div>
      <h3>${s.nama}</h3>
      <p>${s.ringkas}</p>
      <span class="sektor-count">${s.produk.length} produk &amp; jasa</span>
      <span class="sektor-btn">Lihat produk <i class="fa-solid fa-chevron-right"></i></span>
    </a>`).join('');
}

/* ---------- JALANKAN SEMUA ---------- */
buatNavbar();
buatFooter();
buatTombolWA();
jalankanPreloader();
aktifkanNavbar();
tampilkanSektorBeranda();
aktifkanCounter();
window.observeReveal();