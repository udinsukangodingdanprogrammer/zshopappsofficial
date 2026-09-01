(function() {
    "use strict";
    if (window.__zshopBootLoaderInitialized) return;
    window.__zshopBootLoaderInitialized = true;
    const loader = document.getElementById("zshopBootLoader");
    const fill = document.getElementById("zshopLoaderFill");
    const percentNode = document.getElementById("zshopLoaderPercent");
    const progressNode = document.getElementById("zshopLoaderProgress");
    const statusNode = document.getElementById("zshopLoaderStatus");
    const countdownNode = document.getElementById("zshopLoaderCountdown");
    if (!loader || !fill || !percentNode || !progressNode) {
        document.body.classList.remove("zshop-loading");
        return;
    }
    const startedAt = performance.now();
    const minimumDuration = 4300;
    let progress = 0;
    let pageLoaded = document.readyState === "complete";
    let finishing = false;
    let closed = false;
    let timer = 0;
    function render(value) {
        progress = Math.max(0, Math.min(100, Math.round(value)));
        fill.style.width = progress + "%";
        percentNode.value = progress + "%";
        percentNode.textContent = progress + "%";
        progressNode.setAttribute("aria-valuenow", String(progress));
        if (progress < 34) {
            statusNode.textContent = "Menyiapkan ZSHOPAPPS Digital...";
            countdownNode.textContent = "Memuat identitas brand dan antarmuka.";
        } else if (progress < 72) {
            statusNode.textContent = "Memuat katalog, musik, dan pembayaran...";
            countdownNode.textContent = "Sinkronisasi komponen: " + progress + "%.";
        } else if (progress < 96) {
            statusNode.textContent = "Hampir selesai...";
            countdownNode.textContent = "Optimasi tampilan desktop dan Android.";
        } else if (progress < 100) {
            statusNode.textContent = "Finalisasi ZSHOPAPPS...";
            countdownNode.textContent = "Membuka halaman utama.";
        } else {
            statusNode.textContent = "ZSHOPAPPS siap.";
            countdownNode.textContent = "Selamat datang di ZSHOPAPPS Official.";
        }
    }
    function closeLoader() {
        if (closed) return;
        closed = true;
        window.clearTimeout(timer);
        loader.classList.add("is-leaving");
        document.body.classList.remove("zshop-loading");
        window.setTimeout(function(){ if (loader && loader.parentNode) loader.remove(); }, 520);
    }
    function finish() {
        if (finishing || closed) return;
        finishing = true;
        const step = function() {
            if (closed) return;
            if (progress < 100) {
                render(Math.min(100, progress + Math.max(1, Math.ceil((100 - progress) / 6))));
                timer = window.setTimeout(step, 42);
            } else {
                timer = window.setTimeout(closeLoader, 760);
            }
        };
        step();
    }
    function tick(now) {
        if (closed || finishing) return;
        const elapsed = now - startedAt;
        const eased = 1 - Math.pow(1 - Math.min(elapsed / minimumDuration, 1), 2.1);
        const target = Math.min(93, Math.floor(eased * 93));
        if (target > progress) render(target);
        if (pageLoaded && elapsed >= minimumDuration) { finish(); return; }
        window.requestAnimationFrame(tick);
    }
    window.addEventListener("load", function(){ pageLoaded = true; if (performance.now() - startedAt >= minimumDuration) finish(); }, {once:true});
    loader.querySelectorAll("[data-zshop-loader-skip]").forEach(function(button){ button.addEventListener("click", closeLoader); });
    document.addEventListener("keydown", function(event){ if (event.key === "Escape" && !closed) closeLoader(); });
    render(0);
    window.requestAnimationFrame(tick);
    window.setTimeout(function(){ if (!closed && !finishing) { pageLoaded = true; finish(); } }, 15000);
})();
