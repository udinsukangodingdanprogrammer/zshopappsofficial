# ZSHOPAPPS Preflix Lifetime — GitHub Pages

Versi ini sudah diperbaiki untuk deployment statis GitHub Pages dan memakai struktur path yang case-sensitive (`assets/...`) agar gambar, audio, QRIS, dan aset Preflix dapat dimuat di server Linux/GitHub.

## Perbaikan utama

- Ketiga paket **Alight Motion Pro** sekarang memakai stok **Unlimited** tanpa batas jumlah berbasis stok pada kartu, keranjang, dan checkout.
- Keranjang lama yang masih menyimpan batas 993/434/722 dimigrasikan otomatis menjadi unlimited saat halaman dibuka.
- SEO Alight Motion diperkuat melalui title, meta description, Open Graph, Twitter Card, H1, alt text, copy produk, dan Product JSON-LD dengan tiga offer IDR yang sesuai tampilan.
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
- `assets/css/` — stylesheet inti dan override terurut.
- `assets/js/` — JavaScript per fitur untuk memudahkan maintenance.
- `assets/images/` — seluruh gambar utama, QRIS, testimoni, dan gambar Preflix.
- `assets/images/portal-lifetime/` — fallback aset Preflix.
- `assets/audio/` — file audio.
- `assets/files/` — file tambahan.
- `.github/workflows/static.yml` — workflow GitHub Pages.
- `.nojekyll` — mencegah pemrosesan Jekyll yang tidak diperlukan.
- `asset-manifest.json` — daftar aset dan checksum.

## Update Alight Motion unlimited + SEO (2026-08-14)

- Semua pilihan paket Alight Motion menampilkan **Stok Unlimited** dan **Tanpa batas stok**.
- Tombol tambah jumlah tidak lagi berhenti di angka stok lama; nilai minimum tetap 1 dan input dijaga dalam rentang bilangan aman JavaScript.
- Status unlimited dibawa ke ringkasan keranjang, pesan checkout, dan pembayaran QRIS.
- Nama pencarian **Alight Motion Pro** dipakai secara natural pada metadata dan konten, sedangkan nama brand schema memakai nama resmi **Alight Motion**.
- Product JSON-LD mencantumkan tiga paket, harga IDR yang terlihat, serta status `InStock`; tidak ada rating, ulasan, atau klaim yang dibuat-buat.

## Deploy GitHub Pages

1. Upload **seluruh isi ZIP** ke root repository GitHub, termasuk folder `assets`, `.github`, `.nojekyll`, dan `index.html`.
2. Push ke branch `main`.
3. Workflow `.github/workflows/static.yml` akan men-deploy konten statis ke GitHub Pages.
4. Jika memilih metode `Deploy from a branch`, gunakan branch `main` dan folder `/ (root)`.

Jangan hanya upload `index.html`; folder `assets` wajib ikut agar gambar Preflix, testimoni, QRIS, dan audio tidak blank.

## Batasan website statis

Batas maksimal satu lisensi portal ditegakkan pada UI/keranjang dan pencatatan browser. Validasi satu bisnis secara global lintas perangkat memerlukan backend/database atau verifikasi manual owner.

## Penghapusan video opening (2026-08-14)

- Dialog video opening, pemicu otomatis setelah loader, dan tombol putar ulang di header telah dihapus.
- Tombol **Done**, **Cancel**, ikon tutup, dan tombol Escape pada loader sekarang langsung membuka halaman utama.
- MP4 beserta poster khusus opening dan entri terkait di `asset-manifest.json` telah dihapus.
- `sitemap.xml` diperbarui dengan `lastmod` 2026-08-14.


## Update SEO + 2 Portal Extension (2026-08-09)

