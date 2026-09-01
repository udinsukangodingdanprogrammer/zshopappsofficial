        (function() {
                "use strict";

                const WHATSAPP_NUMBER = "6283175713697";
                const TELEGRAM_OWNER_URLS = {
                    primary: "https://t.me/ZShopAppsJualanAplikasiOriginal",
                    secondary: "https://t.me/Seller4899"
                };
                const SEABANK_ACCOUNT = "901297235411";
                const SEABANK_ACCOUNT_NAME = "Sutini";
                const SEABANK_DISPLAY = "SeaBank — 901297235411 — Sutini";
                const STORAGE_KEY = "zshopappsPersistentCartV1";
                const LAST_ORDER_KEY = "zshopappsLastCompletedOrderV1";
                const GREETING_KEY = "zshopappsCustomerGreetingV1";
                const BUSINESS_LOCK_KEY = "zshopappsPortalBusinessLocksV1";

                const modal = document.getElementById("cartModal");
                const cartBtn = document.getElementById("cartBtn");
                const quickbar = document.getElementById("cartQuickbar");
                const badge = document.getElementById("cartBadge");
                const drawerCount = document.getElementById("drawerCartCount");
                const quickCount = document.getElementById("cartQuickCount");
                const quickTotal = document.getElementById("cartQuickTotal");
                const empty = document.getElementById("cartEmpty");
                const content = document.getElementById("cartContent");
                const itemsNode = document.getElementById("cartItems");
                const totalQuantityNode = document.getElementById("cartTotalQuantity");
                const totalIdrNode = document.getElementById("cartTotalIdr");
                const idrRow = document.getElementById("cartIdrRow");
                const unknownRow = document.getElementById("cartUnknownRow");
                const unknownCountNode = document.getElementById("cartUnknownCount");
                const grandTotalNode = document.getElementById("cartGrandTotal");
                const grandNoteNode = document.getElementById("cartGrandNote");
                const checkoutButton = document.getElementById("cartWhatsApp");
                const telegramCheckoutPrimaryButton = document.getElementById("cartTelegramPrimary");
                const telegramCheckoutSecondaryButton = document.getElementById("cartTelegramSecondary");
                const paidButton = document.getElementById("cartPaidButton");
                const paidTelegramPrimaryButton = document.getElementById("cartPaidTelegramPrimary");
                const paidTelegramSecondaryButton = document.getElementById("cartPaidTelegramSecondary");
                const clearButton = document.getElementById("cartClear");
                const finishClearButton = document.getElementById("cartFinishClear");
                const greetingSelect = document.getElementById("cartGreeting");
                const thanksPanel = document.getElementById("ownerThanks");
                const thanksText = document.getElementById("ownerThanksText");
                const qrisPreview = document.getElementById("cartQrisPreview");
                const qrisLightbox = document.getElementById("cartQrisLightbox");
                const businessField = document.getElementById("cartPreflixRegistration");
                const buyerInput = document.getElementById("cartBuyerName");
                const businessInput = document.getElementById("cartBusinessName");
                const telegramDisplayNameInput = document.getElementById("cartTelegramDisplayName");
                const telegramUsernameInput = document.getElementById("cartTelegramUsername");
                const businessTypeSelect = document.getElementById("cartBusinessType");
                const telegramPurposeSelect = document.getElementById("cartTelegramPurpose");
                const telegramOwnershipInput = document.getElementById("cartTelegramOwnership");
                const telegramLinkPreview = document.getElementById("cartTelegramLinkPreview");
                const channelNotice = document.getElementById("cartChannelNotice");
                const cartCopySeaBankAccount = document.getElementById("cartCopySeaBankAccount");
                const cartCopySeaBankTotal = document.getElementById("cartCopySeaBankTotal");

                let cart = loadCart();
                let lastCheckoutCode = "";

                function clamp(value, min, max) {
                    return Math.max(min, Math.min(max, value));
                }

                function formatIDR(value) {
                    return "Rp" + new Intl.NumberFormat("id-ID").format(
                        Math.max(0, Number(value) || 0)
                    );
                }

                function escapeHtml(value) {
                    return String(value ?? "")
                        .replaceAll("&", "&amp;")
                        .replaceAll("<", "&lt;")
                        .replaceAll(">", "&gt;")
                        .replaceAll('"', "&quot;")
                        .replaceAll("'", "&#039;");
                }

                function cartKey(item) {
                    return [item.product, item.plan, item.region].join("::");
                }

                function productCardByName(name) {
                    return Array.from(document.querySelectorAll(".product-card"))
                        .find(card => card.dataset.name === name) || null;
                }

                function productMeta(item) {
                    const card = productCardByName(item.product);
                    const image = card ?.querySelector(".product-head img") ?.src || "";
                    const category =
                        card ?.querySelector(".product-head p") ?.textContent ?.trim() ||
                        item.category ||
                        "Aplikasi Premium";
                    const features = Array.from(card ?.querySelectorAll("ul li") || [])
                        .map(node => node.textContent.replace(/^✓\s*/, "").trim())
                        .filter(Boolean)
                        .slice(0, 3);
                    const appIndex = Number(card ?.dataset.appIndex) || item.appIndex || 0;
                    return {
                        image,
                        category,
                        features,
                        appIndex
                    };
                }

                function loadCart() {
                    try {
                        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
                        const items = Array.isArray(parsed) ?
                            parsed.filter(item =>
                                item && item.product && item.plan &&
                                item.currency !== "USD" &&
                                !String(item.region || "").includes("Global")
                            ) :
                            [];
                        return items.map(item => {
                            const unlimitedProducts = new Set(["Gemini Pro", "ChatGPT Plus", "Netflix VIP", "CapCut Pro", "Canva Pro", "Alight Motion Pro", "YouTube Premium", "WeTV VIP", "Loklok Premium", "Viu VIP", "HBO Max Ultimate", "Prime Video VIP", "Disney+", "Spotify Premium", "Crunchyroll VIP", "Apple Music VIP", "Zoom Premium", "Youku VIP", "Bstation Premium", "iQIYI VIP", "ZSHOPAPPS Portal Extension Educational", "ZSHOPAPPS Portal Extension Premium", "ZSHOPAPPS Portal Extension Exclusift", "ZSHOPAPPS Card Premium", "ZSHOPAPPS Card Premium+Pro", "ZSHOPAPPS Card Premium+Pro+Phantom"]);
                            if (unlimitedProducts.has(item.product)) {
                                item.unlimited = true;
                                item.stock = null;
                                item.maxPerBusiness = 0;
                            }
                            return item;
                        });
                    } catch (error) {
                        return [];
                    }
                }

                function saveCart() {
                    try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
                    } catch (error) {}
                }

                function makeCheckoutCode() {
                    const date = new Date();
                    const pad = value => String(value).padStart(2, "0");
                    return "ZC-" +
                        date.getFullYear() +
                        pad(date.getMonth() + 1) +
                        pad(date.getDate()) + "-" +
                        pad(date.getHours()) +
                        pad(date.getMinutes()) +
                        pad(date.getSeconds());
                }

                function hasPortalItem() {
                    return cart.some(item => item.productType === "business-portal" || item.product === "ZSHOPAPPS Preflix Lifetime");
                }

                function normalizeBusinessName(value) {
                    return String(value || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("id-ID");
                }

                function normalizeTelegramUsername(value) {
                    return String(value || "").trim().replace(/^@+/, "");
                }

                function isValidTelegramUsername(value) {
                    const username = normalizeTelegramUsername(value);
                    return /^(?![0-9])[A-Za-z0-9_]{5,32}$/.test(username);
                }

                function telegramProfileUrl(value) {
                    const username = normalizeTelegramUsername(value);
                    return username ? "https://t.me/" + username : "";
                }

                function portalCustomerProfile() {
                    const username = normalizeTelegramUsername(telegramUsernameInput?.value);
                    return {
                        buyerName: buyerInput?.value?.trim() || "",
                        businessName: businessInput?.value?.trim() || "",
                        telegramDisplayName: telegramDisplayNameInput?.value?.trim() || "",
                        telegramUsername: username,
                        telegramUrl: telegramProfileUrl(username),
                        businessType: businessTypeSelect?.value || "Produk Digital",
                        telegramPurpose: telegramPurposeSelect?.value || "Pesanan pelanggan",
                        accountOwnershipConfirmed: Boolean(telegramOwnershipInput?.checked)
                    };
                }

                function portalCustomerLines() {
                    if (!hasPortalItem()) return [];
                    const profile = portalCustomerProfile();
                    return [
                        "DATA PENDAFTARAN PREFLIX",
                        `Nama pembeli: ${profile.buyerName || "-"}`,
                        `Nama bisnis: ${profile.businessName || "-"}`,
                        `Nama Telegram: ${profile.telegramDisplayName || "-"}`,
                        `Username Telegram: ${profile.telegramUsername ? "@" + profile.telegramUsername : "-"}`,
                        `Link Telegram: ${profile.telegramUrl || "-"}`,
                        `Jenis usaha: ${profile.businessType}`,
                        `Kebutuhan Telegram: ${profile.telegramPurpose}`,
                        "Kepemilikan akun: dikonfirmasi oleh pelanggan"
                    ];
                }

                function syncTelegramUsernameUi() {
                    if (!telegramUsernameInput || !telegramLinkPreview) return;
                    const username = normalizeTelegramUsername(telegramUsernameInput.value);
                    const valid = isValidTelegramUsername(username);
                    const url = valid ? telegramProfileUrl(username) : "";
                    telegramUsernameInput.setCustomValidity(username && !valid ? "Username Telegram harus 5–32 karakter, hanya huruf, angka, atau _, dan tidak boleh diawali angka." : "");
                    telegramLinkPreview.textContent = url || "Isi @username untuk membuat link t.me";
                    telegramLinkPreview.href = url || "#";
                    telegramLinkPreview.setAttribute("aria-disabled", url ? "false" : "true");
                }

                function loadBusinessLocks() {
                    try {
                        const parsed = JSON.parse(localStorage.getItem(BUSINESS_LOCK_KEY) || "[]");
                        return Array.isArray(parsed) ? parsed : [];
                    } catch (error) {
                        return [];
                    }
                }

                function validateBusinessPurchase(showAlert = true) {
                    if (!hasPortalItem()) return true;
                    const profile = portalCustomerProfile();
                    if (profile.buyerName.length < 2) {
                        if (showAlert) window.alert("Masukkan nama pembeli / pemilik sebelum checkout Preflix.");
                        buyerInput?.focus();
                        return false;
                    }
                    if (profile.businessName.length < 3) {
                        if (showAlert) window.alert("Masukkan nama bisnis minimal 3 karakter sebelum checkout portal.");
                        businessInput?.focus();
                        return false;
                    }
                    const normalized = normalizeBusinessName(profile.businessName);
                    if (loadBusinessLocks().includes(normalized)) {
                        if (showAlert) window.alert("Nama bisnis ini sudah tercatat membeli portal pada perangkat ini. Maksimal satu lisensi per bisnis. Hubungi owner untuk verifikasi atau perubahan lisensi.");
                        businessInput?.focus();
                        return false;
                    }
                    if (profile.telegramDisplayName.length < 2) {
                        if (showAlert) window.alert("Masukkan Nama Telegram yang tampil pada profil pelanggan.");
                        telegramDisplayNameInput?.focus();
                        return false;
                    }
                    if (!isValidTelegramUsername(profile.telegramUsername)) {
                        if (showAlert) window.alert("Username Telegram harus 5–32 karakter, hanya huruf, angka, atau garis bawah (_), dan tidak boleh diawali angka. Boleh diketik dengan atau tanpa @.");
                        telegramUsernameInput?.focus();
                        return false;
                    }
                    if (!profile.accountOwnershipConfirmed) {
                        if (showAlert) window.alert("Centang konfirmasi bahwa akun Telegram adalah milik pelanggan dan dapat diakses.");
                        telegramOwnershipInput?.focus();
                        return false;
                    }
                    return true;
                }

                function lockBusinessPurchase() {
                    if (!hasPortalItem()) return;
                    const normalized = normalizeBusinessName(businessInput?.value);
                    if (!normalized) return;
                    const locks = loadBusinessLocks();
                    if (!locks.includes(normalized)) locks.push(normalized);
                    try { localStorage.setItem(BUSINESS_LOCK_KEY, JSON.stringify(locks)); } catch (error) {}
                }

                function totals() {
                    return cart.reduce((summary, item) => {
                        const quantity = Math.max(1, Number(item.quantity) || 1);
                        summary.quantity += quantity;

                        if (item.knownPrice && Number.isFinite(Number(item.unitValue))) {
                            const value = Number(item.unitValue) * quantity;
                            summary.idr += value;
                        } else {
                            summary.unknownQuantity += quantity;
                            summary.unknownLines += 1;
                        }
                        return summary;
                    }, {
                        quantity: 0,
                        idr: 0,
                        unknownQuantity: 0,
                        unknownLines: 0
                    });
                }

                function itemTotalText(item) {
                    if (!item.knownPrice || !Number.isFinite(Number(item.unitValue))) {
                        return "Hubungi Owner";
                    }
                    const total = Number(item.unitValue) * Number(item.quantity);
                    return formatIDR(total);
                }

                function unitPriceText(item) {
                    if (!item.knownPrice || !Number.isFinite(Number(item.unitValue))) {
                        return "Konfirmasi owner";
                    }
                    return formatIDR(item.unitValue);
                }

                function summaryText(summary) {
                    const parts = [];
                    if (summary.idr > 0) parts.push(formatIDR(summary.idr));
                    if (summary.unknownLines > 0) {
                        parts.push(summary.unknownLines + " harga owner");
                    }
                    return parts.length ? parts.join(" + ") : "Rp0";
                }

                function render() {
                    const summary = totals();
                    const hasItems = cart.length > 0;
                    const containsPortal = hasPortalItem();
                    const summaryHasUnknown = summary.unknownLines > 0;

                    document.body.classList.toggle("has-cart-items", hasItems);
                    document.body.classList.toggle("cart-has-portal", containsPortal);
                    if (businessField) businessField.hidden = !containsPortal;
                    if (channelNotice) channelNotice.hidden = !containsPortal;
                    if (checkoutButton) {
                        checkoutButton.disabled = containsPortal;
                        checkoutButton.title = containsPortal ? "Produk portal wajib checkout melalui Telegram" : "Checkout melalui WhatsApp";
                    }
                    if (paidButton) {
                        paidButton.disabled = containsPortal || summaryHasUnknown;
                        paidButton.title = containsPortal ? "Bukti portal wajib melalui Telegram" : (summaryHasUnknown ? "Konfirmasi harga terlebih dahulu" : "Selesaikan melalui WhatsApp");
                    }
                    if (telegramCheckoutPrimaryButton) {
                        telegramCheckoutPrimaryButton.disabled = false;
                        telegramCheckoutPrimaryButton.title = summaryHasUnknown ? "Kirim keranjang ke Telegram 1 untuk konfirmasi harga sebelum QRIS" : "Checkout melalui Telegram 1";
                    }
                    if (telegramCheckoutSecondaryButton) {
                        telegramCheckoutSecondaryButton.disabled = false;
                        telegramCheckoutSecondaryButton.title = summaryHasUnknown ? "Kirim keranjang ke Telegram 2 untuk konfirmasi harga sebelum QRIS" : "Checkout melalui Telegram 2";
                    }
                    if (paidTelegramPrimaryButton) paidTelegramPrimaryButton.disabled = summaryHasUnknown;
                    if (paidTelegramSecondaryButton) paidTelegramSecondaryButton.disabled = summaryHasUnknown;

                    badge.textContent = String(summary.quantity);
                    badge.classList.toggle("is-empty", !hasItems);
                    if (drawerCount) drawerCount.textContent = "[" + summary.quantity + "]";

                    quickbar.hidden = !hasItems;
                    quickCount.textContent =
                        summary.quantity + " item • " + cart.length + " produk";
                    quickTotal.textContent = summaryText(summary);

                    empty.hidden = hasItems;
                    content.hidden = !hasItems;

                    if (!hasItems) {
                        itemsNode.innerHTML = "";
                        thanksPanel.hidden = true;
                        return;
                    }

                    itemsNode.innerHTML = cart.map((item, index) => {
                                const meta = productMeta(item);
                                const unlimited = isUnlimitedItem(item);
                                const max = Number(item.maxPerBusiness) > 0 ? Number(item.maxPerBusiness) : (unlimited ? MAX_SAFE_QUANTITY : (item.stock > 0 ? item.stock : 99));
                                const stockText = Number(item.maxPerBusiness) > 0 ? "Maksimal 1 per bisnis" : (unlimited ? "Stok Unlimited" : (item.stock > 0 ?
                                    "Tersedia " + item.stock :
                                    "Perlu dikonfirmasi"));
                                const featureHtml = meta.features.length ?
                                    `<div class="cart-item-features">${meta.features
            .map(feature=>`<i>✓ ${escapeHtml(feature)}</i>`)
            .join("")}</div>`
        :"";

      return `
        <article class="cart-item ${item.productType === "business-portal" ? "business-cart-item" : ""}" data-cart-key="${escapeHtml(item.key)}">
          <div class="cart-item-media">
            ${meta.image
              ?`<img alt="Logo ${escapeHtml(item.product)}"
                      src="${escapeHtml(meta.image)}"/>`
              :`<strong>${escapeHtml(item.product.charAt(0))}</strong>`}
            <span>${String(index+1).padStart(2,"0")}</span>
          </div>

          <div class="cart-item-copy">
            <strong>${escapeHtml(item.product)}</strong>
            <span class="cart-item-category">
              ${escapeHtml(meta.category)}
            </span>

            <div class="cart-item-detail-grid">
              <span>
                <b>Paket</b>
                ${escapeHtml(item.plan)}
              </span>
              <span>
                <b>Wilayah</b>
                ${escapeHtml(item.region)}
              </span>
              <span>
                <b>Harga satuan</b>
                ${escapeHtml(unitPriceText(item))}
              </span>
              <span>
                <b>Status stok</b>
                ${escapeHtml(stockText)}
              </span>
            </div>

            ${featureHtml}
          </div>

          <div class="cart-item-right">
            <strong class="cart-item-price">
              ${escapeHtml(itemTotalText(item))}
            </strong>
            <small>
              ${item.quantity} × ${escapeHtml(unitPriceText(item))}
            </small>

            <div class="cart-item-controls">
              <button aria-label="Kurangi jumlah"
                      data-cart-action="minus"
                      type="button">−</button>
              <b>${item.quantity}</b>
              <button aria-label="Tambah jumlah"
                      data-cart-action="plus"
                      ${!unlimited && item.quantity>=max?"disabled":""}
                      type="button">+</button>
              <button class="cart-remove"
                      data-cart-action="remove"
                      type="button">Hapus</button>
            </div>
          </div>
        </article>
      `;
    }).join("");

    totalQuantityNode.textContent=String(summary.quantity);
    totalIdrNode.textContent=formatIDR(summary.idr);
    idrRow.hidden=false;
    unknownRow.hidden=summary.unknownLines<=0;
    unknownCountNode.textContent=
      summary.unknownQuantity+" item / "+
      summary.unknownLines+" produk";
    grandTotalNode.textContent=summaryText(summary);

    grandNoteNode.textContent=summary.unknownLines>0
      ?"Harga yang belum pasti akan dikonfirmasi owner melalui WhatsApp."
      :"Semua harga pada keranjang sudah dihitung otomatis.";
  }

  function openCart(){
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("cart-open");
    cartBtn?.setAttribute("aria-expanded","true");
    quickbar?.setAttribute("aria-expanded","true");
    setTimeout(()=>modal.querySelector(".cart-close")?.focus(),30);
  }

  function closeCart(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("cart-open");
    cartBtn?.setAttribute("aria-expanded","false");
    quickbar?.setAttribute("aria-expanded","false");
  }

  function openQris(){
    qrisLightbox.classList.add("is-open");
    qrisLightbox.setAttribute("aria-hidden","false");
  }

  function closeQris(){
    qrisLightbox.classList.remove("is-open");
    qrisLightbox.setAttribute("aria-hidden","true");
  }

  function flashAdded(card){
    const button=card?.querySelector(".buy-button");
    if(!button)return;
    button.textContent="✓ Detail Tersimpan di Keranjang";
    button.classList.add("cart-added");

    setTimeout(()=>{
      button.classList.remove("cart-added");
      const stockText=
        card.querySelector(".stock-value")?.textContent||"";
      button.textContent=button.dataset.buyLabel || (stockText.includes("kosong")
        ?"Simpan & Tanya Owner"
        :"Tambah ke Keranjang");
    },1300);
  }

  function addFromCard(card){
    if(!card||typeof buildOrder!=="function")return;
    const order=buildOrder(card);
    if(!order)return;

    const currency="IDR";
    const unitValue=
      order.knownPrice&&order.totalValue!==null
        ?Number(order.totalValue)/
          Math.max(1,Number(order.quantity))
        :null;

    const item={
      product:order.product,
      plan:order.plan,
      region:order.region,
      currency,
      quantity:Math.max(1,Number(order.quantity)||1),
      stock:order.unlimited?null:Math.max(0,Number(order.stock)||0),
      unlimited:Boolean(order.unlimited),
      unitPrice:order.unitPrice,
      unitValue,
      knownPrice:Boolean(order.knownPrice),
      category:
        card.querySelector(".product-head p")?.textContent?.trim()||
        "Aplikasi Premium",
      appIndex:Number(card.dataset.appIndex)||0,
      productType:order.productType||card.dataset.productType||"app",
      maxPerBusiness:Number(order.maxPerBusiness||card.dataset.maxPerBusiness)||0,
      addedAt:new Date().toISOString()
    };

    if(item.maxPerBusiness>0){
      item.quantity=1;
      cart=cart.filter(existing=>existing.product!==item.product);
    }
    item.key=cartKey(item);
    const index=cart.findIndex(existing=>existing.key===item.key);

    if(index>=0){
      cart[index]={...cart[index],...item};
    }else{
      cart.push(item);
    }

    saveCart();
    render();
    flashAdded(card);
  }

  function changeQuantity(key,delta){
    const item=cart.find(entry=>entry.key===key);
    if(!item)return;
    const unlimited = isUnlimitedItem(item);

    item.quantity=clamp(
      Number(item.quantity)+Number(delta),
      1,
      item.maxPerBusiness>0?item.maxPerBusiness:(unlimited?MAX_SAFE_QUANTITY:(item.stock>0?item.stock:99))
    );
    saveCart();
    render();
  }

  function removeItem(key){
    cart=cart.filter(item=>item.key!==key);
    saveCart();
    render();
  }

  function buildOrderLines(){
    return cart.map((item,index)=>[
      `${index+1}. ${item.product}`,
      `   Paket: ${item.plan}`,
      `   Wilayah: ${item.region}`,
      `   Jumlah beli: ${item.quantity}`,
      `   Harga satuan: ${unitPriceText(item)}`,
      `   Subtotal produk: ${itemTotalText(item)}`,
      `   Status: ${item.maxPerBusiness>0
        ?"Maksimal 1 lisensi per bisnis"
        :(isUnlimitedItem(item) ? "Stok Unlimited" : (item.stock > 0 ? "Tersedia " + item.stock : "Perlu dikonfirmasi"))}`
    ].join("\n")).join("\n\n");
  }

  function buildTotalsLines(summary){
    return [
      `Total jenis produk: ${cart.length}`,
      `Total jumlah beli: ${summary.quantity}`,
      summary.idr>0
        ?`Subtotal IDR: ${formatIDR(summary.idr)}`
        :null,
      summary.unknownLines>0
        ?`Harga belum pasti: ${summary.unknownLines} produk / `+
          `${summary.unknownQuantity} item`
        :null
    ].filter(Boolean).join("\n");
  }

  function openWhatsApp(message){
    const url=
      "https://wa.me/"+WHATSAPP_NUMBER+
      "?text="+encodeURIComponent(message);
    window.open(url,"_blank","noopener");
  }

  function telegramShareUrl(message, slot="primary"){
    const ownerUrl=TELEGRAM_OWNER_URLS[slot]||TELEGRAM_OWNER_URLS.primary;
    return ownerUrl.replace(/\/+$/,"")+
      "?text="+encodeURIComponent(message);
  }

  function openTelegram(message, slot="primary"){
    window.open(telegramShareUrl(message,slot),"_blank","noopener");
  }

  function selectedCartPaymentMethod(){
    return document.querySelector('input[name="cartPaymentMethod"]:checked')?.value || 'qris';
  }

  function cartPaymentLines(){
    const method=selectedCartPaymentMethod();
    return method==='seabank'
      ?['Metode pembayaran: Transfer Bank SeaBank',SEABANK_DISPLAY]
      :['Metode pembayaran: QRIS',`QRIS — ZSHOPAPPS — NMID ID1025446351823 — A01`];
  }

  function buildCheckoutMessage(){
    const summary=totals();
    lastCheckoutCode=makeCheckoutCode();
    const portalLines=portalCustomerLines();

    return [
      "Halo ZSHOPAPPS, saya ingin checkout keranjang gabungan ZSHOPAPPS.",
      "",
      `Kode keranjang: ${lastCheckoutCode}`,
      ...(portalLines.length ? ["", ...portalLines] : []),
      "",
      "RINCIAN PESANAN",
      buildOrderLines(),
      "",
      "RINGKASAN TOTAL",
      buildTotalsLines(summary),
      "",
      ...cartPaymentLines(),
      "",
      summary.unknownLines>0
        ?"Mohon konfirmasi harga yang belum pasti, stok, dan total akhir."
        :`Mohon konfirmasi stok dan proses pembayaran ${selectedCartPaymentMethod()==='seabank'?'SeaBank':'QRIS'}.`,
      "Terima kasih."
    ].join("\n");
  }

  function checkoutWhatsApp(){
    if(!cart.length)return;
    if(hasPortalItem()){
      window.alert("Keranjang berisi ZSHOPAPPS Preflix Lifetime. Bayar melalui QRIS atau transfer SeaBank sesuai total lalu checkout ke Telegram 1 @ZShopAppsJualanAplikasiOriginal atau Telegram 2 @Seller4899.");
      return;
    }
    if(totals().unknownLines>0){window.alert("Ada harga yang belum pasti. Konfirmasi owner sebelum membayar melalui QRIS atau SeaBank.");return;}
    openWhatsApp(buildCheckoutMessage());
  }

  function checkoutTelegram(slot="primary"){
    if(!cart.length)return;
    if(!validateBusinessPurchase())return;
    openTelegram(buildCheckoutMessage(),slot);
  }


  function complimentForGreeting(greeting){
    if(["Abang","Om"].includes(greeting))return "ganteng";
    if(["Neng","Mbak"].includes(greeting))return "cantik";
    return "ganteng/cantik";
  }

  function showCompletionMessage(channel="whatsapp"){
    if(!cart.length)return;
    if(totals().unknownLines>0){window.alert("Ada harga yang belum pasti. Jangan menekan sudah bayar sebelum total dikonfirmasi owner.");return;}
    const isTelegramChannel=String(channel||"").startsWith("telegram");
    if(hasPortalItem()&&!isTelegramChannel){window.alert("Bukti pembayaran portal wajib dikirim melalui Telegram 1 @ZShopAppsJualanAplikasiOriginal atau Telegram 2 @Seller4899.");return;}
    if(!validateBusinessPurchase())return;

    const greeting=greetingSelect?.value||"Kakak";
    const summary=totals();
    const code=lastCheckoutCode||makeCheckoutCode();
    lastCheckoutCode=code;

    const thanks=window.ZSHOP_COMPLETION
      ?window.ZSHOP_COMPLETION.makeThankYou(greeting)
      :"Terima kasih sudah berkunjung dan mampir beli di ZSHOPAPPS. "+
       "Semoga rezekinya semakin lancar dan sehat selalu.";

    try{
      localStorage.setItem(GREETING_KEY,greeting);
      localStorage.setItem(
        LAST_ORDER_KEY,
        JSON.stringify({
          code,
          completedAt:new Date().toISOString(),
          greeting,
          channel,
          portalCustomer:hasPortalItem()?portalCustomerProfile():null,
          totals:summary,
          items:cart
        })
      );
    }catch(error){}

    thanksText.textContent=thanks;
    thanksPanel.hidden=false;
    thanksPanel.scrollIntoView({
      behavior:"smooth",
      block:"nearest"
    });

    const portalLines=portalCustomerLines();
    const paymentMethod=selectedCartPaymentMethod();
    const paymentLabel=paymentMethod==='seabank'?'Transfer Bank SeaBank':'QRIS';
    const message=[
      `Halo ZSHOPAPPS, saya sudah melakukan pembayaran melalui ${paymentLabel}.`,
      "",
      `Kode keranjang: ${code}`,
      ...(portalLines.length ? ["", ...portalLines] : []),
      "",
      "RINCIAN PEMBELIAN",
      buildOrderLines(),
      "",
      "RINGKASAN TOTAL",
      buildTotalsLines(summary),
      "",
      ...cartPaymentLines(),
      "",
      "Mohon verifikasi pembayaran dan proses pesanan saya.",
      "Bukti transfer akan saya kirimkan di chat ini.",
      "",
      "--- UCAPAN OTOMATIS WEBSITE ZSHOPAPPS ---",
      thanks
    ].filter(Boolean).join("\n");

    const whatsappUrl=
      "https://wa.me/"+WHATSAPP_NUMBER+
      "?text="+encodeURIComponent(message);
    const telegramPrimaryUrl=telegramShareUrl(message,"primary");
    const telegramSecondaryUrl=telegramShareUrl(message,"secondary");

    lockBusinessPurchase();

    if(window.ZSHOP_COMPLETION){
      window.ZSHOP_COMPLETION.open({
        greeting,
        thanks,
        code,
        whatsappUrl,
        telegramPrimaryUrl,
        telegramSecondaryUrl,
        telegramUrl: telegramPrimaryUrl
      });
    }

    const destination=channel==="telegram-secondary"
      ?telegramSecondaryUrl
      :channel==="telegram-primary"
        ?telegramPrimaryUrl
        :whatsappUrl;
    window.open(destination,"_blank","noopener");
  }


  function clearCart(){
    cart=[];
    saveCart();
    thanksPanel.hidden=true;
    render();
  }

  cartBtn?.addEventListener("click",openCart);
  quickbar?.addEventListener("click",openCart);

  document.querySelectorAll("[data-cart-open]").forEach(element=>{
    element.addEventListener("click",event=>{
      event.preventDefault();
      openCart();
    });
  });

  document.querySelectorAll("[data-cart-close]").forEach(element=>{
    element.addEventListener("click",closeCart);
  });

  qrisPreview?.addEventListener("click",openQris);
  document.querySelectorAll("[data-qris-close]").forEach(element=>{
    element.addEventListener("click",closeQris);
  });

  itemsNode?.addEventListener("click",event=>{
    const button=event.target.closest("[data-cart-action]");
    if(!button)return;

    const itemNode=button.closest("[data-cart-key]");
    const key=itemNode?.dataset.cartKey;
    if(!key)return;

    const action=button.dataset.cartAction;
    if(action==="minus")changeQuantity(key,-1);
    if(action==="plus")changeQuantity(key,1);
    if(action==="remove")removeItem(key);
  });

  async function copyCartText(value,button,successText){
    let ok=false;
    try{await navigator.clipboard.writeText(String(value));ok=true;}catch(error){
      const area=document.createElement('textarea');area.value=String(value);area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();
      try{ok=document.execCommand('copy');}catch(e){} area.remove();
    }
    if(button){const old=button.textContent;button.textContent=ok?successText:'Gagal Menyalin';setTimeout(()=>button.textContent=old,1400);}
  }
  cartCopySeaBankAccount?.addEventListener('click',()=>copyCartText(SEABANK_ACCOUNT,cartCopySeaBankAccount,'Rekening Disalin'));
  cartCopySeaBankTotal?.addEventListener('click',()=>{
    const summary=totals();
    if(summary.unknownLines>0){window.alert('Ada harga yang belum pasti. Konfirmasi total sebelum transfer.');return;}
    copyCartText(summary.idr,cartCopySeaBankTotal,'Total Disalin');
  });

  checkoutButton?.addEventListener("click",checkoutWhatsApp);
  telegramCheckoutPrimaryButton?.addEventListener("click",()=>checkoutTelegram("primary"));
  telegramCheckoutSecondaryButton?.addEventListener("click",()=>checkoutTelegram("secondary"));
  paidButton?.addEventListener(
    "click",
    ()=>showCompletionMessage("whatsapp")
  );
  paidTelegramPrimaryButton?.addEventListener(
    "click",
    ()=>showCompletionMessage("telegram-primary")
  );
  paidTelegramSecondaryButton?.addEventListener(
    "click",
    ()=>showCompletionMessage("telegram-secondary")
  );

  clearButton?.addEventListener("click",()=>{
    if(cart.length&&window.confirm("Hapus seluruh isi keranjang?")){
      clearCart();
    }
  });

  finishClearButton?.addEventListener("click",()=>{
    if(window.confirm(
      "Riwayat pesanan terakhir sudah disimpan. Kosongkan keranjang?"
    )){
      clearCart();
    }
  });

  greetingSelect?.addEventListener("change",()=>{
    try{
      localStorage.setItem(GREETING_KEY,greetingSelect.value);
    }catch(error){}
  });

  buyerInput?.addEventListener("input",()=>{
    try{localStorage.setItem("zshopappsBuyerNameV1",buyerInput.value);}catch(error){}
  });
  businessInput?.addEventListener("input",()=>{
    try{localStorage.setItem("zshopappsBusinessNameV1",businessInput.value);}catch(error){}
  });
  telegramDisplayNameInput?.addEventListener("input",()=>{
    try{localStorage.setItem("zshopappsTelegramDisplayNameV1",telegramDisplayNameInput.value);}catch(error){}
  });
  telegramUsernameInput?.addEventListener("input",()=>{
    syncTelegramUsernameUi();
    try{localStorage.setItem("zshopappsTelegramUsernameV1",telegramUsernameInput.value);}catch(error){}
  });
  telegramUsernameInput?.addEventListener("blur",()=>{
    const normalized=normalizeTelegramUsername(telegramUsernameInput.value);
    if(normalized)telegramUsernameInput.value="@"+normalized;
    syncTelegramUsernameUi();
  });
  businessTypeSelect?.addEventListener("change",()=>{
    try{localStorage.setItem("zshopappsBusinessTypeV1",businessTypeSelect.value);}catch(error){}
  });
  telegramPurposeSelect?.addEventListener("change",()=>{
    try{localStorage.setItem("zshopappsTelegramPurposeV1",telegramPurposeSelect.value);}catch(error){}
  });
  telegramOwnershipInput?.addEventListener("change",()=>{
    try{localStorage.setItem("zshopappsTelegramOwnershipV1",telegramOwnershipInput.checked?"1":"0");}catch(error){}
  });

  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape")return;
    if(qrisLightbox.classList.contains("is-open"))closeQris();
    else if(modal.classList.contains("is-open"))closeCart();
  });

  window.addEventListener("storage",event=>{
    if(event.key===STORAGE_KEY){
      cart=loadCart();
      render();
    }
  });

  try{
    const savedGreeting=localStorage.getItem(GREETING_KEY);
    if(savedGreeting&&greetingSelect){
      greetingSelect.value=savedGreeting;
    }
    const savedBuyer=localStorage.getItem("zshopappsBuyerNameV1");
    if(savedBuyer&&buyerInput)buyerInput.value=savedBuyer;
    const savedBusiness=localStorage.getItem("zshopappsBusinessNameV1");
    if(savedBusiness&&businessInput)businessInput.value=savedBusiness;
    const savedTelegramDisplayName=localStorage.getItem("zshopappsTelegramDisplayNameV1");
    if(savedTelegramDisplayName&&telegramDisplayNameInput)telegramDisplayNameInput.value=savedTelegramDisplayName;
    const savedTelegramUsername=localStorage.getItem("zshopappsTelegramUsernameV1");
    if(savedTelegramUsername&&telegramUsernameInput)telegramUsernameInput.value=savedTelegramUsername;
    const savedBusinessType=localStorage.getItem("zshopappsBusinessTypeV1");
    if(savedBusinessType&&businessTypeSelect)businessTypeSelect.value=savedBusinessType;
    const savedTelegramPurpose=localStorage.getItem("zshopappsTelegramPurposeV1");
    if(savedTelegramPurpose&&telegramPurposeSelect)telegramPurposeSelect.value=savedTelegramPurpose;
    if(telegramOwnershipInput)telegramOwnershipInput.checked=localStorage.getItem("zshopappsTelegramOwnershipV1")==="1";
    syncTelegramUsernameUi();
  }catch(error){}

  window.ZSHOP_CART={
    addFromCard,
    open:openCart,
    getItems:()=>cart.map(item=>({...item})),
    getLastOrder:()=>{
      try{
        return JSON.parse(localStorage.getItem(LAST_ORDER_KEY)||"null");
      }catch(error){
        return null;
      }
    }
  };

  render();
})();
