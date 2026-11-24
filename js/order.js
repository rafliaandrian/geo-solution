/* =========================================================
   GEO SOLUTION – order.js (versi form per produk)
   - Membaca ?p=kode-produk
   - Membuat kolom khusus produk dari data/produk.js
   - Menghitung estimasi, validasi, kirim email, simpan pesanan
   ========================================================= */

(function () {
  const kode = new URLSearchParams(window.location.search).get('p');
  const hasil = getProduk(kode);

  const orderWrap = document.getElementById('orderWrap');
  const notFound = document.getElementById('notFound');
  if (!hasil) { notFound.hidden = false; return; }

  const { produk, sektor } = hasil;
  orderWrap.hidden = false;
  document.title = `Pesan ${produk.nama} | ${CONFIG.namaBrand}`;

  const unit = produk.satuan.replace('per ', '');
  const norm = (op) => ({ tambah: 0, label: op.nilai, ...op });
  const fields = (produk.form || []).map((f) => ({ ...f, opsi: (f.opsi || []).map(norm) }));
  const cfgJumlah = produk.jumlah === false
    ? null
    : { label: `Jumlah (${unit})`, min: 1, max: 999, default: 1, ...(produk.jumlah || {}) };

  /* ---------- Ringkasan produk ---------- */
  document.getElementById('summary').innerHTML = `
    <div class="summary-top">
      <div class="summary-icon"><i class="${produk.ikon}"></i></div>
      <div><small>Sektor ${sektor.nama}</small><h2>${produk.nama}</h2></div>
    </div>
    <div class="summary-body">
      <p>${produk.deskripsi}</p>
      ${produk.target ? `<p class="summary-target"><i class="fa-solid fa-users"></i> Cocok untuk: ${produk.target}</p>` : ''}
      <ul>${produk.fitur.map((f) => `<li><i class="fa-solid fa-check"></i><span>${f}</span></li>`).join('')}</ul>
      <div class="price-box">
        <div class="price-line"><span>Harga mulai dari</span><span>${formatRupiah(produk.hargaMulai)} ${produk.satuan}</span></div>
        <div class="price-line" id="rowTambah" hidden><span>Tambahan dari pilihan Anda</span><span id="hargaTambah"></span></div>
        <div class="price-line"><span>Estimasi total</span><strong id="estimasi">${formatRupiah(produk.hargaMulai)}</strong></div>
        <p class="price-note">Estimasi awal. Harga final dikonfirmasi tim kami setelah kebutuhan Anda ditinjau.</p>
      </div>
      <a href="sektor.html?s=${sektor.id}" class="summary-change"><i class="fa-solid fa-arrow-left"></i> Ganti produk</a>
    </div>`;

  /* ---------- Elemen form ---------- */
  const form = document.getElementById('orderForm');
  const jumlah = document.getElementById('jumlah');
  const tanggal = document.getElementById('tanggal');
  const formError = document.getElementById('formError');
  const submitBtn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  const extraFields = document.getElementById('extraFields');

  tanggal.min = new Date().toISOString().split('T')[0];

  // kolom jumlah: tampil sesuai produk, atau disembunyikan
  if (cfgJumlah) {
    document.getElementById('jumlahLabel').textContent = `${cfgJumlah.label} *`;
    jumlah.min = cfgJumlah.min;
    jumlah.max = cfgJumlah.max;
    jumlah.value = cfgJumlah.default;
  } else {
    document.getElementById('jumlahField').hidden = true;
    document.getElementById('rowJumlah').classList.add('solo');
  }

  /* ---------- Membuat kolom khusus produk ---------- */
  const htmlHarga = (t) => (t > 0 ? `<em class="plus">+${formatRupiah(t)}</em>` : '');

  function mockWeb(op) {
    const [c1, c2, c3] = op.warna;
    const peta = '<div class="mock-map"><b></b><b></b><b></b></div>';
    const isi = {
      sidebar: `<div class="mock-body"><div class="mock-list"><i></i><i></i><i></i></div>${peta}</div>`,
      full: `<div class="mock-body full">${peta}<div class="mock-sheet"></div></div>`,
      cards: '<div class="mock-body cards"><div class="mock-hero"></div><div class="mock-row"><i></i><i></i><i></i></div></div>',
      custom: '<div class="mock-body custom"><i class="fa-solid fa-pen-ruler"></i></div>'
    }[op.tata] || '';
    return `<div class="mock" style="--c1:${c1};--c2:${c2};--c3:${c3}"><div class="mock-bar"></div>${isi}</div>`;
  }

  const swatch = (op) => `<span class="swatch">${op.warna.map((w) => `<i style="background:${w}"></i>`).join('')}</span>`;

  function renderField(f) {
    const id = 'f_' + f.id;
    const ph = f.placeholder || '';
    let kontrol = '';
    let labelHtml = `<label for="${id}">${f.label}${f.wajib ? ' *' : ''}</label>`;

    if (f.tipe === 'textarea') {
      kontrol = `<textarea id="${id}" rows="3" placeholder="${ph}"></textarea>`;
    } else if (f.tipe === 'select') {
      kontrol = `<select id="${id}"><option value="">Pilih salah satu</option>${f.opsi
        .map((op, i) => `<option value="${i}">${op.label}${op.tambah ? ` (+${formatRupiah(op.tambah)})` : ''}</option>`).join('')}</select>`;
    } else if (f.tipe === 'radio' || f.tipe === 'checkbox') {
      labelHtml = `<span class="lbl">${f.label}${f.wajib ? ' *' : ''}</span>`;
      kontrol = `<div class="opsi-grup">${f.opsi.map((op, i) => `
        <label class="chip-opt"><input type="${f.tipe}" name="${id}" value="${i}"><span class="chip-body">${op.label}${htmlHarga(op.tambah)}</span></label>`).join('')}</div>`;
    } else if (f.tipe === 'swatch' || f.tipe === 'template') {
      labelHtml = `<span class="lbl">${f.label}${f.wajib ? ' *' : ''}</span>`;
      kontrol = `<div class="tmpl-grid ${f.tipe === 'swatch' ? 'sw' : ''}">${f.opsi.map((op, i) => `
        <label class="tmpl-card"><input type="radio" name="${id}" value="${i}"><span class="chip-body">
          ${f.tipe === 'template' ? mockWeb(op) : swatch(op)}
          <b>${op.label}</b>${op.deskripsi ? `<small>${op.deskripsi}</small>` : ''}${htmlHarga(op.tambah)}
        </span></label>`).join('')}</div>`;
    } else {
      kontrol = `<input type="${f.tipe === 'number' ? 'number' : 'text'}" id="${id}" placeholder="${ph}">`;
    }

    return `<div class="field" data-fid="${f.id}">${labelHtml}${kontrol}${f.bantuan ? `<small class="hint">${f.bantuan}</small>` : ''}<small class="err"></small></div>`;
  }

  if (fields.length) {
    document.getElementById('extraWrap').hidden = false;
    document.getElementById('extraNama').textContent = produk.nama;
    extraFields.innerHTML = fields.map(renderField).join('');
  }

  /* ---------- Membaca isi kolom ---------- */
  const wrapper = (f) => extraFields.querySelector(`.field[data-fid="${f.id}"]`);

  // selalu mengembalikan daftar pilihan terpilih (teks bebas dibungkus jadi satu pilihan)
  function baca(f) {
    const w = wrapper(f);
    if (['radio', 'swatch', 'template'].includes(f.tipe)) {
      const c = w.querySelector('input:checked');
      return c ? [f.opsi[+c.value]] : [];
    }
    if (f.tipe === 'checkbox') return [...w.querySelectorAll('input:checked')].map((c) => f.opsi[+c.value]);
    if (f.tipe === 'select') {
      const v = w.querySelector('select').value;
      return v === '' ? [] : [f.opsi[+v]];
    }
    const v = w.querySelector('input, textarea').value.trim();
    return v ? [{ nilai: v, label: v, tambah: 0 }] : [];
  }

  /* ---------- Estimasi ---------- */
  function hitung() {
    const n = cfgJumlah ? Math.max(1, parseInt(jumlah.value, 10) || 1) : 1;
    const tambah = fields.reduce((t, f) => t + baca(f).reduce((s, x) => s + (x.tambah || 0), 0), 0);
    const total = (produk.hargaMulai + tambah) * n;
    document.getElementById('rowTambah').hidden = tambah === 0;
    document.getElementById('hargaTambah').textContent = `+${formatRupiah(tambah)} ${produk.satuan}`;
    document.getElementById('estimasi').textContent = formatRupiah(total);
    return { n, tambah, total };
  }
  form.addEventListener('input', hitung);
  form.addEventListener('change', hitung);

  /* ---------- Validasi ---------- */
  function setError(wrap, pesan) {
    wrap.classList.toggle('invalid', Boolean(pesan));
    wrap.querySelector('.err').textContent = pesan || '';
    return !pesan;
  }
  const wrapUmum = (id) => document.getElementById(id).closest('.field');

  function validasi() {
    const nama = document.getElementById('nama').value.trim();
    const wa = document.getElementById('wa').value.replace(/[\s\-().]/g, '');
    const email = document.getElementById('email').value.trim();
    const lokasi = document.getElementById('lokasi').value.trim();
    const n = parseInt(jumlah.value, 10);

    const cek = [
      setError(wrapUmum('nama'), nama.length < 3 ? 'Isi nama lengkap Anda.' : ''),
      setError(wrapUmum('wa'), !/^(\+?62|0)8\d{7,12}$/.test(wa) ? 'Nomor WhatsApp tidak valid. Contoh: 081234567890' : ''),
      setError(wrapUmum('email'), email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Format email tidak valid.' : ''),
      setError(wrapUmum('lokasi'), lokasi.length < 3 ? 'Isi lokasi pemasangan atau proyek.' : '')
    ];
    if (cfgJumlah) {
      cek.push(setError(wrapUmum('jumlah'), !(n >= cfgJumlah.min && n <= cfgJumlah.max) ? `Jumlah antara ${cfgJumlah.min} dan ${cfgJumlah.max}.` : ''));
    }
    fields.forEach((f) => {
      if (!f.wajib) return;
      const ada = baca(f).length > 0;
      const pesan = ada ? '' : f.tipe === 'checkbox' ? 'Pilih minimal satu.'
        : ['radio', 'select', 'swatch', 'template'].includes(f.tipe) ? 'Pilih salah satu.' : 'Kolom ini wajib diisi.';
      cek.push(setError(wrapper(f), pesan));
    });
    return cek.every(Boolean);
  }

  // hapus pesan error begitu pengguna memperbaiki
  const bersihkan = (e) => {
    const w = e.target.closest('.field');
    if (w && w.classList.contains('invalid')) {
      w.classList.remove('invalid');
      w.querySelector('.err').textContent = '';
    }
  };
  form.addEventListener('input', bersihkan);
  form.addEventListener('change', bersihkan);

  /* ---------- Bantu ---------- */
  function normalisasiWA(nomor) {
    let n = nomor.replace(/[^\d+]/g, '').replace('+', '');
    if (n.startsWith('0')) n = '62' + n.slice(1);
    return n;
  }
  function buatIdPesanan() {
    const d = new Date();
    const tgl = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    return `GS-${tgl}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  /* ---------- Kirim email (EmailJS) ---------- */
  async function kirimEmail(order) {
    if (!EMAIL_AKTIF) return 'demo';
    if (typeof emailjs === 'undefined') return 'gagal';
    try {
      emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
      const params = {
        order_id: order.id, produk: order.produk, sektor: order.sektor,
        jumlah: order.jumlahTeks, estimasi: order.estimasi, detail: order.detailTeks,
        nama: order.nama, whatsapp: order.whatsapp, email: order.email || '-',
        instansi: order.instansi || '-', lokasi: order.lokasi,
        tanggal: order.tanggal || '-', catatan: order.catatan || '-', waktu: order.waktu
      };
      const kirim = emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, params);
      const batas = new Promise((_, tolak) => setTimeout(() => tolak(new Error('timeout')), 12000));
      await Promise.race([kirim, batas]);
      return 'terkirim';
    } catch (err) {
      console.error('EmailJS gagal:', err);
      return 'gagal';
    }
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formError.textContent = '';
    if (document.getElementById('website').value) return; // jebakan bot

    if (!validasi()) {
      formError.textContent = 'Beberapa kolom perlu diperbaiki. Cek pesan merah di formulir.';
      const salah = form.querySelector('.field.invalid');
      if (salah) {
        salah.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const el = salah.querySelector('input, select, textarea');
        if (el) el.focus({ preventScroll: true });
      }
      return;
    }

    const { n, total } = hitung();
    const detail = fields
      .map((f) => ({ label: f.label, nilai: baca(f).map((x) => x.label).join(', ') }))
      .filter((d) => d.nilai);

    const order = {
      id: buatIdPesanan(),
      waktu: new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
      kode: produk.kode, produk: produk.nama, sektor: sektor.nama,
      jumlah: n, satuan: unit, jumlahTeks: `${n} ${unit}`,
      estimasi: formatRupiah(total),
      detail, detailTeks: detail.map((d) => `${d.label}: ${d.nilai}`).join('\n') || '-',
      nama: document.getElementById('nama').value.trim(),
      whatsapp: normalisasiWA(document.getElementById('wa').value),
      email: document.getElementById('email').value.trim(),
      instansi: document.getElementById('instansi').value.trim(),
      lokasi: document.getElementById('lokasi').value.trim(),
      tanggal: tanggal.value,
      catatan: document.getElementById('catatan').value.trim()
    };

    submitBtn.disabled = true;
    submitText.textContent = 'Mengirim pesanan...';
    order.statusEmail = await kirimEmail(order);

    try { sessionStorage.setItem('gs-order', JSON.stringify(order)); }
    catch (err) { console.error('Gagal menyimpan pesanan di browser:', err); }
    window.location.href = 'sukses.html';
  });

  hitung();
})();