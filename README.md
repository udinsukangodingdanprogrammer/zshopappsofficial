# ZSHOPAPPS Preflix Lifetime — GitHub Pages

Versi ini sudah diperbaiki untuk deployment statis GitHub Pages dan memakai struktur path yang case-sensitive (`assets/...`) agar gambar, audio, video, QRIS, dan aset Preflix dapat dimuat di server Linux/GitHub.

## Perbaikan utama

- Nama portal diseragamkan menjadi **ZSHOPAPPS Preflix Lifetime**.
- Produk portal tetap menjadi produk ke-21: 20 aplikasi + 1 Preflix Lifetime.
- Jumlah pembelian Preflix Lifetime dikunci **minimal 1 dan maksimal 1 lisensi per transaksi**.
- Preflix Lifetime dapat ditambahkan ke keranjang gabungan.
- Pembayaran portal memakai **QRIS**, lalu order/bukti pembayaran dapat diarahkan ke dua Telegram resmi: **@ZShopAppsJualanAplikasiOriginal** atau **@Seller4899**.
- Tombol WhatsApp dinonaktifkan bila keranjang berisi Preflix Lifetime; pembeli memilih **Telegram 1** atau **Telegram 2** sebagai kanal checkout portal.
- Gambar Preflix diperbaiki untuk GitHub Pages dengan path `assets/images/...` dan fallback `assets/images/portal-lifetime/...`.
- 20 kartu testimoni aplikasi dipertahankan nama dan gambar aslinya, lalu ditambahkan animasi masuk dan efek zoom/hover yang lebih halus.
- Galeri Preflix mendapat efek zoom, focus state, dan transisi yang tetap menghormati `prefers-reduced-motion`.
- Layout mobile diperiksa agar tidak menimbulkan horizontal overflow.
- `asset-manifest.json` dibuat ulang sebagai JSON valid dengan SHA-256 setiap file.

## Struktur deploy

- `index.html` — halaman utama.
- `assets/images/` — seluruh gambar utama, QRIS, testimoni, dan gambar Preflix.
- `assets/images/portal-lifetime/` — fallback aset Preflix.
- `assets/audio/` — file audio.
- `assets/video/` — video opening.
- `assets/files/` — file tambahan.
- `.github/workflows/static.yml` — workflow GitHub Pages.
- `.nojekyll` — mencegah pemrosesan Jekyll yang tidak diperlukan.
- `asset-manifest.json` — daftar aset dan checksum.

## Deploy GitHub Pages

1. Upload **seluruh isi ZIP** ke root repository GitHub, termasuk folder `assets`, `.github`, `.nojekyll`, dan `index.html`.
2. Push ke branch `main`.
3. Workflow `.github/workflows/static.yml` akan men-deploy konten statis ke GitHub Pages.
4. Jika memilih metode `Deploy from a branch`, gunakan branch `main` dan folder `/ (root)`.

Jangan hanya upload `index.html`; folder `assets` wajib ikut agar gambar Preflix, testimoni, QRIS, audio, dan video tidak blank.

## Batasan website statis

Batas maksimal satu lisensi portal ditegakkan pada UI/keranjang dan pencatatan browser. Validasi satu bisnis secara global lintas perangkat memerlukan backend/database atau verifikasi manual owner.


## Update SEO + 2 Portal Extension (2026-08-09)

- Ditambahkan section **Portal Extension E-Gift**: Educational, Premium, dan Exclusift.
- Ditambahkan section **ZSHOPAPPS Card**: Premium, Premium+Pro, dan Premium+Pro+Phantom.
- 15 artwork extension dari user disalin byte-for-byte ke `assets/images/extensions/` dengan nama file aman untuk GitHub Pages.
- Semua extension memakai keranjang yang sama, QRIS, maksimal 1 paket per tier, dua tombol Telegram resmi, dan tombol WhatsApp sebagai kanal tambahan.
- Harga yang tidak diberikan **tidak dibuat atau ditebak**. ZSHOPAPPS Card Premium hanya 1 bulan; Premium+Pro hanya 1/3 bulan; Phantom memakai 1/3/5 bulan sesuai artwork/harga yang diberikan.
- Testimoni 20 apps tidak diganti nama maupun gambar; hanya motion/zoom diperhalus.
- SEO diperbarui: title, description, canonical, Open Graph, Twitter Card, WebSite/OnlineStore/Product JSON-LD, `robots.txt`, dan `sitemap.xml`.
- Font tema extension menggunakan Bebas Neue + Orbitron melalui Google Fonts; tidak ada file font yang disertakan di assets.

### Catatan canonical SEO
Canonical, Open Graph URL, sitemap, dan JSON-LD memakai `https://zshopappsportal.id/` karena domain tersebut tampil pada artwork yang diberikan. Jika production akhirnya memakai domain lain, ganti URL tersebut di `index.html`, `robots.txt`, dan `sitemap.xml` sebelum meminta indexing.

## Update dua kanal Telegram pembayaran (2026-08-09)

Seluruh alur checkout 20 aplikasi, ZSHOPAPPS Preflix Lifetime, ZSHOPAPPS Card Redeem/Portal Extension, dan ZSHOPAPPS Card menyediakan dua kanal Telegram setelah QRIS:

- Telegram 1: `https://t.me/ZShopAppsJualanAplikasiOriginal`
- Telegram 2: `https://t.me/Seller4899`

Pesan checkout dan pesan “sudah bayar” memakai parameter `?text=` agar detail pesanan dapat terisi pada chat Telegram. Modal selesai transaksi juga menyimpan kedua tautan sehingga pembeli dapat membuka kembali Telegram 1 atau Telegram 2.

## Update menu 2026-08-09
- Menambahkan menu **Gift Card ZSHOPAPPS Card** → `#extension-egift`.
- Menambahkan menu **ZSHOPAPPS Card** → `#zshopapps-card`.
- Label desktop navigation diselaraskan dengan menu mobile.

## Rename ZSHOPAPPS Card + SEO (2026-08-09)

- Nama extension kedua di menu, section, pembelian, keranjang, checkout, FAQ, structured data, dan dokumentasi diseragamkan menjadi **ZSHOPAPPS Card**.
- Anchor section diperbarui menjadi `#zshopapps-card` agar label navigasi dan URL fragment konsisten.
- Enam artwork terkait hanya **diganti nama file**, tanpa mengubah byte gambar, ke prefix `zshopapps-card-*` untuk path asset yang lebih deskriptif.
- Title, meta description, Open Graph, Twitter Card, alt text, dan Product JSON-LD diperbarui agar menyebut ZSHOPAPPS Card secara konsisten.

## Koreksi CARD + SEO ChatGPT Pro (2026-08-09)

- Typo tampilan **CART + QRIS** diperbaiki menjadi **CARD + QRIS** pada section ZSHOPAPPS Card.
- Istilah teknis `cart` pada CSS/JavaScript tetap dipertahankan karena merupakan identifier keranjang dan tidak boleh diganti menjadi `card`.
- Teks publik yang masih memakai `cart/QRIS` diubah menjadi **keranjang/QRIS** agar tidak membingungkan mesin pencari maupun pengunjung.
- Title, meta description, Open Graph, dan Twitter Card diperbarui agar menonjolkan **ZSHOPAPPS Card**, **ChatGPT Pro**, **Codex Pro**, dan **QRIS** secara natural.
- Copy section ZSHOPAPPS Card diperjelas agar konteks ChatGPT Pro/Phantom tersedia sebagai teks HTML yang dapat dirayapi mesin pencari.