- Ditambahkan section **Portal Extension E-Gift**: Educational, Premium, dan Exclusift.
- Ditambahkan section **ZSHOPAPPS Card**: Premium, Premium+Pro, dan Premium+Pro+Phantom.
- 15 artwork extension dari user disalin byte-for-byte ke `assets/images/extensions/` dengan nama file aman untuk GitHub Pages.
- Semua extension memakai keranjang yang sama, QRIS, stok digital Unlimited, dua tombol Telegram resmi, dan tombol WhatsApp sebagai kanal tambahan.
- Harga yang tidak diberikan **tidak dibuat atau ditebak**. ZSHOPAPPS Card Premium hanya 1 bulan; Premium+Pro hanya 1/3 bulan; Phantom memakai 1/3/5 bulan sesuai artwork/harga yang diberikan.
- Testimoni 20 apps tidak diganti nama maupun gambar; hanya motion/zoom diperhalus.
- SEO diperbarui: title, description, canonical, Open Graph, Twitter Card, WebSite/OnlineStore/Product JSON-LD, `robots.txt`, dan `sitemap.xml`.
- Font tema extension menggunakan Bebas Neue + Orbitron melalui Google Fonts; tidak ada file font yang disertakan di assets.

### Catatan canonical SEO
Canonical, Open Graph URL, sitemap, dan JSON-LD sekarang memakai `https://lanprogrammer.github.io/` agar sesuai dengan deployment GitHub Pages yang tampil pada browser. Jika production dipindahkan ke custom domain, ganti URL tersebut secara konsisten di `index.html`, `robots.txt`, dan `sitemap.xml` sebelum meminta indexing.

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


## Fix video sound + loader + asset/SEO (2026-08-10)

- Video opening MP4 diverifikasi memiliki track audio AAC stereo. Alur opening diubah agar first-load tidak lagi otomatis jatuh ke mode muted; tombol **Mulai + suara** melakukan `video.play()` langsung dari user gesture.
- Klik **Done** pada loader mencoba membuka opening dan memulai video bersuara pada gesture yang sama, lalu tetap tersedia fallback tombol **Mulai + suara** jika browser memerlukan interaksi ulang.
- Versi loader 2026-08-10 kemudian diperbarui lagi pada 2026-08-12 menjadi **ZSHOPAPPS Premium** dan **Loading apps premium zshopappsofficialdigital**.
- Pseudo-element lingkaran besar pada kartu **ZSHOPAPPS Preflix Lifetime** dinonaktifkan karena informasi 1 lisensi sudah ada pada badge utama.
- Canonical, Open Graph, Twitter Card, JSON-LD, robots, dan sitemap diselaraskan dengan `https://lanprogrammer.github.io/`.
- Web app manifest ditautkan dari `<head>`; `start_url`, `scope`, dan path ikon diperbaiki agar mengarah ke root site, bukan `assets/files/`.
- `asset-manifest.json` dibuat ulang setelah semua perubahan dan seluruh referensi aset lokal diperiksa.

## Update katalog, branding, panduan & SEO (2026-08-12)

- Handle profil diperbarui menjadi **zshopappsofficialdigital**.
- Copy **Exclusive Digital Store** diubah menjadi **Ekslusif Digital Store** sesuai permintaan.
- Loader dipadatkan menjadi **ZSHOPAPPS Premium** dengan teks **Loading apps premium zshopappsofficialdigital**.
- Opening diberi label **VideoOpening ZSHOPAPPSDIGITAL** dan copy lama bertema harga murah dihapus dari opening, hero, dan toolbar katalog.
- Kartu **Beli di toko kami / Murah meriah** di hero dihapus.
- Nama 20 aplikasi diseragamkan (ChatGPT Plus, Netflix VIP, CapCut Pro, Canva Pro, Alight Motion Pro, WeTV VIP, Loklok Premium, Viu VIP, HBO Max Ultimate, Prime Video VIP, Spotify Premium, Crunchyroll VIP, Apple Music VIP, Zoom Premium, Youku VIP, Bstation Premium, dan iQIYI VIP).
- Harga dan stok katalog diperbarui hanya berdasarkan data owner. Harga yang tidak diberikan tetap ditampilkan sebagai **Hubungi Owner**, tanpa membuat harga baru.
- Ditambahkan section **Kegunaan, cara pakai, jenis paket & peraturan** berisi Sharing, Private, Individual/Official, 20 panduan aplikasi, aturan penggunaan, cara order, dan rekomendasi paket.
- Link **Alternatif** diarahkan ke `https://linktr.ee/fanyyfanny84` melalui HTML dan CONFIG JavaScript.
- SEO diperbarui dengan title/meta description yang lebih deskriptif, Open Graph/Twitter copy baru, dan `sitemap.xml` lastmod 2026-08-12.
- JavaScript fitur, JSON-LD, dan JSON data paket sudah diperiksa ulang setelah perubahan.

