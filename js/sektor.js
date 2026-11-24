/* =========================================================
   GEO SOLUTION – sektor.js
   Membaca ?s=id-sektor dari URL, lalu menampilkan produknya.
   Contoh: sektor.html?s=peta-digital
   Wajib dimuat SETELAH config.js, produk.js, dan main.js
   ========================================================= */

(function () {
    const params = new URLSearchParams(window.location.search);
    let sektor = getSektor(params.get('s'));

    // kalau ?s= kosong atau salah, tampilkan sektor pertama
    if (!sektor) sektor = SEKTOR[0];

    /* ---------- Header ---------- */
    document.title = `${sektor.nama} | ${CONFIG.namaBrand}`;
    document.getElementById('crumbNama').textContent = sektor.nama;
    document.getElementById('heroNama').textContent = sektor.nama;
    document.getElementById('heroDeskripsi').textContent = sektor.deskripsi;
    document.getElementById('heroIkon').className = sektor.ikon;
    document.getElementById('produkJudul').textContent = `${sektor.produk.length} produk & jasa di sektor ${sektor.nama}`;

    /* ---------- Tombol pindah sektor ---------- */
    document.getElementById('switcher').innerHTML = SEKTOR.map((s) => `
    <a href="sektor.html?s=${s.id}" class="switch-btn ${s.id === sektor.id ? 'active' : ''}">
      <i class="${s.ikon}"></i> ${s.nama}
    </a>`).join('');

    /* ---------- Kartu produk ---------- */
    const grid = document.getElementById('produkGrid');

    grid.innerHTML = sektor.produk.map((p) => `
    <article class="produk-card reveal">
      <div class="produk-media">
        <i class="${p.ikon}"></i>
        <img src="${p.gambar}" alt="${p.nama}" loading="lazy">
        ${p.unggulan ? '<span class="tag-unggulan">Unggulan</span>' : ''}
      </div>
      <div class="produk-body">
        <h3>${p.nama}</h3>
        <p>${p.deskripsi}</p>
                ${p.target ? `<p class="produk-target"><i class="fa-solid fa-users"></i> ${p.target}</p>` : ''}
        <ul class="produk-fitur">
          ${p.fitur.map((f) => `<li><i class="fa-solid fa-check"></i><span>${f}</span></li>`).join('')}
        </ul>
        <div class="produk-foot">
          <div class="harga">
            <small>Mulai dari</small>
            <strong>${formatRupiah(p.hargaMulai)}</strong>
            <span>${p.satuan}</span>
          </div>
          <a href="order.html?p=${p.kode}" class="btn btn-gold btn-sm">
            Pilih produk <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </article>`).join('');

    // kalau foto belum ada, buang <img> supaya ikon tetap tampil (tidak ada gambar rusak)
    grid.querySelectorAll('.produk-media img').forEach((img) => {
        img.addEventListener('error', () => img.remove());
    });

    // aktifkan animasi muncul untuk kartu yang baru dibuat
    window.observeReveal(grid);
})();