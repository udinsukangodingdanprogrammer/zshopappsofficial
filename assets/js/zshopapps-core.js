        // ACODE: ubah nomor WhatsApp, tautan sosial, harga, paket, dan stok melalui CONFIG/data product-card.
        // QRIS memakai gambar yang diunggah dan bersifat statis: nominal tetap dimasukkan manual oleh pembeli.
        const CONFIG = {
            whatsappNumber: "6283175713697",
            ownerMessage: "Halo ZSHOPAPPS, saya mau beli apps premium.",
            telegramPrimary: "https://t.me/ZShopAppsJualanAplikasiOriginal",
            telegramSecondary: "https://t.me/Seller4899",
            tiktok: "https://www.tiktok.com/@mcgogozshopapps",
            youtube: "https://youtube.com/@zxgameplay2?si=TfB396XSqwFXcEmy",
            x: "https://x.com/IjuddinPro33035",
            facebook: "https://www.facebook.com/share/17wjktJ4hi/",
            instagram: "https://www.instagram.com/tokodigitalpremiumzshopapps?igsh=eGFpNjlibzYyaXQ0",
            website: "https://linktr.ee/fanyyfanny84",
            qrisMerchant: "ZSHOPAPPS",
            qrisNmid: "ID1025446351823",
            qrisTerminal: "A01",
            seabankAccount: "901297235411",
            seabankAccountName: "Sutini",
            seabankDisplay: "SeaBank — 901297235411 — Sutini"
        };
        const QRIS_IMAGE = "./assets/images/image-056-dbca5391.png";
        const $ = (s, c = document) => c.querySelector(s),
            $$ = (s, c = document) => [...c.querySelectorAll(s)];
        const body = document.body,
            drawer = $("#drawer"),
            menuBtn = $("#menuBtn");
        let region = 'asia';
        let activeOrder = null;

        function openMenu() {
            body.classList.add("menu-open");
            drawer.setAttribute("aria-hidden", "false");
            menuBtn.setAttribute("aria-expanded", "true")
        }

        function closeMenu() {
            body.classList.remove("menu-open");
            drawer.setAttribute("aria-hidden", "true");
            menuBtn.setAttribute("aria-expanded", "false")
        }
        menuBtn.addEventListener("click", openMenu);
        $("#closeBtn").addEventListener("click", closeMenu);
        $("#backdrop").addEventListener("click", closeMenu);
        $$('.drawer-link').forEach(a => a.addEventListener('click', closeMenu));

        const savedTheme = (() => {
            try {
                return localStorage.getItem('zshop_theme')
            } catch (e) {
                return null
            }
        })();
        if (savedTheme) document.documentElement.dataset.theme = savedTheme;

        function syncThemeIcon() {
            $("#themeBtn").textContent = document.documentElement.dataset.theme === 'dark' ? '☀' : '☾'
        }
        syncThemeIcon();
        $("#themeBtn").addEventListener("click", () => {
            const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
            document.documentElement.dataset.theme = next;
            syncThemeIcon();
            try {
                localStorage.setItem('zshop_theme', next)
            } catch (e) {}
        });

        function waUrl(message) {
            return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`
        }
        $$('.owner-chat').forEach(a => {
            a.href = waUrl(CONFIG.ownerMessage);
            a.target = '_blank';
            a.rel = 'noopener'
        });
        $$('[data-social]').forEach(a => {
            a.href = CONFIG[a.dataset.social] || '#';
            a.target = '_blank';
            a.rel = 'noopener'
        });
        $$('[data-qris-image]').forEach(img => {
            img.src = QRIS_IMAGE
        });

        const rupiah = n => 'Rp' + new Intl.NumberFormat('id-ID').format(n);

        // Extension 04 macOS pricing workspace: package selection -> QRIS -> WhatsApp proof.
        function selectE04Package(card) {
            const cards = $$('#extension-04-sangatgacor .e04-card[data-e04-package]');
            cards.forEach(item => item.classList.toggle('is-selected', item === card));
            const packageName = card.dataset.e04Package || 'Paket';
            const duration = card.dataset.e04Duration || '-';
            const amount = Number(card.dataset.e04Price) || 0;
            const packageOut = $('#e04SelectedPackage');
            const durationOut = $('#e04SelectedDuration');
            const amountOut = $('#e04SelectedAmount');
            if (packageOut) packageOut.textContent = packageName;
            if (durationOut) durationOut.textContent = duration;
            if (amountOut) amountOut.textContent = rupiah(amount);
            const proof = $('#e04ProofWhatsapp');
            if (proof) {
                const message = `Halo ZSHOPAPPS, saya sudah memilih ZSHOPAPPS Extension SangatGacor!!

Paket: ${packageName}
Durasi: ${duration}
Nominal pembayaran: ${rupiah(amount)}

Saya akan / sudah melakukan pembayaran melalui QRIS atau SeaBank. Mohon verifikasi bukti pembayaran dan lanjutkan proses aktivasi. Terima kasih.`;
                proof.href = waUrl(message);
            }
            const title = $('#e04PaymentTitle');
            if (title) title.textContent = `${packageName} siap dibayar`;
        }

        $$('[data-e04-select]').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.e04-card');
                if (!card) return;
                selectE04Package(card);
                const dock = $('.e04-payment-dock');
                if (dock) dock.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
            });
        });
        const e04InitialCard = $('#extension-04-sangatgacor .e04-card[data-e04-package]');
        if (e04InitialCard) selectE04Package(e04InitialCard);
        const e04QrisImage = $('[data-e04-qris-image]');
        if (e04QrisImage) e04QrisImage.src = QRIS_IMAGE;
        const e04CopyAmount = $('#e04CopyAmount');
        if (e04CopyAmount) e04CopyAmount.addEventListener('click', async () => {
            const selected = $('#extension-04-sangatgacor .e04-card.is-selected');
            if (!selected) return;
            const amount = String(Number(selected.dataset.e04Price) || 0);
            let ok = false;
            try {
                await navigator.clipboard.writeText(amount);
                ok = true;
            } catch (err) {
                const area = document.createElement('textarea');
                area.value = amount;
                area.style.position = 'fixed';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                try { ok = document.execCommand('copy'); } catch (e) {}
                area.remove();
            }
            const old = e04CopyAmount.textContent;
            e04CopyAmount.textContent = ok ? '✓ Nominal Disalin' : 'Gagal Menyalin';
            setTimeout(() => { e04CopyAmount.textContent = old; }, 1500);
        });


        // === EDIT HARGA EXTENSION 05 DI SINI ===
        // Ubah angka `price` saja; card, ringkasan QRIS, dan pesan WhatsApp akan ikut diperbarui.
        const E05_PRICE_CONFIG = Object.freeze({
            'manis': { packageName: 'Paket Manis', duration: '1 Bulan', price: 100000 },
            'super-manis': { packageName: 'Paket Super Manis', duration: '3 Bulan', price: 235000 },
            'sangat-manis': { packageName: 'Paket Sangat Manis', duration: '6 Bulan', price: 500000 }
        });

        function syncE05CardConfig(card) {
            const cfg = E05_PRICE_CONFIG[card.dataset.e05PlanKey];
            if (!cfg) return;
            card.dataset.e05Package = cfg.packageName;
            card.dataset.e05Duration = cfg.duration;
            card.dataset.e05Price = String(cfg.price);
            card.dataset.name = `ZSHOPAPPS Extension 05 SuperManis • ${cfg.packageName}`;
            card.dataset.productType = 'portal-extension';
            card.dataset.quantity = '1';
            card.dataset.selectedPlan = card.dataset.e05PlanKey;
            card.dataset.plansAsia = JSON.stringify([{
                id: card.dataset.e05PlanKey,
                label: cfg.duration,
                price: cfg.price,
                stock: null,
                unlimited: true
            }]);
            const title = card.querySelector('h3');
            const duration = card.querySelector('.e05-duration');
            const price = card.querySelector('.e05-price strong');
            if (title) title.textContent = cfg.packageName;
            if (duration) duration.textContent = `{${cfg.duration}}`;
            if (price) price.textContent = `IDR ${new Intl.NumberFormat('id-ID').format(cfg.price)}`;
        }

        function selectE05Package(card) {
            $$('#extension-05-supermanis .e05-price-card[data-e05-package]').forEach(item => item.classList.toggle('is-selected', item === card));
            const packageName = card.dataset.e05Package || 'Paket Manis';
            const duration = card.dataset.e05Duration || '1 Bulan';
            const amount = Number(card.dataset.e05Price) || 0;
            const packageOut = $('#e05SelectedPackage');
            const durationOut = $('#e05SelectedDuration');
            const amountOut = $('#e05SelectedAmount');
            const title = $('#e05PaymentTitle');
            const proof = $('#e05ProofWhatsapp');
            if (packageOut) packageOut.textContent = packageName;
            if (durationOut) durationOut.textContent = duration;
            if (amountOut) amountOut.textContent = rupiah(amount);
            if (title) title.textContent = `${packageName} siap dibayar`;
            if (proof) {
                proof.href = waUrl(`Halo ZSHOPAPPS, saya memilih ZSHOPAPPS Extension 05 SuperManis.\n\nPaket: ${packageName}\nDurasi: ${duration}\nNominal pembayaran: ${rupiah(amount)}\n\nSaya akan / sudah melakukan pembayaran melalui QRIS atau SeaBank. Mohon verifikasi bukti pembayaran dan proses aktivasi. Terima kasih.`);
            }
        }

        $$('#extension-05-supermanis .e05-price-card[data-e05-plan-key]').forEach(syncE05CardConfig);
        $$('[data-e05-select]').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.e05-price-card');
                if (!card) return;
                selectE05Package(card);
                const payment = $('#extension-05-supermanis .e05-payment');
                if (payment) payment.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
            });
        });
        $$('[data-e05-add-cart]').forEach(button => {
            button.addEventListener('click', () => {
                const card = button.closest('.e05-price-card');
                if (!card) return;
                selectE05Package(card);
                if (!window.ZSHOP_CART) {
                    window.alert('Keranjang sedang dimuat. Silakan coba lagi sebentar.');
                    return;
                }
                window.ZSHOP_CART.addFromCard(card);
                window.ZSHOP_CART.open();
                const original = button.textContent;
                button.textContent = '✓ Paket Masuk Keranjang';
                button.classList.add('is-added');
                setTimeout(() => {
                    button.textContent = original;
                    button.classList.remove('is-added');
                }, 1500);
            });
        });
        const e05InitialCard = $('#extension-05-supermanis .e05-price-card[data-e05-package]');
        if (e05InitialCard) selectE05Package(e05InitialCard);
        const e05QrisImage = $('[data-e05-qris-image]');
        if (e05QrisImage) e05QrisImage.src = QRIS_IMAGE;
        const e05CopyAmount = $('#e05CopyAmount');
        if (e05CopyAmount) e05CopyAmount.addEventListener('click', async () => {
            const selected = $('#extension-05-supermanis .e05-price-card.is-selected');
            if (!selected) return;
            const amount = String(Number(selected.dataset.e05Price) || 0);
            let ok = false;
            try {
                await navigator.clipboard.writeText(amount);
                ok = true;
            } catch (err) {
                const area = document.createElement('textarea');
                area.value = amount;
                area.style.position = 'fixed';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                try { ok = document.execCommand('copy'); } catch (e) {}
                area.remove();
            }
            const old = e05CopyAmount.textContent;
            e05CopyAmount.textContent = ok ? '✓ Nominal Disalin' : 'Gagal Menyalin';
            setTimeout(() => { e05CopyAmount.textContent = old; }, 1500);
        });

        const parsePlans = card => {
            try {
                return JSON.parse(card.dataset.plansAsia || '[]')
            } catch (e) {
                return []
            }
        };
        const planPriceText = plan => plan.price === null || Number(plan.price) <= 0 ? 'Hubungi Owner' : rupiah(Number(plan.price));
        const isKnownPrice = plan => plan && plan.price !== null && Number(plan.price) > 0;
        const isUnlimitedPlan = plan => Boolean(plan && plan.unlimited === true);
        const isUnlimitedItem = item => Boolean(item && item.unlimited === true);
        const MAX_SAFE_QUANTITY = Number.MAX_SAFE_INTEGER;
        const getPlan = card => {
            const plans = parsePlans(card, region);
            return plans.find(item => item.id === card.dataset.selectedPlan) || plans[0] || null
        };
        const getQuantity = card => Math.max(1, Number(card.dataset.quantity) || 1);
        const getUnitText = plan => isKnownPrice(plan) ? rupiah(Number(plan.price)) : 'Hubungi Owner';
        const getTotalValue = (plan, qty) => isKnownPrice(plan) ? Number(plan.price) * qty : null;
        const getTotalText = (plan, qty) => {
            const total = getTotalValue(plan, qty);
            return total === null ? 'Hubungi Owner' : rupiah(total)
        };

        function createOrderCode() {
            const d = new Date();
            const pad = n => String(n).padStart(2, '0');
            return `ZSA-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
        }

        function enhanceProductCard(card) {
            if (card.dataset.commerceReady === 'true') return;
            card.dataset.commerceReady = 'true';
            card.dataset.quantity = '1';
            const buy = $('.buy-button', card);
            const quantity = document.createElement('div');
            quantity.className = 'quantity-row';
            quantity.innerHTML = `<div class="quantity-copy"><strong>Jumlah beli</strong><small class="quantity-limit">Maksimal mengikuti stok</small></div><div class="quantity-control"><button type="button" class="qty-minus" aria-label="Kurangi jumlah">−</button><input class="qty-input" type="number" min="1" value="1" inputmode="numeric" aria-label="Jumlah beli"><button type="button" class="qty-plus" aria-label="Tambah jumlah">+</button></div>`;
            const miniTotal = document.createElement('div');
            miniTotal.className = 'order-total-mini';
            miniTotal.innerHTML = '<span>Total otomatis</span><strong class="mini-total-value">-</strong>';
            const actions = document.createElement('div');
            actions.className = 'card-actions';
            const qrisButton = document.createElement('button');
            qrisButton.type = 'button';
            qrisButton.className = 'qris-button';
            qrisButton.textContent = 'Bayar QRIS';
            buy.parentNode.insertBefore(quantity, buy);
            buy.parentNode.insertBefore(miniTotal, buy);
            buy.parentNode.insertBefore(actions, buy);
            actions.appendChild(buy);
            actions.appendChild(qrisButton);
            const priceSmall = $('.price-row small', card);
            if (priceSmall && !$('.price-unit-note', card)) priceSmall.insertAdjacentHTML('beforeend', '<span class="price-unit-note"></span>');
            $('.qty-minus', card).addEventListener('click', () => setQuantity(card, getQuantity(card) - 1));
            $('.qty-plus', card).addEventListener('click', () => setQuantity(card, getQuantity(card) + 1));
            $('.qty-input', card).addEventListener('input', e => setQuantity(card, e.target.value));
            $('.qty-input', card).addEventListener('blur', () => setQuantity(card, getQuantity(card)));
            qrisButton.addEventListener('click', () => {
                if (card.dataset.productType === "business-portal" && window.ZSHOP_CART) {
                    window.ZSHOP_CART.addFromCard(card);
                    window.ZSHOP_CART.open();
                    return;
                }
                openPaymentForCard(card);
            });
        }

        function setQuantity(card, value) {
            const plan = getPlan(card);
            const stock = plan && plan.stock !== null && plan.stock !== undefined ? Number(plan.stock) || 0 : 0;
            const unlimited = isUnlimitedPlan(plan);
            const businessLimit = Number(card.dataset.maxPerBusiness) || 0;
            const max = businessLimit > 0 ? businessLimit : (unlimited ? MAX_SAFE_QUANTITY : (stock > 0 ? Math.max(1, stock) : 99));
            const qty = Math.min(max, Math.max(1, Math.floor(Number(value) || 1)));
            card.dataset.quantity = String(qty);
            const input = $('.qty-input', card);
            if (input) {
                input.value = String(qty);
                if (unlimited && businessLimit <= 0) input.removeAttribute("max");
                else input.max = String(max);
                input.min = "1";
                input.readOnly = businessLimit > 0;
                input.setAttribute("aria-readonly", businessLimit > 0 ? "true" : "false");
            }
            const minus = $('.qty-minus', card),
                plus = $('.qty-plus', card);
            if (minus) minus.disabled = qty <= 1;
            if (plus) plus.disabled = !unlimited && qty >= max;
            const limit = $('.quantity-limit', card);
            if (limit) limit.textContent = businessLimit > 0 ? (card.dataset.productType === "business-portal" ? `Maksimal ${businessLimit} lisensi per bisnis` : `Minimal 1 • maksimal ${businessLimit} paket`) : (unlimited ? 'Tanpa batas stok' : (plan && plan.stock == null ? 'Stok belum dicantumkan — hubungi owner' : (stock > 0 ? `Maksimal ${stock} sesuai stok` : 'Stok kosong — cek owner')));
            updateCardTotal(card);
        }

        function updateCardTotal(card) {
            const plan = getPlan(card);
            if (!plan) return;
            const qty = getQuantity(card);
            const totalText = getTotalText(plan, qty);
            const priceEl = $('.price', card),
                mini = $('.mini-total-value', card),
                note = $('.price-unit-note', card),
                qrisBtn = $('.qris-button', card);
            priceEl.textContent = totalText;
            priceEl.classList.toggle('contact-price', !isKnownPrice(plan));
            if (mini) mini.textContent = totalText;
            if (note) note.textContent = isKnownPrice(plan) ? `${qty} × ${getUnitText(plan)}` : `Jumlah ${qty} • harga dikonfirmasi owner`;
            if (qrisBtn) {
                const unlimited = isUnlimitedPlan(plan);
                const unavailable = (!unlimited && (plan.stock == null || Number(plan.stock) <= 0)) || !isKnownPrice(plan);
                const businessLimit = Number(card.dataset.maxPerBusiness) || 0;
                qrisBtn.disabled = unavailable;
                qrisBtn.textContent = !isKnownPrice(plan)
                    ? 'QRIS setelah harga pasti'
                    : (unlimited
                        ? 'Bayar QRIS'
                        : (plan.stock == null
                        ? 'QRIS setelah stok dikonfirmasi'
                        : (Number(plan.stock) <= 0
                        ? 'QRIS setelah stok tersedia'
                        : (businessLimit > 0 ? 'QRIS + Order Telegram' : 'Bayar QRIS'))));
                qrisBtn.title = unavailable
                    ? 'Konfirmasi harga dan stok ke owner terlebih dahulu'
                    : (businessLimit > 0
                        ? 'Buka QRIS, lalu kirim order dan bukti pembayaran melalui Telegram 1 @ZShopAppsJualanAplikasiOriginal atau Telegram 2 @Seller4899'
                        : 'Buka QRIS dan ringkasan pembayaran');
            }
        }

        function choosePlan(card, planId) {
            const list = parsePlans(card, region);
            const plan = list.find(item => item.id === planId) || list[0];
            if (!plan) return;
            card.dataset.selectedPlan = plan.id;
            $$('.plan-option', card).forEach(btn => btn.classList.toggle('active', btn.dataset.planId === plan.id));
            const stockEl = $('.stock', card),
                buyBtn = $('.buy-button', card);
            const businessLimit = Number(card.dataset.maxPerBusiness) || 0;
            const unlimited = isUnlimitedPlan(plan);
            $('.stock-value', card).textContent = businessLimit > 0 ? (card.dataset.productType === "business-portal" ? `Maksimal ${businessLimit} lisensi per bisnis` : `Minimal 1 • maksimal ${businessLimit} paket`) : (unlimited ? 'Stok Unlimited' : (plan.stock == null ? 'Stok belum dicantumkan — hubungi owner' : (Number(plan.stock) > 0 ? `Sisa ${Number(plan.stock)} stok` : 'Stok kosong — cek owner')));
            stockEl.classList.toggle('out', !unlimited && (plan.stock == null || Number(plan.stock) <= 0));
            $('.selected-plan-label', card).textContent = `Paket ${plan.label}`;
            $('.region-label', card).textContent = 'Indonesia';
            buyBtn.textContent = buyBtn.dataset.buyLabel || (!isKnownPrice(plan) ? 'Hubungi Owner' : (businessLimit > 0 ? (card.dataset.productType === "business-portal" ? 'Tambah Preflix Lifetime • Maks 1' : 'Tambah ke Keranjang • Maks 1') : (unlimited || (plan.stock != null && Number(plan.stock) > 0) ? 'Tambah ke Keranjang' : 'Simpan & Tanya Owner')));
            buyBtn.classList.toggle('is-out', (!unlimited && (plan.stock == null || Number(plan.stock) <= 0)) || !isKnownPrice(plan));
            setQuantity(card, getQuantity(card));
        }

        function renderPlans(card) {
            enhanceProductCard(card);
            const plans = parsePlans(card, region),
                wrap = $('.plan-options', card);
            if (!wrap) return;
            wrap.innerHTML = '';
            const pickerLabel = $('.plan-picker-label', card);
            if (pickerLabel && card.classList.contains('expanded-plans')) {
                pickerLabel.textContent = `Pilih paket • ${plans.length} apps`;
            }
            plans.forEach(plan => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'plan-option';
                button.dataset.planId = plan.id;
                button.setAttribute('aria-label', `${plan.label}, ${planPriceText(plan,region)}`);
                button.innerHTML = `<strong>${plan.label}</strong><small>${planPriceText(plan,region)}</small>`;
                button.addEventListener('click', () => choosePlan(card, plan.id));
                wrap.appendChild(button);
            });
            const defaultId = card.dataset.defaultAsia || (plans[0] ? plans[0].id : '');
            const selectedExists = plans.some(plan => plan.id === card.dataset.selectedPlan);
            choosePlan(card, selectedExists ? card.dataset.selectedPlan : defaultId);
        }

        function updateCards() {
            $$('.product-card').forEach(renderPlans)
        }

        $$('[data-region]').forEach(btn => btn.addEventListener('click', () => {
            region = btn.dataset.region;
            $$('[data-region]').forEach(b => b.classList.toggle('active', b === btn));
            $$('.product-card').forEach(card => {
                card.dataset.selectedPlan = '';
                card.dataset.quantity = '1'
            });
            updateCards();
        }));

        function buildOrder(card) {
            const plan = getPlan(card);
            if (!plan) return null;
            const quantity = getQuantity(card);
            return {
                orderCode: createOrderCode(),
                product: card.dataset.name,
                plan: plan.label,
                region: 'Indonesia / IDR',
                quantity,
                stock: isUnlimitedPlan(plan) ? null : Number(plan.stock) || 0,
                unlimited: isUnlimitedPlan(plan),
                unitPrice: getUnitText(plan),
                total: getTotalText(plan, quantity),
                totalValue: getTotalValue(plan, quantity),
                knownPrice: isKnownPrice(plan),
                productType: card.dataset.productType || "app",
                maxPerBusiness: Number(card.dataset.maxPerBusiness) || 0
            };
        }

        $$('[data-buy]').forEach(a => a.addEventListener('click', e => {
            e.preventDefault();
            const card = a.closest('.product-card');
            if (window.ZSHOP_CART) {
                window.ZSHOP_CART.addFromCard(card);
                return;
            }
            const order = buildOrder(card);
            if (!order) return;
            const status = order.unlimited ? 'Stok Unlimited' : (order.stock > 0 ? 'Stok tersedia pada katalog' : 'Stok perlu dikonfirmasi');
            const msg = `Halo ZSHOPAPPS, saya ingin memesan aplikasi premium.

Kode pesanan: ${order.orderCode}
Produk: ${order.product}
Paket: ${order.plan}
Wilayah: ${order.region}
Jumlah beli: ${order.quantity}
Harga satuan: ${order.unitPrice}
Total: ${order.total}
Status: ${status}

Metode pembayaran yang saya pilih: QRIS / konfirmasi ke owner. Mohon konfirmasi pesanan dan ketersediaannya.`;
            window.open(waUrl(msg), '_blank', 'noopener');
        }));

        function openPaymentForCard(card) {
            const order = buildOrder(card);
            if (!order || !order.knownPrice || (!order.unlimited && order.stock <= 0)) return;
            activeOrder = order;
            $('#modalOrderCode').textContent = order.orderCode;
            $('#modalProduct').textContent = order.product;
            $('#modalPlan').textContent = `${order.plan} • ${order.region}`;
            $('#modalQuantity').textContent = String(order.quantity);
            $('#modalUnitPrice').textContent = order.unitPrice;
            $('#modalTotal').textContent = order.total;
            const portalOnly = order.productType === 'business-portal';
            const whatsappConfirm = $('#confirmPaymentBtn');
            const telegramPrimaryConfirm = $('#confirmTelegramPrimaryBtn');
            const telegramSecondaryConfirm = $('#confirmTelegramSecondaryBtn');
            const paymentDisclaimer = document.querySelector('#paymentModal .payment-disclaimer');
            if (whatsappConfirm) whatsappConfirm.hidden = portalOnly;
            if (telegramPrimaryConfirm) telegramPrimaryConfirm.textContent = portalOnly
                ? 'Sudah Bayar • Telegram 1'
                : 'Sudah Bayar • Telegram 1';
            if (telegramSecondaryConfirm) telegramSecondaryConfirm.textContent = portalOnly
                ? 'Sudah Bayar • Telegram 2'
                : 'Sudah Bayar • Telegram 2';
            if (paymentDisclaimer) paymentDisclaimer.textContent = portalOnly
                ? 'Preflix Lifetime: bayar via QRIS atau transfer SeaBank sesuai total, lalu kirim order dan bukti ke Telegram 1 @ZShopAppsJualanAplikasiOriginal atau Telegram 2 @Seller4899.'
                : 'Pembayaran diverifikasi manual oleh owner. Pilih Telegram 1 atau Telegram 2 untuk mengirim detail dan bukti transaksi.';
            const modal = $('#paymentModal');
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            body.classList.add('payment-open');
            setTimeout(() => $('.payment-close', modal).focus(), 30);
        }

        function closePayment() {
            const modal = $('#paymentModal');
            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            body.classList.remove('payment-open');
        }
        $$('[data-close-payment]').forEach(el => el.addEventListener('click', closePayment));

        async function copyText(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true
            } catch (e) {
                const area = document.createElement('textarea');
                area.value = text;
                area.style.position = 'fixed';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                let ok = false;
                try {
                    ok = document.execCommand('copy')
                } catch (err) {}
                area.remove();
                return ok;
            }
        }
        $('#copyTotalBtn').addEventListener('click', async e => {
            if (!activeOrder) return;
            const ok = await copyText(String(activeOrder.totalValue));
            const btn = e.currentTarget,
                old = btn.textContent;
            btn.textContent = ok ? 'Total Disalin' : 'Gagal Menyalin';
            setTimeout(() => btn.textContent = old, 1600);
        });
        $('#copySeaBankAccountBtn')?.addEventListener('click', async e => {
            const ok = await copyText(CONFIG.seabankAccount);
            const old = e.currentTarget.textContent;
            e.currentTarget.textContent = ok ? 'Rekening Disalin' : 'Gagal Menyalin';
            setTimeout(() => e.currentTarget.textContent = old, 1500);
        });
        $('#copySeaBankTotalBtn')?.addEventListener('click', async e => {
            if (!activeOrder) return;
            const ok = await copyText(String(activeOrder.totalValue));
            const old = e.currentTarget.textContent;
            e.currentTarget.textContent = ok ? 'Nominal Disalin' : 'Gagal Menyalin';
            setTimeout(() => e.currentTarget.textContent = old, 1500);
        });

        function selectedModalPaymentMethod() {
            return document.querySelector('input[name="modalPaymentMethod"]:checked')?.value || 'qris';
        }

        function telegramPurchaseUrl(message, slot = "primary") {
            const fallback = slot === "secondary"
                ? "https://t.me/Seller4899"
                : "https://t.me/ZShopAppsJualanAplikasiOriginal";
            const ownerUrl = (slot === "secondary" ? CONFIG.telegramSecondary : CONFIG.telegramPrimary) || fallback;
            return ownerUrl.replace(/\/+$/, "") + "?text=" + encodeURIComponent(message);
        }

        function finishDirectPayment(channel) {
            if (!activeOrder) return;
            if (activeOrder.productType === 'business-portal' && channel === 'whatsapp') channel = 'telegram-primary';

            const greeting = $('#paymentGreeting') ?.value || 'Kakak';
            const paymentMethod = selectedModalPaymentMethod();
            const paymentLabel = paymentMethod === 'seabank' ? 'Transfer Bank SeaBank' : 'QRIS';
            const paymentDestination = paymentMethod === 'seabank' ? CONFIG.seabankDisplay : `QRIS — NMID ${CONFIG.qrisNmid} — ${CONFIG.qrisTerminal}`;
            const thanks = window.ZSHOP_COMPLETION ?
                window.ZSHOP_COMPLETION.makeThankYou(greeting) :
                `Terima kasih sudah berkunjung dan mampir beli di ZSHOPAPPS. Semoga ${greeting} sehat selalu dan rezekinya semakin lancar.`;

            const msg = `Halo ZSHOPAPPS, saya sudah melakukan pembayaran melalui ${paymentLabel}.

Kode pesanan: ${activeOrder.orderCode}
Produk: ${activeOrder.product}
Paket: ${activeOrder.plan}
Wilayah: ${activeOrder.region}
Jumlah beli: ${activeOrder.quantity}
Harga satuan: ${activeOrder.unitPrice}
Total dibayar: ${activeOrder.total}
Metode pembayaran: ${paymentLabel}
Tujuan pembayaran: ${paymentDestination}

Mohon verifikasi pembayaran. Saya akan mengirim bukti transaksi pada chat ini.

--- UCAPAN OTOMATIS WEBSITE ZSHOPAPPS ---
${thanks}`;

            const whatsappUrl = waUrl(msg);
            const telegramPrimaryUrl = telegramPurchaseUrl(msg, "primary");
            const telegramSecondaryUrl = telegramPurchaseUrl(msg, "secondary");

            try {
                localStorage.setItem(
                    'zshopappsLastDirectPurchaseV1',
                    JSON.stringify({
                        type: 'pembayaran-mandiri',
                        completedAt: new Date().toISOString(),
                        greeting,
                        channel,
                        order: activeOrder
                    })
                );
            } catch (error) {}

            if (window.ZSHOP_COMPLETION) {
                window.ZSHOP_COMPLETION.open({
                    greeting,
                    thanks,
                    code: activeOrder.orderCode,
                    whatsappUrl,
                    telegramPrimaryUrl,
                    telegramSecondaryUrl,
                    telegramUrl: telegramPrimaryUrl
                });
            }

            const destination = channel === 'telegram-secondary'
                ? telegramSecondaryUrl
                : channel === 'telegram-primary'
                    ? telegramPrimaryUrl
                    : whatsappUrl;
            window.open(destination, '_blank', 'noopener');
        }

        $('#confirmPaymentBtn').addEventListener(
            'click',
            () => finishDirectPayment('whatsapp')
        );
        $('#confirmTelegramPrimaryBtn').addEventListener(
            'click',
            () => finishDirectPayment('telegram-primary')
        );
        $('#confirmTelegramSecondaryBtn').addEventListener(
            'click',
            () => finishDirectPayment('telegram-secondary')
        );


        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                closeMenu();
                closePayment()
            }
        });

        function updateVisibleProductCount() {
            const visible = $$('#productGrid .product-card').filter(c => !c.hidden).length;
            const counter = $('#visibleProductCount');
            if (counter) counter.textContent = String(visible);
            $('#emptyState').style.display = visible ? 'none' : 'block';
        }
        $('#searchInput').addEventListener('input', e => {
            const q = e.target.value.trim().toLowerCase();
            $$('.product-card').forEach(c => {
                const ok = c.dataset.name.toLowerCase().includes(q) || c.textContent.toLowerCase().includes(q);
                c.hidden = !ok
            });
            updateVisibleProductCount();
        });

        updateCards();
        updateVisibleProductCount();
        $('#year').textContent = new Date().getFullYear();
