(function() {
    "use strict";
    const dock = document.getElementById("musicDock");
    const audio = document.getElementById("playlistAudio");
    const next = document.getElementById("musicNext");
    const previous = document.getElementById("musicPrev");
    const close = document.getElementById("musicHide");
    const toast = document.getElementById("musicToast");
    const search = document.getElementById("musicPlaylistSearch");
    const count = document.getElementById("musicPlaylistVisibleCount");
    const empty = document.getElementById("musicPlaylistEmpty");
    const items = [...document.querySelectorAll(".playlist-item")];
    const skipMobile = document.getElementById("musicMobileSkip");
    const restartMobile = document.getElementById("musicMobileRestart");
    const deleteMobile = document.getElementById("musicMobileDelete");
    const closeMobile = document.getElementById("musicMobileClose");
    const drawerMusic = document.querySelector("[data-drawer-music-open]");
    if (!dock || !audio || !items.length) return;

    let toastTimer = 0;

    function notify(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
    }

    function activeItems() {
        return items.filter(item => item.dataset.queueRemoved !== "true");
    }

    function currentItem() {
        return items.find(item => item.classList.contains("is-current")) || activeItems()[0] || null;
    }

    function nextActive(direction) {
        const active = activeItems();
        if (!active.length) return null;
        const current = currentItem();
        const currentPosition = Math.max(0, active.indexOf(current));
        const target = (currentPosition + direction + active.length) % active.length;
        return active[target];
    }

    function playActive(direction) {
        const target = nextActive(direction);
        if (target) target.click();
    }

    function syncRemovedVisibility() {
        const query = (search ?.value || "").trim().toLocaleLowerCase("id-ID");
        let shown = 0;
        items.forEach(item => {
            const removed = item.dataset.queueRemoved === "true";
            const haystack = (item.dataset.trackSearch || item.textContent || "").toLocaleLowerCase("id-ID");
            const matches = !query || haystack.includes(query);
            item.hidden = removed || !matches;
            if (!removed && matches) shown++;
        });
        if (count) count.textContent = String(shown);
        if (empty) empty.hidden = shown !== 0;
    }

    /* Capture these buttons so deleted queue items remain skipped. */
    next ?.addEventListener("click", event => {
        if (!items.some(item => item.dataset.queueRemoved === "true")) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        playActive(1);
    }, true);
    previous ?.addEventListener("click", event => {
        if (!items.some(item => item.dataset.queueRemoved === "true")) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        playActive(-1);
    }, true);

    skipMobile ?.addEventListener("click", () => {
        next ?.click();
        notify("Lewati ke musik berikutnya");
    });

    restartMobile ?.addEventListener("click", async() => {
        try {
            audio.currentTime = 0;
            await audio.play();
            notify("Musik diputar ulang dari awal");
        } catch (error) {
            notify("Tekan tombol putar untuk memulai ulang musik");
        }
    });

    deleteMobile ?.addEventListener("click", () => {
        const current = currentItem();
        if (!current) return;
        const remaining = activeItems().length;
        if (remaining <= 1) {
            notify("Minimal satu musik harus tetap ada di playlist");
            return;
        }
        const title = current.querySelector(".playlist-copy strong") ?.textContent ?.trim() || "Musik";
        const target = nextActive(1);
        current.dataset.queueRemoved = "true";
        current.hidden = true;
        current.setAttribute("aria-disabled", "true");
        syncRemovedVisibility();
        if (target && target !== current) target.click();
        notify(title + " dihapus dari antrean sementara");
    });

    closeMobile ?.addEventListener("click", () => close ?.click());

    search ?.addEventListener("input", () => requestAnimationFrame(syncRemovedVisibility));

    /* If auto-next reaches a removed item, immediately move to the next active song. */
    audio.addEventListener("play", () => {
        const current = currentItem();
        if (current ?.dataset.queueRemoved === "true") {
            audio.pause();
            playActive(1);
        }
    });

    drawerMusic ?.addEventListener("click", event => {
        event.preventDefault();
        document.body.classList.remove("menu-open");
        document.getElementById("menuBtn") ?.setAttribute("aria-expanded", "false");
        dock.classList.remove("is-hidden");
        dock.classList.add("is-open");
        document.getElementById("playlistToggle") ?.setAttribute("aria-expanded", "true");
        window.setTimeout(() => {
            try {
                dock.focus({
                    preventScroll: true
                });
            } catch (error) {
                dock.focus();
            }
        }, 30);
    });
})();
