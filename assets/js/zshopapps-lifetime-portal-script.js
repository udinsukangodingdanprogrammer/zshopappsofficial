(function() {
    "use strict";
    const PRICE = 300000;
    const MAX_QTY = 1;
    const TELEGRAM_OWNERS = {
        primary: { username: "ZShopAppsJualanAplikasiOriginal", url: "https://t.me/ZShopAppsJualanAplikasiOriginal" },
        secondary: { username: "Seller4899", url: "https://t.me/Seller4899" }
    };
    const PRODUCT_NAME = "ZSHOPAPPS Preflix Lifetime — Portal Digital";
    const LICENSE_NAME = "Lifetime / permanen";

    const qtyInput = document.getElementById("lifetimeQtyInput");
    const qtyMinus = document.getElementById("lifetimeQtyMinus");
    const qtyPlus = document.getElementById("lifetimeQtyPlus");
    const totalNode = document.getElementById("lifetimeTotal");
    const buyButton = document.getElementById("lifetimeBuyButton");
    const modal = document.getElementById("lifetimeCheckoutModal");
    const orderCodeNode = document.getElementById("lifetimeOrderCode");
    const orderQtyNode = document.getElementById("lifetimeOrderQty");
    const orderTotalNode = document.getElementById("lifetimeOrderTotal");
    const orderTelegramPrimary = document.getElementById("lifetimeOrderTelegramPrimary");
    const orderTelegramSecondary = document.getElementById("lifetimeOrderTelegramSecondary");
    const paidTelegramPrimary = document.getElementById("lifetimePaidTelegramPrimary");
    const paidTelegramSecondary = document.getElementById("lifetimePaidTelegramSecondary");
    const imageModal = document.getElementById("lifetimeImageModal");
    const imagePreview = document.getElementById("lifetimeImagePreview");
    let currentOrderCode = "";

    if (!qtyInput || !modal) return;

    const formatIDR = value => "Rp" + new Intl.NumberFormat("id-ID").format(value);
    const clampQty = value => Math.min(MAX_QTY, Math.max(1, Math.floor(Number(value) || 1)));
    const currentQty = () => clampQty(qtyInput.value);
    const currentTotal = () => PRICE * currentQty();

    function makeOrderCode() {
        const date = new Date();
        const pad = value => String(value).padStart(2, "0");
        return "ZPL-" + date.getFullYear() + pad(date.getMonth() + 1) + pad(date.getDate()) + "-" + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
    }

    function telegramDirectUrl(message, slot = "primary") {
        const owner = TELEGRAM_OWNERS[slot] || TELEGRAM_OWNERS.primary;
        return owner.url.replace(/\/+$/, "") + "?text=" + encodeURIComponent(message);
    }

    function syncQuantity(value) {
        const qty = clampQty(value);
        qtyInput.value = String(qty);
        qtyMinus.disabled = qty <= 1;
        qtyPlus.disabled = qty >= MAX_QTY;
        totalNode.textContent = formatIDR(PRICE * qty);
        orderQtyNode.textContent = String(qty);
        orderTotalNode.textContent = formatIDR(PRICE * qty);
    }

    function buildOrderMessage() {
        return [
            "Halo Owner ZSHOPAPPS, saya ingin membeli produk berikut:",
            "",
            "Kode pesanan: " + currentOrderCode,
            "Produk: " + PRODUCT_NAME,
            "Lisensi: " + LICENSE_NAME,
            "Jumlah lisensi: " + currentQty(),
            "Harga satuan: " + formatIDR(PRICE),
            "Total: " + formatIDR(currentTotal()),
            "",
            "Kegunaan utama:",
            "- Portal katalog layanan digital mobile-friendly",
            "- Menu pulsa, paket data, game, e-wallet, PLN, tagihan, marketing, dan jasa",
            "- Tombol pembelian diarahkan ke Telegram owner",
            "",
            "Mohon konfirmasi ruang lingkup file, ketentuan lisensi lifetime, bantuan instalasi, custom branding, domain/hosting, integrasi teknis, dan metode pembayaran sebelum saya transfer."
        ].join("\n");
    }

    function buildPaidMessage() {
        return [
            "Halo Owner ZSHOPAPPS, saya sudah melakukan pembayaran sesuai arahan owner.",
            "",
            "Kode pesanan: " + currentOrderCode,
            "Produk: " + PRODUCT_NAME,
            "Lisensi: " + LICENSE_NAME,
            "Jumlah lisensi: " + currentQty(),
            "Harga satuan: " + formatIDR(PRICE),
            "Total dibayar: " + formatIDR(currentTotal()),
            "",
            "Saya akan mengirim bukti pembayaran di chat ini. Mohon verifikasi manual dan proses pengiriman file/panduan setelah pembayaran dinyatakan valid."
        ].join("\n");
    }

    function openCheckout() {
        currentOrderCode = makeOrderCode();
        orderCodeNode.textContent = currentOrderCode;
        syncQuantity(currentQty());
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("lifetime-modal-open");
        setTimeout(() => modal.querySelector(".lifetime-dialog-close")?.focus(), 30);
    }

    function closeCheckout() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        if (!imageModal.classList.contains("is-open")) document.body.classList.remove("lifetime-modal-open");
    }

    function openGenericTelegram(slot = "primary") {
        const message = "Halo Owner ZSHOPAPPS, saya ingin bertanya tentang ZSHOPAPPS Preflix Lifetime Portal Digital dengan lisensi lifetime mulai Rp300.000.";
        window.open(telegramDirectUrl(message, slot), "_blank", "noopener");
    }

    qtyMinus.addEventListener("click", () => syncQuantity(currentQty() - 1));
    qtyPlus.addEventListener("click", () => syncQuantity(currentQty() + 1));
    qtyInput.addEventListener("input", event => syncQuantity(event.target.value));
    qtyInput.addEventListener("blur", () => syncQuantity(currentQty()));
    buyButton.addEventListener("click", () => {
        const portalCard = Array.from(document.querySelectorAll("#productGrid .product-card")).find(card => card.dataset.productType === "business-portal");
        if (portalCard && window.ZSHOP_CART) {
            window.ZSHOP_CART.addFromCard(portalCard);
            window.ZSHOP_CART.open();
            return;
        }
        openCheckout();
    });
    document.querySelectorAll("[data-lifetime-telegram]").forEach(button => button.addEventListener("click", () => openGenericTelegram(button.dataset.lifetimeTelegram || "primary")));
    document.querySelectorAll("[data-lifetime-checkout-close]").forEach(element => element.addEventListener("click", closeCheckout));

    orderTelegramPrimary.addEventListener("click", () => {
        if (!currentOrderCode) currentOrderCode = makeOrderCode();
        window.open(telegramDirectUrl(buildOrderMessage(), "primary"), "_blank", "noopener");
    });
    orderTelegramSecondary.addEventListener("click", () => {
        if (!currentOrderCode) currentOrderCode = makeOrderCode();
        window.open(telegramDirectUrl(buildOrderMessage(), "secondary"), "_blank", "noopener");
    });

    function finishLifetimePayment(slot = "primary") {
        if (!currentOrderCode) currentOrderCode = makeOrderCode();
        const telegramPrimaryUrl = telegramDirectUrl(buildPaidMessage(), "primary");
        const telegramSecondaryUrl = telegramDirectUrl(buildPaidMessage(), "secondary");
        const telegramUrl = slot === "secondary" ? telegramSecondaryUrl : telegramPrimaryUrl;
        try {
            localStorage.setItem("zshopappsLifetimeLastOrderV1", JSON.stringify({
                completedAt: new Date().toISOString(),
                orderCode: currentOrderCode,
                product: PRODUCT_NAME,
                license: LICENSE_NAME,
                quantity: currentQty(),
                unitPrice: PRICE,
                total: currentTotal(),
                telegram: slot === "secondary" ? "@Seller4899" : "@ZShopAppsJualanAplikasiOriginal"
            }));
        } catch (error) {}

        if (window.ZSHOP_COMPLETION) {
            const thanks = "Terima kasih sudah membeli ZSHOPAPPS Preflix Lifetime. Bukti pembayaran dan detail pesanan sudah disiapkan untuk dikirim ke Telegram owner. Pesanan diproses setelah verifikasi manual.";
            window.ZSHOP_COMPLETION.open({
                greeting: "Kakak",
                thanks,
                code: currentOrderCode,
                telegramPrimaryUrl,
                telegramSecondaryUrl,
                telegramUrl: telegramPrimaryUrl,
                whatsappUrl: ""
            });
        }
        window.open(telegramUrl, "_blank", "noopener");
    }

    paidTelegramPrimary.addEventListener("click", () => finishLifetimePayment("primary"));
    paidTelegramSecondary.addEventListener("click", () => finishLifetimePayment("secondary"));

    document.querySelectorAll("[data-lifetime-gallery]").forEach(button => {
        button.addEventListener("click", () => {
            imagePreview.src = button.dataset.lifetimeGallery;
            imagePreview.alt = button.querySelector("img")?.alt || "Pratinjau portal digital";
            imageModal.classList.add("is-open");
            imageModal.setAttribute("aria-hidden", "false");
            document.body.classList.add("lifetime-modal-open");
        });
    });

    function closeImage() {
        imageModal.classList.remove("is-open");
        imageModal.setAttribute("aria-hidden", "true");
        if (!modal.classList.contains("is-open")) document.body.classList.remove("lifetime-modal-open");
    }
    document.querySelectorAll("[data-lifetime-image-close]").forEach(element => element.addEventListener("click", closeImage));

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        if (imageModal.classList.contains("is-open")) closeImage();
        else if (modal.classList.contains("is-open")) closeCheckout();
    });

    syncQuantity(1);
})();