## Update 2026-08-21 — 20 Apps + Unlimited Stock + Netlify

- Katalog utama tetap **20 aplikasi premium**, sesuai rentang pilihan 15–30 yang diminta.
- Seluruh **20 aplikasi utama** sekarang memakai status **Stok Unlimited / Tanpa batas stok** pada kartu, jumlah beli, keranjang, checkout, dan migrasi cart lama.
- **ZSHOPAPPS Preflix Lifetime tidak dibuat unlimited**: tetap maksimal 1 lisensi per transaksi/bisnis.
- Dua grup extension (`Portal Extension E-Gift` dan `ZSHOPAPPS Card`) sekarang memakai **stok digital Unlimited** dan tidak lagi dikunci maksimal 1 paket per tier.
- Tautan sosial diperbarui ke **X @IjuddinPro33035** dan **Instagram @tokodigitalpremiumzshopapps**.
- SEO halaman utama diperluas dari fokus satu aplikasi menjadi **20 aplikasi premium + Preflix Lifetime + extension**.
- Ditambahkan `netlify.toml`, sehingga ZIP ini siap diunggah sebagai situs statis ke Netlify.
- Catatan: status Unlimited hanya menghapus pembatas counter di website; aktivasi, lisensi, hak akses, dan ketentuan provider tetap harus diverifikasi owner.


## 2026-08-29 — Extension 06 Naruto Commerce Upgrade
- Added Akatsuki / Naruto themed Extension 06 package section with 5 packages.
- Updated Preflix Lifetime price from Rp309.000 to Rp300.000.
- Added global language and estimated foreign-currency selectors.
- Added image zoom, secret gift codes, and responsive UI refinements.
- Removed glass/translucent framing from the iOS/MacBook purchase table area.


## 2026-08-29 — Preflix Testimoni Cuan Update
- Removed foreign currency display controls from the language panel and restored a language-only interface.
- Added ZSHOPAPPS Preflix real testimonial / cuan gallery using customer-supplied cash photos.
- Added boxed testimonial labels, sales copy, and customer-facing wise quote.
- Preserved official pricing at Rp300.000 for Preflix Lifetime.

## 2026-08-29 — Preflix Registration / Product #21 Update
- Catalog now presents 21 total products: 20 premium apps + ZSHOPAPPS Preflix Lifetime as product #21.
- Added a visible 9-step Preflix registration guide on the storefront.
- Preflix cart registration captures buyer/owner name, business name, Telegram display name, Telegram username, business type, Telegram purpose, and account-ownership confirmation.
- Preflix QRIS action now routes through the cart registration flow before payment.
- Telegram checkout message includes the registration profile and generated t.me link.
- Telegram password, OTP, login code, and recovery password are explicitly not requested.

## 2026-08-31 — Code Structure Cleanup

- CSS inline dipindahkan ke dua bundle terurut: `assets/css/zshopapps-core.css` dan `assets/css/zshopapps-overrides.css`.
- JavaScript executable inline dipisahkan menjadi file per fitur di `assets/js/`, tetapi tetap dimuat pada posisi DOM yang sama untuk menjaga perilaku.
- JSON-LD dan data playlist `application/json` tetap inline karena merupakan data dokumen, bukan kode executable.
- Urutan CSS sebelum/sesudah Tailwind browser runtime dipertahankan agar cascade visual tidak berubah.
- URL gambar di CSS disesuaikan setelah stylesheet dipindahkan ke `assets/css/`.
- Ditambahkan `CODE-MAINTENANCE.md` sebagai panduan maintenance developer.
- Pemeriksaan syntax JavaScript, parser CSS, dan referensi aset lokal dilakukan sebelum paket ZIP dibuat ulang.
