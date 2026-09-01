(()=>{
  'use strict';
  const $=(s,p=document)=>p.querySelector(s);
  const $$=(s,p=document)=>Array.from(p.querySelectorAll(s));
  const STORAGE_LANG='zshopapps_global_lang_v1';
  const STORAGE_CUR='zshopapps_global_currency_v1';
  const STORAGE_FX='zshopapps_fx_cache_v1';
  const fallbackRates={IDR:1,USD:0.000061,SGD:0.000078,MYR:0.000286,EUR:0.000056,JPY:0.0091,THB:0.00239,AUD:0.000094,GBP:0.000048};
  const currencyNames={IDR:'IDR',USD:'USD',SGD:'SGD',MYR:'MYR',EUR:'EUR',JPY:'JPY',THB:'THB',AUD:'AUD',GBP:'GBP'};
  const i18n={
    id:{'menu.catalog':'Katalog [21]','menu.preflix':'Preflix','menu.gift':'Gift Card','menu.card':'ZSHOPAPPS Card','menu.gacor':'ZSHOPAPPSGACOR','menu.supermanis':'SUPER MANIS','menu.akatsuki':'Akatsuki Extension','menu.qris':'QRIS','menu.testimoni':'Testimoni','menu.buy':'Cara Beli','menu.faq':'FAQ','menu.contact':'Kontak','menu.preflixDrawer':'◆ Portal Lifetime','menu.giftDrawer':'🎁 Gift Card ZSHOPAPPS Card','menu.cardDrawer':'💳 ZSHOPAPPS Card','menu.gacorDrawer':'🔥 ZSHOPAPPSGACOR','menu.supermanisDrawer':'💖 Extension 05 SuperManis','menu.akatsukiDrawer':'🦊 Akatsuki Extension','menu.qrisDrawer':'▣ Bayar QRIS','menu.testimoniDrawer':'◉ Testimoni','menu.buyDrawer':'▣ Cara Beli','menu.rulesDrawer':'📘 Kegunaan & Peraturan','tools.kicker':'Kontrol bahasa website','tools.title':'Pilih bahasa website dengan cepat. 🌐','tools.lead':'Semua harga resmi ZSHOPAPPS tetap ditampilkan dalam rupiah Indonesia. Fitur kurs mata uang luar negeri dihapus agar tampilan lebih fokus, rapi, dan jelas.','tools.language':'Bahasa website','tools.currency':'Mata uang','tools.note':'💡 Pembayaran dan harga resmi tetap IDR. Tampilan ini fokus pada pilihan bahasa website.','e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto siap masuk keranjang, QRIS/SeaBank, dan Telegram owner. 🛒⚡','e06.lead':'Pilih paket Boruto, Super Boruto, Orochimaru, Super Orochimaru, atau Sasuke. Semua nominal aktif di keranjang gabungan, bisa dibayar lewat QRIS atau transfer SeaBank, lalu dikonfirmasi ke owner. Tampilan dibuat nyaman untuk Android, iPhone, iPad, MacBook, laptop, dan desktop.','e06.badge1':'🎯 Harga jelas & siap checkout','e06.badge2':'🧾 Harga resmi IDR','e06.badge3':'🔍 Gambar utama bisa di-zoom','e06.ctaQris':'Lihat QRIS Utama','e06.ctaCart':'Buka Keranjang','e06.zoomMain':'🔎 Tap / klik untuk zoom poster utama','e06.zoomPackages':'📦 Zoom daftar paket dan cara beli','e06.zoomPreflix':'💼 Zoom contoh tampilan utama website','e06.about1Title':'Paket reguler & super','e06.about1Text':'Versi reguler cocok untuk kebutuhan inti. Versi Super memberi akses fitur premium yang lebih lengkap sesuai alur owner.','e06.about2Title':'Kegunaan utama','e06.about2Text':'Extension 06 membantu katalog ZSHOPAPPS tampil lebih menarik, lebih mudah dipilih, dan lebih cepat diarahkan ke pembelian.','e06.about3Title':'Responsif semua device','e06.about3Text':'Layout dan tombol dibuat tetap rapi pada Android, iOS, MacBook, laptop, tablet, dan desktop tanpa overflow horizontal.','e06.useTitle':'Tentang kegunaan Extension 06','e06.useText':'Extension 06 dipakai sebagai katalog tambahan bertema Akatsuki/Naruto untuk mempermudah calon pembeli memilih paket, melihat harga aktif, menambahkan paket ke keranjang, lalu diarahkan ke pembayaran QRIS atau SeaBank dan verifikasi owner.','e06.useButton':'Bayar via QRIS / SeaBank','e06.secretTitle':'🎁 Hadiah kode rahasia Extension 06','e06.secretText':'Klik tombol di bawah untuk menampilkan hadiah kode rahasia yang diminta. Kode dapat disalin langsung dari website.','e06.secretButton':'Tampilkan kode rahasia','e06.qnaTitle':'Q&A singkat','e06.q1q':'Apa beda paket reguler dan Super?','e06.q1a':'Versi Super ditujukan untuk fitur premium yang lebih lengkap. Versi reguler fokus pada akses inti sesuai nama paket.','e06.q2q':'Apakah pembayaran QRIS tetap rupiah?','e06.q2a':'Ya. Semua transaksi QRIS, total keranjang, dan harga resmi ditampilkan dalam IDR.','e06.q3q':'Bagaimana cara zoom gambar?','e06.q3a':'Tekan gambar utama atau kartu preview. Modal zoom akan terbuka, lalu tutup dengan klik backdrop atau tombol Escape.','e06.q4q':'Apakah bisa dipakai di Android, iOS, MacBook, dan PC?','e06.q4a':'Bisa. Layout sudah dioptimalkan untuk Android, iPhone, iPad, MacBook, laptop Windows, dan desktop.'},
    en:{'menu.catalog':'Catalog [21]','menu.preflix':'Preflix','menu.gift':'Gift Card','menu.card':'ZSHOPAPPS Card','menu.gacor':'ZSHOPAPPSGACOR','menu.supermanis':'SUPER MANIS','menu.akatsuki':'Akatsuki Extension','menu.qris':'QRIS','menu.testimoni':'Testimonials','menu.buy':'How to Buy','menu.faq':'FAQ','menu.contact':'Contact','menu.preflixDrawer':'◆ Lifetime Portal','menu.giftDrawer':'🎁 Gift Card ZSHOPAPPS Card','menu.cardDrawer':'💳 ZSHOPAPPS Card','menu.gacorDrawer':'🔥 ZSHOPAPPSGACOR','menu.supermanisDrawer':'💖 Extension 05 SuperManis','menu.akatsukiDrawer':'🦊 Akatsuki Extension','menu.qrisDrawer':'▣ Pay with QRIS','menu.testimoniDrawer':'◉ Testimonials','menu.buyDrawer':'▣ How to Buy','menu.rulesDrawer':'📘 Usage & Rules','tools.kicker':'Website language controls','tools.title':'Set the website language instantly. 🌐','tools.lead':'All official ZSHOPAPPS prices remain in Indonesian rupiah. The foreign exchange display feature has been removed for a cleaner and clearer interface.','tools.language':'Website language','tools.currency':'Currency','tools.note':'💡 Official prices and payments remain in IDR. This panel now focuses on website language only.','e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto is ready for cart, QRIS, and Telegram owner checkout. 🛒⚡','e06.lead':'Choose Boruto, Super Boruto, Orochimaru, Super Orochimaru, or Sasuke. Every price is active in the combined cart, payable via official QRIS, then confirmed to the owner. The layout is tuned for Android, iPhone, iPad, MacBook, laptop, and desktop.','e06.badge1':'🎯 Clear price & checkout ready','e06.badge2':'🧾 Official IDR pricing','e06.badge3':'🔍 Main images can be zoomed','e06.ctaQris':'View Main QRIS','e06.ctaCart':'Open Cart','e06.zoomMain':'🔎 Tap / click to zoom the main poster','e06.zoomPackages':'📦 Zoom package list and buying guide','e06.zoomPreflix':'💼 Zoom updated website main view','e06.about1Title':'Regular & Super packages','e06.about1Text':'The regular version covers essential needs. The Super version is aimed at broader premium features based on the owner flow.','e06.about2Title':'Main use','e06.about2Text':'Extension 06 helps ZSHOPAPPS look more attractive, easier to browse, and faster to convert into purchases.','e06.about3Title':'Responsive on every device','e06.about3Text':'The layout and buttons stay clean on Android, iOS, MacBook, laptops, tablets, and desktops without horizontal overflow.','e06.useTitle':'About the use of Extension 06','e06.useText':'Extension 06 acts as an Akatsuki/Naruto-themed catalog so buyers can choose a package, view active pricing, add it to the cart, then continue to QRIS payment and owner verification.','e06.useButton':'Pay via official QRIS','e06.secretTitle':'🎁 Secret gift codes for Extension 06','e06.secretText':'Click the button below to reveal the requested secret codes. The codes can be copied directly from the website.','e06.secretButton':'Show secret codes','e06.qnaTitle':'Quick Q&A','e06.q1q':'What is the difference between regular and Super packages?','e06.q1a':'The Super version is intended for a broader premium feature set. The regular version focuses on the core access of the package.','e06.q2q':'Does QRIS payment stay in rupiah?','e06.q2a':'Yes. All QRIS transactions, cart totals, and official prices are displayed only in IDR.','e06.q3q':'How do I zoom the images?','e06.q3a':'Press the main image or preview card. A zoom modal opens and can be closed by clicking the backdrop or pressing Escape.','e06.q4q':'Can it be used on Android, iOS, MacBook, and PC?','e06.q4a':'Yes. The layout is optimized for Android phones, iPhones, iPads, MacBooks, Windows laptops, and desktops.'},
    ms:{'menu.catalog':'Katalog [21]','menu.preflix':'Preflix','menu.gift':'Kad Hadiah','menu.card':'Kad ZSHOPAPPS','menu.gacor':'ZSHOPAPPSGACOR','menu.supermanis':'SUPER MANIS','menu.akatsuki':'Ekstensi Akatsuki','menu.qris':'QRIS','menu.testimoni':'Testimoni','menu.buy':'Cara Beli','menu.faq':'FAQ','menu.contact':'Hubungi','menu.preflixDrawer':'◆ Portal Seumur Hidup','menu.giftDrawer':'🎁 Kad Hadiah ZSHOPAPPS Card','menu.cardDrawer':'💳 Kad ZSHOPAPPS','menu.gacorDrawer':'🔥 ZSHOPAPPSGACOR','menu.supermanisDrawer':'💖 Extension 05 SuperManis','menu.akatsukiDrawer':'🦊 Ekstensi Akatsuki','menu.qrisDrawer':'▣ Bayar dengan QRIS','menu.testimoniDrawer':'◉ Testimoni','menu.buyDrawer':'▣ Cara Beli','menu.rulesDrawer':'📘 Kegunaan & Peraturan','tools.kicker':'Kawalan bahasa laman web','tools.title':'Tetapkan bahasa laman web dengan cepat. 🌐','tools.lead':'Semua harga rasmi ZSHOPAPPS kekal dalam rupiah Indonesia. Paparan kadar mata wang luar negara telah dibuang untuk antaramuka yang lebih kemas dan jelas.','tools.language':'Bahasa laman web','tools.currency':'Mata wang','tools.note':'💡 Harga dan pembayaran rasmi kekal dalam IDR. Panel ini kini fokus pada pilihan bahasa laman web sahaja.'},
    ja:{'menu.catalog':'カタログ [21]','menu.preflix':'Preflix','menu.gift':'ギフトカード','menu.card':'ZSHOPAPPS Card','menu.gacor':'ZSHOPAPPSGACOR','menu.supermanis':'SUPER MANIS','menu.akatsuki':'暁エクステンション','menu.qris':'QRIS','menu.testimoni':'レビュー','menu.buy':'購入方法','menu.faq':'FAQ','menu.contact':'連絡先','tools.kicker':'サイト言語コントロール','tools.title':'サイト言語をすばやく設定します。 🌐','tools.lead':'ZSHOPAPPSの公式価格はすべてインドネシアルピア表示です。海外通貨の表示機能は、より見やすい画面のため削除されました。','tools.language':'サイト言語','tools.currency':'通貨','tools.note':'💡 公式価格と支払いはIDRのままです。このパネルはサイト言語の切替に集中しています。'},
    zh:{'menu.catalog':'目录 [21]','menu.preflix':'Preflix','menu.gift':'礼品卡','menu.card':'ZSHOPAPPS Card','menu.gacor':'ZSHOPAPPSGACOR','menu.supermanis':'SUPER MANIS','menu.akatsuki':'晓组织扩展','menu.qris':'QRIS','menu.testimoni':'评价','menu.buy':'购买方式','menu.faq':'FAQ','menu.contact':'联系','tools.kicker':'网站语言控制','tools.title':'快速设置网站语言。 🌐','tools.lead':'ZSHOPAPPS 的所有官方价格始终使用印尼盾显示。外币汇率显示功能已移除，使界面更简洁清晰。','tools.language':'网站语言','tools.currency':'货币','tools.note':'💡 官方价格和付款保持为 IDR。此面板现在只专注于网站语言选择。'},
    ko:{'menu.catalog':'카탈로그 [21]','menu.preflix':'Preflix','menu.gift':'기프트 카드','menu.card':'ZSHOPAPPS Card','menu.gacor':'ZSHOPAPPSGACOR','menu.supermanis':'SUPER MANIS','menu.akatsuki':'아카츠키 익스텐션','menu.qris':'QRIS','menu.testimoni':'후기','menu.buy':'구매 방법','menu.faq':'FAQ','menu.contact':'문의','tools.kicker':'웹사이트 언어 설정','tools.title':'웹사이트 언어를 빠르게 설정합니다. 🌐','tools.lead':'모든 ZSHOPAPPS 공식 가격은 인도네시아 루피아로만 표시됩니다. 외화 환율 표시 기능은 더 깔끔하고 명확한 화면을 위해 제거되었습니다.','tools.language':'웹사이트 언어','tools.currency':'통화','tools.note':'💡 공식 가격과 결제는 IDR로 유지됩니다. 이 패널은 이제 웹사이트 언어 선택에만 집중합니다.'},
    ar:{'menu.catalog':'الكتالوج [21]','menu.preflix':'Preflix','menu.gift':'بطاقة هدية','menu.card':'بطاقة ZSHOPAPPS','menu.gacor':'ZSHOPAPPSGACOR','menu.supermanis':'SUPER MANIS','menu.akatsuki':'إضافة أكاتسوكي','menu.qris':'QRIS','menu.testimoni':'آراء العملاء','menu.buy':'طريقة الشراء','menu.faq':'الأسئلة الشائعة','menu.contact':'اتصل','tools.kicker':'عناصر التحكم في لغة الموقع','tools.title':'اضبط لغة الموقع بسرعة. 🌐','tools.lead':'جميع أسعار ZSHOPAPPS الرسمية تبقى بالروبية الإندونيسية. تمت إزالة عرض سعر الصرف الأجنبي لجعل الواجهة أوضح وأنظف.','tools.language':'لغة الموقع','tools.currency':'العملة','tools.note':'💡 الأسعار والمدفوعات الرسمية تبقى بـ IDR. هذه اللوحة تركز الآن على اختيار لغة الموقع فقط.'},
    es:{'menu.catalog':'Catálogo [21]','menu.preflix':'Preflix','menu.gift':'Tarjeta regalo','menu.card':'ZSHOPAPPS Card','menu.gacor':'ZSHOPAPPSGACOR','menu.supermanis':'SUPER MANIS','menu.akatsuki':'Extensión Akatsuki','menu.qris':'QRIS','menu.testimoni':'Testimonios','menu.buy':'Cómo comprar','menu.faq':'FAQ','menu.contact':'Contacto','tools.kicker':'Controles de idioma del sitio','tools.title':'Configura el idioma del sitio al instante. 🌐','tools.lead':'Todos los precios oficiales de ZSHOPAPPS se muestran en rupias indonesias. La función de tipo de cambio extranjero fue eliminada para una interfaz más limpia y clara.','tools.language':'Idioma del sitio','tools.currency':'Moneda','tools.note':'💡 Los precios y pagos oficiales permanecen en IDR. Este panel ahora se enfoca solo en el idioma del sitio.'}
  };
  const extensionI18n={
    id:{
      'tools.kicker':'Kontrol bahasa Extension 01–06','tools.title':'Pilih bahasa untuk Extension 01–06. 🌐','tools.lead':'Terjemahan utama tersedia untuk Extension 01 sampai 06. Khusus Preflix (Extension 03), mata uang asing dapat dipilih sebagai estimasi tampilan.','tools.language':'Bahasa Extension','tools.note':'💡 Pilihan bahasa berlaku pada konten utama Extension 01–06. Pembayaran tetap IDR.',
      'e01.kicker':'ZSHOPAPPS PORTAL • EXTENSION 01 • E-GIFT','e01.title':'Portal Extension <span>Educational • Premium • Exclusift</span>','e01.lead':'Extension card ZSHOPAPPS Portal untuk menambah akses aplikasi premium berdasarkan tier. Semua paket memakai keranjang yang sama, dapat dibayar lewat QRIS atau transfer SeaBank, dan diverifikasi owner.',
      'e02.kicker':'ZSHOPAPPS PORTAL • EXTENSION 02 • ZSHOPAPPS CARD','e02.title':'ZSHOPAPPS Card <span>Premium • Premium+Pro • Phantom</span>','e02.lead':'ZSHOPAPPS Card tersedia dalam tier Premium, Premium+Pro, dan Premium+Pro+Phantom. Checkout memakai keranjang yang sama dan dapat dibayar melalui QRIS atau transfer SeaBank.',
      'e03.kicker':'ZSHOPAPPS PORTAL • EXTENSION 03 • PREFLIX','e03.title':'ZSHOPAPPS Preflix Lifetime, <span>portal jualan digital</span> dalam satu tampilan.','e03.lead':'UI mobile-friendly untuk menampilkan katalog layanan digital, menguatkan branding toko, dan mengarahkan calon pembeli langsung ke owner melalui Telegram.',
      'e04.kicker':'ZSHOPAPPS PORTAL • EXTENSION 04','e04.title':'PILIH PAKET <span>ZSHOPAPPS EXTENSION</span> SANGATGACOR!!','e04.lead':'Bandingkan lima paket, pilih satu, lalu bayar melalui QRIS atau transfer SeaBank. Nominal paket aktif tampil otomatis dan bukti pembayaran dapat langsung dikirim ke owner.',
      'e05.kicker':'💖 ZSHOPAPPS • EXTENSION 05 • SUPER MANIS','e05.title':'PILIH PAKET <span>ZSHOPAPPS SUPERMANIS</span> SEKARANG!','e05.lead':'🔥 Pilih durasi, cek nominal otomatis, bayar melalui QRIS atau transfer SeaBank, lalu kirim bukti untuk proses aktivasi. Tampilan dibuat jelas di semua perangkat.',
      'e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto siap masuk keranjang, QRIS/SeaBank, dan Telegram owner. 🛒⚡','e06.lead':'Pilih paket Boruto, Super Boruto, Orochimaru, Super Orochimaru, atau Sasuke. Semua nominal aktif di keranjang gabungan dan dapat dibayar lewat QRIS atau transfer SeaBank.'
    },
    en:{
      'tools.kicker':'Extension 01–06 language controls','tools.title':'Choose a language for Extensions 01–06. 🌐','tools.lead':'Core translations are available for Extensions 01 through 06. Preflix (Extension 03) also supports foreign-currency display estimates.','tools.language':'Extension language','tools.note':'💡 Language selection applies to core Extension 01–06 content. Payments remain in IDR.',
      'e01.kicker':'ZSHOPAPPS PORTAL • EXTENSION 01 • E-GIFT','e01.title':'Portal Extension <span>Educational • Premium • Exclusift</span>','e01.lead':'ZSHOPAPPS Portal extension cards add premium app access by tier. All packages use one cart and can be paid by QRIS or SeaBank transfer, with owner verification.',
      'e02.kicker':'ZSHOPAPPS PORTAL • EXTENSION 02 • ZSHOPAPPS CARD','e02.title':'ZSHOPAPPS Card <span>Premium • Premium+Pro • Phantom</span>','e02.lead':'ZSHOPAPPS Card comes in Premium, Premium+Pro, and Premium+Pro+Phantom tiers. Checkout uses the shared cart with QRIS or SeaBank transfer.',
      'e03.kicker':'ZSHOPAPPS PORTAL • EXTENSION 03 • PREFLIX','e03.title':'ZSHOPAPPS Preflix Lifetime, <span>a digital-selling portal</span> in one view.','e03.lead':'A mobile-friendly interface for digital-service catalogs, stronger store branding, and direct Telegram routing to the owner.',
      'e04.kicker':'ZSHOPAPPS PORTAL • EXTENSION 04','e04.title':'CHOOSE A <span>ZSHOPAPPS EXTENSION</span> SANGATGACOR PACKAGE','e04.lead':'Compare five packages, select one, then pay by QRIS or SeaBank transfer. The active amount updates automatically and payment proof can be sent to the owner.',
      'e05.kicker':'💖 ZSHOPAPPS • EXTENSION 05 • SUPER MANIS','e05.title':'CHOOSE YOUR <span>ZSHOPAPPS SUPERMANIS</span> PACKAGE NOW!','e05.lead':'🔥 Choose a duration, check the automatic amount, pay by QRIS or SeaBank transfer, then send proof for activation. The cards remain readable on every device.',
      'e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto is ready for cart, QRIS/SeaBank, and owner Telegram. 🛒⚡','e06.lead':'Choose Boruto, Super Boruto, Orochimaru, Super Orochimaru, or Sasuke. All active amounts use the shared cart and support QRIS or SeaBank transfer.'
    },
    ms:{
      'tools.kicker':'Kawalan bahasa Extension 01–06','tools.title':'Pilih bahasa untuk Extension 01–06. 🌐','tools.lead':'Terjemahan utama tersedia untuk Extension 01 hingga 06. Preflix (Extension 03) turut menyokong anggaran paparan mata wang asing.','tools.language':'Bahasa Extension','tools.note':'💡 Pilihan bahasa digunakan pada kandungan utama Extension 01–06. Bayaran kekal dalam IDR.',
      'e01.kicker':'ZSHOPAPPS PORTAL • EXTENSION 01 • E-GIFT','e01.title':'Portal Extension <span>Educational • Premium • Exclusift</span>','e01.lead':'Kad Extension ZSHOPAPPS Portal menambah akses aplikasi premium mengikut tier. Semua pakej menggunakan troli yang sama dan boleh dibayar melalui QRIS atau pindahan SeaBank.',
      'e02.kicker':'ZSHOPAPPS PORTAL • EXTENSION 02 • ZSHOPAPPS CARD','e02.title':'ZSHOPAPPS Card <span>Premium • Premium+Pro • Phantom</span>','e02.lead':'ZSHOPAPPS Card tersedia dalam tier Premium, Premium+Pro dan Premium+Pro+Phantom. Checkout menggunakan troli bersama dengan QRIS atau pindahan SeaBank.',
      'e03.kicker':'ZSHOPAPPS PORTAL • EXTENSION 03 • PREFLIX','e03.title':'ZSHOPAPPS Preflix Lifetime, <span>portal jualan digital</span> dalam satu paparan.','e03.lead':'Antara muka mesra mudah alih untuk katalog perkhidmatan digital, penjenamaan kedai dan hala terus ke owner melalui Telegram.',
      'e04.kicker':'ZSHOPAPPS PORTAL • EXTENSION 04','e04.title':'PILIH PAKEJ <span>ZSHOPAPPS EXTENSION</span> SANGATGACOR!!','e04.lead':'Bandingkan lima pakej, pilih satu, kemudian bayar melalui QRIS atau pindahan SeaBank. Jumlah aktif dikemas kini secara automatik.',
      'e05.kicker':'💖 ZSHOPAPPS • EXTENSION 05 • SUPER MANIS','e05.title':'PILIH PAKEJ <span>ZSHOPAPPS SUPERMANIS</span> SEKARANG!','e05.lead':'🔥 Pilih tempoh, semak jumlah automatik, bayar melalui QRIS atau pindahan SeaBank, kemudian hantar bukti untuk pengaktifan.',
      'e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto sedia untuk troli, QRIS/SeaBank dan Telegram owner. 🛒⚡','e06.lead':'Pilih Boruto, Super Boruto, Orochimaru, Super Orochimaru atau Sasuke. Semua jumlah aktif boleh dibayar melalui QRIS atau pindahan SeaBank.'
    },
    ja:{
      'tools.kicker':'Extension 01–06 言語設定','tools.title':'Extension 01–06 の言語を選択。🌐','tools.lead':'Extension 01〜06 の主要テキストを翻訳できます。Preflix（Extension 03）は外貨の参考表示にも対応します。','tools.language':'Extension 言語','tools.note':'💡 言語設定は Extension 01–06 の主要コンテンツに適用されます。支払いは IDR のままです。',
      'e01.kicker':'ZSHOPAPPS PORTAL • EXTENSION 01 • E-GIFT','e01.title':'Portal Extension <span>Educational • Premium • Exclusift</span>','e01.lead':'ZSHOPAPPS Portal の拡張カードで、ティア別にプレミアムアプリへのアクセスを追加できます。共通カートで QRIS または SeaBank 振込に対応します。',
      'e02.kicker':'ZSHOPAPPS PORTAL • EXTENSION 02 • ZSHOPAPPS CARD','e02.title':'ZSHOPAPPS Card <span>Premium • Premium+Pro • Phantom</span>','e02.lead':'Premium、Premium+Pro、Premium+Pro+Phantom の各ティアを選択できます。共通カートから QRIS または SeaBank 振込で支払えます。',
      'e03.kicker':'ZSHOPAPPS PORTAL • EXTENSION 03 • PREFLIX','e03.title':'ZSHOPAPPS Preflix Lifetime、<span>デジタル販売ポータル</span>を1画面に。','e03.lead':'デジタルサービスのカタログ、店舗ブランディング、Telegram でのオーナー連絡をモバイル向けに整理します。',
      'e04.kicker':'ZSHOPAPPS PORTAL • EXTENSION 04','e04.title':'<span>ZSHOPAPPS EXTENSION</span> SANGATGACOR パッケージを選択','e04.lead':'5つのパッケージを比較し、QRIS または SeaBank 振込で支払えます。選択した金額は自動更新されます。',
      'e05.kicker':'💖 ZSHOPAPPS • EXTENSION 05 • SUPER MANIS','e05.title':'<span>ZSHOPAPPS SUPERMANIS</span> パッケージを今すぐ選択！','e05.lead':'🔥 期間を選択し、金額を確認して QRIS または SeaBank 振込で支払い、証明を送信して有効化します。',
      'e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto：カート、QRIS/SeaBank、オーナー Telegram に対応。🛒⚡','e06.lead':'Boruto、Super Boruto、Orochimaru、Super Orochimaru、Sasuke から選択。共通カートで QRIS または SeaBank 振込に対応します。'
    },
    zh:{
      'tools.kicker':'Extension 01–06 语言控制','tools.title':'选择 Extension 01–06 的语言。🌐','tools.lead':'Extension 01 至 06 的核心内容支持翻译。Preflix（Extension 03）还支持外币估算显示。','tools.language':'Extension 语言','tools.note':'💡 语言选择适用于 Extension 01–06 的核心内容。付款仍使用 IDR。',
      'e01.kicker':'ZSHOPAPPS PORTAL • EXTENSION 01 • E-GIFT','e01.title':'Portal Extension <span>Educational • Premium • Exclusift</span>','e01.lead':'ZSHOPAPPS Portal 扩展卡按等级增加高级应用访问。所有套餐共用购物车，并支持 QRIS 或 SeaBank 转账。',
      'e02.kicker':'ZSHOPAPPS PORTAL • EXTENSION 02 • ZSHOPAPPS CARD','e02.title':'ZSHOPAPPS Card <span>Premium • Premium+Pro • Phantom</span>','e02.lead':'ZSHOPAPPS Card 提供 Premium、Premium+Pro 和 Premium+Pro+Phantom。结账支持 QRIS 或 SeaBank 转账。',
      'e03.kicker':'ZSHOPAPPS PORTAL • EXTENSION 03 • PREFLIX','e03.title':'ZSHOPAPPS Preflix Lifetime，<span>数字销售门户</span>集中在一个界面。','e03.lead':'移动端友好的数字服务目录、店铺品牌展示，并通过 Telegram 直接联系 owner。',
      'e04.kicker':'ZSHOPAPPS PORTAL • EXTENSION 04','e04.title':'选择 <span>ZSHOPAPPS EXTENSION</span> SANGATGACOR 套餐','e04.lead':'比较五种套餐，选择后可通过 QRIS 或 SeaBank 转账付款。所选金额会自动更新。',
      'e05.kicker':'💖 ZSHOPAPPS • EXTENSION 05 • SUPER MANIS','e05.title':'立即选择 <span>ZSHOPAPPS SUPERMANIS</span> 套餐！','e05.lead':'🔥 选择时长、确认自动金额，通过 QRIS 或 SeaBank 转账付款，然后发送凭证完成激活。',
      'e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto 支持购物车、QRIS/SeaBank 和 owner Telegram。🛒⚡','e06.lead':'可选择 Boruto、Super Boruto、Orochimaru、Super Orochimaru 或 Sasuke。所有金额通过共用购物车并支持 QRIS 或 SeaBank 转账。'
    },
    ko:{
      'tools.kicker':'Extension 01–06 언어 설정','tools.title':'Extension 01–06 언어를 선택하세요. 🌐','tools.lead':'Extension 01부터 06까지 핵심 문구 번역을 지원합니다. Preflix(Extension 03)는 외화 예상 표시도 지원합니다.','tools.language':'Extension 언어','tools.note':'💡 언어 선택은 Extension 01–06 핵심 콘텐츠에 적용됩니다. 결제는 IDR로 유지됩니다.',
      'e01.kicker':'ZSHOPAPPS PORTAL • EXTENSION 01 • E-GIFT','e01.title':'Portal Extension <span>Educational • Premium • Exclusift</span>','e01.lead':'ZSHOPAPPS Portal 확장 카드로 등급별 프리미엄 앱 접근을 추가합니다. 공용 장바구니에서 QRIS 또는 SeaBank 이체로 결제할 수 있습니다.',
      'e02.kicker':'ZSHOPAPPS PORTAL • EXTENSION 02 • ZSHOPAPPS CARD','e02.title':'ZSHOPAPPS Card <span>Premium • Premium+Pro • Phantom</span>','e02.lead':'Premium, Premium+Pro, Premium+Pro+Phantom 등급을 제공합니다. 공용 장바구니에서 QRIS 또는 SeaBank 이체를 지원합니다.',
      'e03.kicker':'ZSHOPAPPS PORTAL • EXTENSION 03 • PREFLIX','e03.title':'ZSHOPAPPS Preflix Lifetime, <span>디지털 판매 포털</span>을 한 화면에.','e03.lead':'모바일 친화적인 디지털 서비스 카탈로그, 스토어 브랜딩, Telegram owner 연결을 제공합니다.',
      'e04.kicker':'ZSHOPAPPS PORTAL • EXTENSION 04','e04.title':'<span>ZSHOPAPPS EXTENSION</span> SANGATGACOR 패키지 선택','e04.lead':'5개 패키지를 비교하고 QRIS 또는 SeaBank 이체로 결제하세요. 선택 금액은 자동으로 갱신됩니다.',
      'e05.kicker':'💖 ZSHOPAPPS • EXTENSION 05 • SUPER MANIS','e05.title':'지금 <span>ZSHOPAPPS SUPERMANIS</span> 패키지를 선택하세요!','e05.lead':'🔥 기간 선택, 금액 확인, QRIS 또는 SeaBank 이체 결제 후 증빙을 보내 활성화를 진행합니다.',
      'e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto는 장바구니, QRIS/SeaBank, owner Telegram을 지원합니다. 🛒⚡','e06.lead':'Boruto, Super Boruto, Orochimaru, Super Orochimaru 또는 Sasuke를 선택하세요. 공용 장바구니에서 QRIS 또는 SeaBank 이체를 지원합니다.'
    },
    ar:{
      'tools.kicker':'إعداد لغة Extension 01–06','tools.title':'اختر لغة Extension 01–06. 🌐','tools.lead':'تتوفر ترجمة للمحتوى الأساسي في Extension 01 إلى 06. يدعم Preflix (Extension 03) أيضاً عرضاً تقديرياً بالعملات الأجنبية.','tools.language':'لغة Extension','tools.note':'💡 يطبق اختيار اللغة على المحتوى الأساسي لـ Extension 01–06. يبقى الدفع بعملة IDR.',
      'e01.kicker':'ZSHOPAPPS PORTAL • EXTENSION 01 • E-GIFT','e01.title':'Portal Extension <span>Educational • Premium • Exclusift</span>','e01.lead':'تضيف بطاقات ZSHOPAPPS Portal وصولاً للتطبيقات المميزة حسب الفئة. تستخدم جميع الباقات سلة واحدة وتدعم QRIS أو التحويل إلى SeaBank.',
      'e02.kicker':'ZSHOPAPPS PORTAL • EXTENSION 02 • ZSHOPAPPS CARD','e02.title':'ZSHOPAPPS Card <span>Premium • Premium+Pro • Phantom</span>','e02.lead':'تتوفر فئات Premium وPremium+Pro وPremium+Pro+Phantom. يدعم الدفع عبر QRIS أو التحويل إلى SeaBank.',
      'e03.kicker':'ZSHOPAPPS PORTAL • EXTENSION 03 • PREFLIX','e03.title':'ZSHOPAPPS Preflix Lifetime، <span>بوابة بيع رقمية</span> في واجهة واحدة.','e03.lead':'واجهة مناسبة للجوال لعرض الخدمات الرقمية وتعزيز هوية المتجر والتواصل مع المالك عبر Telegram.',
      'e04.kicker':'ZSHOPAPPS PORTAL • EXTENSION 04','e04.title':'اختر باقة <span>ZSHOPAPPS EXTENSION</span> SANGATGACOR','e04.lead':'قارن خمس باقات واختر واحدة ثم ادفع عبر QRIS أو تحويل SeaBank. يتم تحديث المبلغ المختار تلقائياً.',
      'e05.kicker':'💖 ZSHOPAPPS • EXTENSION 05 • SUPER MANIS','e05.title':'اختر باقة <span>ZSHOPAPPS SUPERMANIS</span> الآن!','e05.lead':'🔥 اختر المدة وتحقق من المبلغ ثم ادفع عبر QRIS أو SeaBank وأرسل إثبات الدفع للتفعيل.',
      'e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto جاهز للسلة وQRIS/SeaBank وTelegram الخاص بالمالك. 🛒⚡','e06.lead':'اختر Boruto أو Super Boruto أو Orochimaru أو Super Orochimaru أو Sasuke. جميع المبالغ تعمل عبر السلة المشتركة وQRIS أو SeaBank.'
    },
    es:{
      'tools.kicker':'Idioma de Extension 01–06','tools.title':'Elige el idioma para Extension 01–06. 🌐','tools.lead':'Hay traducciones principales para Extension 01 a 06. Preflix (Extension 03) también permite mostrar estimaciones en moneda extranjera.','tools.language':'Idioma de Extension','tools.note':'💡 El idioma se aplica al contenido principal de Extension 01–06. El pago sigue en IDR.',
      'e01.kicker':'ZSHOPAPPS PORTAL • EXTENSION 01 • E-GIFT','e01.title':'Portal Extension <span>Educational • Premium • Exclusift</span>','e01.lead':'Las tarjetas de ZSHOPAPPS Portal añaden acceso a apps premium por nivel. Todos los paquetes usan el mismo carrito y admiten QRIS o transferencia SeaBank.',
      'e02.kicker':'ZSHOPAPPS PORTAL • EXTENSION 02 • ZSHOPAPPS CARD','e02.title':'ZSHOPAPPS Card <span>Premium • Premium+Pro • Phantom</span>','e02.lead':'ZSHOPAPPS Card ofrece los niveles Premium, Premium+Pro y Premium+Pro+Phantom. El checkout admite QRIS o transferencia SeaBank.',
      'e03.kicker':'ZSHOPAPPS PORTAL • EXTENSION 03 • PREFLIX','e03.title':'ZSHOPAPPS Preflix Lifetime, <span>un portal de venta digital</span> en una sola vista.','e03.lead':'Interfaz móvil para catálogo de servicios digitales, branding de tienda y contacto directo con el owner mediante Telegram.',
      'e04.kicker':'ZSHOPAPPS PORTAL • EXTENSION 04','e04.title':'ELIGE UN PAQUETE <span>ZSHOPAPPS EXTENSION</span> SANGATGACOR','e04.lead':'Compara cinco paquetes, elige uno y paga por QRIS o transferencia SeaBank. El importe activo se actualiza automáticamente.',
      'e05.kicker':'💖 ZSHOPAPPS • EXTENSION 05 • SUPER MANIS','e05.title':'¡ELIGE AHORA TU PAQUETE <span>ZSHOPAPPS SUPERMANIS</span>!','e05.lead':'🔥 Elige la duración, revisa el importe automático, paga por QRIS o SeaBank y envía el comprobante para la activación.',
      'e06.kicker':'ZSHOPAPPS AKATSUKI EXTENSION • NARUTO EDITION','e06.title':'Extension 06 Naruto listo para carrito, QRIS/SeaBank y Telegram del owner. 🛒⚡','e06.lead':'Elige Boruto, Super Boruto, Orochimaru, Super Orochimaru o Sasuke. Todos los importes usan el carrito común y admiten QRIS o SeaBank.'
    }
  };
  Object.keys(extensionI18n).forEach(lang=>{
    i18n[lang]=Object.assign({},i18n[lang]||{},extensionI18n[lang]);
  });
  const mergeLang=(base,extra)=>Object.assign({},i18n.id,base||{},extra||{});
  i18n.ms=mergeLang(i18n.ms); i18n.ja=mergeLang(i18n.ja); i18n.zh=mergeLang(i18n.zh); i18n.ko=mergeLang(i18n.ko); i18n.ar=mergeLang(i18n.ar); i18n.es=mergeLang(i18n.es);
  let currentLang=localStorage.getItem(STORAGE_LANG)||'id';
  let currentCurrency=localStorage.getItem(STORAGE_CUR)||'IDR';
  let fxRates=fallbackRates;
  function applyLanguage(lang){
    currentLang=i18n[lang]?lang:'id';
    localStorage.setItem(STORAGE_LANG,currentLang);
    document.documentElement.lang=currentLang;
    document.documentElement.dir=currentLang==='ar'?'rtl':'ltr';
    $$('[data-i18n]').forEach(node=>{
      const key=node.dataset.i18n;
      const value=(i18n[currentLang]&&i18n[currentLang][key])||i18n.id[key];
      if(value) node.innerHTML=value;
    });
    const sel=$('#globalLanguageSelect'); if(sel) sel.value=currentLang;
  }
  function formatIDR(value){
    try{return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value).replace(',00','');}catch(e){return 'Rp'+Number(value).toLocaleString('id-ID');}
  }
  function formatFX(value,currency){
    if(currency==='IDR') return '';
    const rate=fxRates[currency];
    if(!rate) return '';
    const converted=Number(value)*Number(rate);
    const decimals=currency==='JPY'?0:(converted<1?2:2);
    try{return new Intl.NumberFormat(currentLang==='id'?'en-US':undefined,{style:'currency',currency,maximumFractionDigits:decimals,minimumFractionDigits:decimals}).format(converted);}catch(e){return currency+' '+converted.toFixed(decimals);}
  }
  function renderFxText(idr){
    if(currentCurrency==='IDR') return 'Harga resmi: '+formatIDR(idr)+' • pembayaran tetap IDR';
    return '≈ '+formatFX(idr,currentCurrency)+' • bayar resmi '+formatIDR(idr)+' via QRIS / SeaBank';
  }
  function updatePriceNode(node,idr){ if(!node) return; node.textContent=renderFxText(idr); }
  function updateStaticFx(){
    $$('[data-base-idr]').forEach(node=>{
      const idr=Number(node.dataset.baseIdr||node.getAttribute('data-base-idr')||0);
      if(!idr) return;
      node.textContent=currentCurrency==='IDR'?'Harga resmi IDR':('≈ '+formatFX(idr,currentCurrency)+' • IDR resmi');
    });
    const liveTargets=$$('#extension-06-naruto [data-live-price-target]');
    liveTargets.forEach(target=>{
      const card=target.closest('.product-card');
      const priceNode=card?$('.price',card):null;
      if(!priceNode) return;
      const raw=(priceNode.textContent||'').replace(/[^0-9]/g,'');
      if(!raw) return;
      updatePriceNode(target, Number(raw));
    });
    const lp=$('.lifetime-price-highlight .lifetime-fx-note');
    if(lp) updatePriceNode(lp,300000);
    const ltp=$('.lifetime-table-price + .lifetime-fx-note');
    if(ltp) updatePriceNode(ltp,300000);
  }
  async function loadRates(){
    const cachedRaw=localStorage.getItem(STORAGE_FX);
    if(cachedRaw){
      try{const cached=JSON.parse(cachedRaw); if(cached&&cached.rates) fxRates=Object.assign({},fallbackRates,cached.rates);}catch(e){}
    }
    try{
      const res=await fetch('https://open.er-api.com/v6/latest/IDR',{mode:'cors'});
      const data=await res.json();
      if(data&&data.rates){
        fxRates={};
        Object.keys(fallbackRates).forEach(code=>{fxRates[code]=code==='IDR'?1:Number(data.rates[code]||fallbackRates[code]);});
        localStorage.setItem(STORAGE_FX,JSON.stringify({ts:Date.now(),rates:fxRates}));
      }
    }catch(err){ fxRates=Object.assign({},fallbackRates,fxRates||{}); }
    updateStaticFx();
  }
  function bindSelectors(){
    const langSel=$('#globalLanguageSelect'); const curSel=$('#globalCurrencySelect');
    if(langSel){ langSel.value=currentLang; langSel.addEventListener('change',e=>applyLanguage(e.target.value)); }
    if(curSel){ curSel.value=currentCurrency; curSel.addEventListener('change',e=>{ currentCurrency=e.target.value; localStorage.setItem(STORAGE_CUR,currentCurrency); updateStaticFx();}); }
  }
  function setupLifetimeFx(){
    const heroPrice=$('.lifetime-price-highlight strong');
    if(heroPrice && !$('.lifetime-fx-note', heroPrice.parentElement)) heroPrice.insertAdjacentHTML('afterend','<small class="lifetime-fx-note"></small>');
    const tablePrice=$('.lifetime-table-price');
    if(tablePrice && !tablePrice.nextElementSibling?.classList.contains('lifetime-fx-note')) tablePrice.insertAdjacentHTML('afterend','<small class="lifetime-fx-note"></small>');
  }
  function setupZoom(){
    const modal=document.createElement('div');
    modal.className='e06-zoom-modal';
    modal.innerHTML='<div class="e06-zoom-modal-card" role="dialog" aria-modal="true" aria-label="Zoom gambar"><div class="e06-zoom-modal-meta"><strong>Zoom Preview</strong><button type="button">Tutup</button></div><img alt="Zoom preview"></div>';
    document.body.appendChild(modal);
    const img=$('img',modal), closeBtn=$('button',modal), title=$('strong',modal);
    const close=()=>{ modal.classList.remove('is-open'); document.body.classList.remove('e06-zoom-open'); };
    const open=(src,label)=>{ img.src=src; img.alt=label||'Zoom preview'; title.textContent=label||'Zoom Preview'; modal.classList.add('is-open'); document.body.classList.add('e06-zoom-open'); };
    $$('.naruto-zoom').forEach(btn=>btn.addEventListener('click',()=>open(btn.dataset.zoomSrc,$('img',btn)?.alt || 'Zoom Preview')));
    closeBtn.addEventListener('click',close);
    modal.addEventListener('click',e=>{ if(e.target===modal) close(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape' && modal.classList.contains('is-open')) close(); });
  }
  function setupSecretCodes(){
    const toggle=$('#e06SecretToggle'); const list=$('#e06SecretList');
    if(toggle && list){ toggle.addEventListener('click',()=>{ const hidden=list.hasAttribute('hidden'); list.toggleAttribute('hidden', !hidden); toggle.textContent=hidden?'Sembunyikan kode rahasia':'Tampilkan kode rahasia'; }); }
    $$('[data-copy-secret]').forEach(btn=>btn.addEventListener('click',async()=>{ const value=btn.dataset.copySecret||''; try{ await navigator.clipboard.writeText(value); btn.textContent='Copied'; setTimeout(()=>btn.textContent='Copy',1200);}catch(e){ btn.textContent=value; setTimeout(()=>btn.textContent='Copy',1400);} }));
  }
  function setupOpenCart(){ const btn=$('#e06OpenCartBtn'); if(btn) btn.addEventListener('click',e=>{ e.preventDefault(); $('#cartBtn')?.click(); }); }
  function observeLivePrices(){
    const mo=new MutationObserver(()=>updateStaticFx());
    $$('#extension-06-naruto .price').forEach(node=>mo.observe(node,{childList:true,characterData:true,subtree:true}));
  }
  bindSelectors();
  setupLifetimeFx();
  setupZoom();
  setupSecretCodes();
  setupOpenCart();
  observeLivePrices();
  applyLanguage(currentLang);
  loadRates();
  updateStaticFx();
})();
