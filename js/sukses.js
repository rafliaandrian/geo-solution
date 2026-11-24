/* =========================================================
   GEO SOLUTION – sukses.js
   Menampilkan ringkasan pesanan yang disimpan order.js,
   status pengiriman email, dan tombol lanjut ke WhatsApp.
   Wajib dimuat SETELAH config.js, produk.js, dan main.js
   ========================================================= */

(function () {
    const kartu = document.getElementById('sukses');
    const kosong = document.getElementById('kosong');

    // ambil pesanan terakhir
    let order = null;
    try {
        order = JSON.parse(sessionStorage.getItem('gs-order'));
    } catch (e) { }

    if (!order || !order.id) {
        kosong.hidden = false;
        return;
    }

    // data dari pelanggan harus di-escape sebelum masuk ke HTML
    const aman = (teks) =>
        String(teks ?? '').replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));

    document.title = `Pesanan ${order.id} | ${CONFIG.namaBrand}`;

    /* ---------- Ringkasan ---------- */
    const baris = [
        ['Produk', `${order.produk} (${order.sektor})`],
        `Jumlah: ${order.jumlahTeks || order.jumlah}\n` +
        `Detail:\n${order.detailTeks || '-'}\n` +
        `Estimasi: ${order.estimasi}\n` +
        ['Nama', order.nama],
        ['WhatsApp', '+' + order.whatsapp],
        ['Email', order.email || '-'],
        ['Instansi / usaha', order.instansi || '-'],
        ['Lokasi', order.lokasi],
        ['Target selesai', order.tanggal ? new Date(order.tanggal).toLocaleDateString('id-ID', { dateStyle: 'long' }) : '-'],
        ['Catatan', order.catatan || '-'],
        ['Waktu pesan', order.waktu]
    ];

    const recap = baris
        .map(([k, v]) => `<div><dt>${aman(k)}</dt><dd>${aman(v)}</dd></div>`)
        .join('');

    /* ---------- Status pengiriman ---------- */
    const status = [];

    if (order.statusEmail === 'terkirim') {
        status.push('<li class="ok"><i class="fa-solid fa-circle-check"></i><span>Pesanan sudah terkirim ke email tim kami.</span></li>');
    } else if (order.statusEmail === 'gagal') {
        status.push('<li class="warn"><i class="fa-solid fa-triangle-exclamation"></i><span>Pesanan belum berhasil dikirim lewat email. Mohon lanjutkan lewat WhatsApp agar tim kami menerimanya.</span></li>');
    } else {
        status.push('<li class="warn"><i class="fa-solid fa-flask"></i><span>Mode demo: pengiriman email belum diaktifkan, jadi pesanan ini belum masuk ke tim.</span></li>');
    }

    if (WA_AKTIF) {
        status.push('<li class="ok"><i class="fa-brands fa-whatsapp"></i><span>Untuk konfirmasi lebih cepat, kirim ringkasan pesanan lewat WhatsApp.</span></li>');
    } else {
        status.push('<li class="warn"><i class="fa-brands fa-whatsapp"></i><span>Nomor WhatsApp tim belum diatur, jadi tombol WhatsApp belum aktif.</span></li>');
    }

    /* ---------- Tombol WhatsApp ---------- */
    let tombolWA = '';
    if (WA_AKTIF) {
        const teks =
            `Halo ${CONFIG.namaBrand}, saya baru mengirim pesanan.\n\n` +
            `No. pesanan: ${order.id}\n` +
            `Produk: ${order.produk} (${order.sektor})\n` +
            `Jumlah: ${order.jumlah} ${order.satuan}\n` +
            `Estimasi: ${order.estimasi}\n` +
            `Nama: ${order.nama}\n` +
            `Instansi: ${order.instansi || '-'}\n` +
            `Lokasi: ${order.lokasi}\n` +
            `Catatan: ${order.catatan || '-'}\n\n` +
            `Mohon konfirmasinya. Terima kasih.`;
        const url = `https://wa.me/${CONFIG.waNumber}?text=${encodeURIComponent(teks)}`;
        tombolWA = `<a href="${url}" class="btn btn-wa" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> Lanjutkan via WhatsApp</a>`;
    }

    /* ---------- Judul sesuai status ---------- */
    const berhasil = order.statusEmail === 'terkirim';
    const judul = berhasil ? 'Terima kasih, pesanan Anda sudah kami terima' : 'Pesanan Anda sudah tercatat';
    const subjudul = berhasil
        ? 'Tim kami akan meninjau kebutuhan Anda dan menghubungi lewat WhatsApp untuk konfirmasi harga dan jadwal.'
        : 'Simpan nomor pesanan di bawah ini. Pastikan pesanan sampai ke tim kami dengan langkah yang tertera.';

    kartu.innerHTML = `
    <div class="success-icon"><i class="fa-solid fa-check"></i></div>
    <h2>${judul}</h2>
    <p>${subjudul}</p>
    <span class="order-id">No. pesanan: ${aman(order.id)}</span>
    <dl class="recap">${recap}</dl>
    <ul class="status-list">${status.join('')}</ul>
    <div class="success-actions">
      ${tombolWA}
      <a href="index.html" class="btn btn-navy" id="pesanLagi"><i class="fa-solid fa-plus"></i> Pesan produk lain</a>
    </div>`;

    kartu.hidden = false;

    // "Pesan produk lain" membersihkan pesanan tersimpan
    document.getElementById('pesanLagi').addEventListener('click', () => {
        try { sessionStorage.removeItem('gs-order'); } catch (e) { }
    });
})();