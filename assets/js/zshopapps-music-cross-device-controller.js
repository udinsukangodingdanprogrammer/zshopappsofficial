(function() {
    const dock = document.getElementById("musicDock");
    const reopen = document.getElementById("musicReopen");
    const header = document.getElementById("musicBtn");
    const close = document.getElementById("musicHide");
    const audio = document.getElementById("playlistAudio");
    const playlistToggle = document.getElementById("playlistToggle");
    if (!dock || !reopen) return;

    function syncPlayerVisibility() {
        const hidden = dock.classList.contains("is-hidden");
        reopen.hidden = !hidden;
        document.body.classList.toggle("music-player-hidden", hidden);
        dock.setAttribute("aria-hidden", hidden ? "true" : "false");
        if (header) {
            const expanded = !hidden && dock.classList.contains("is-open");
            header.setAttribute("aria-expanded", String(expanded));
            header.setAttribute("title", hidden ? "Buka pemutar musik" : "Pemutar musik");
        }
    }

    function openPlayer() {
        dock.classList.remove("is-hidden");
        dock.setAttribute("aria-hidden", "false");
        syncPlayerVisibility();
        window.setTimeout(function() {
            const target = document.getElementById("musicPlay") || dock;
            try {
                target.focus({
                    preventScroll: true
                });
            } catch (error) {
                target.focus();
            }
        }, 30);
    }

    reopen.addEventListener("click", openPlayer);

    if (close) {
        close.addEventListener("click", function() {
            if (audio && !audio.paused) audio.pause();
            dock.classList.remove("is-open");
            playlistToggle ?.setAttribute("aria-expanded", "false");
            window.setTimeout(syncPlayerVisibility, 0);
        });
    }

    header ?.addEventListener("click", function() {
        window.setTimeout(syncPlayerVisibility, 0);
    });

    new MutationObserver(syncPlayerVisibility).observe(dock, {
        attributes: true,
        attributeFilter: ["class"]
    });

    syncPlayerVisibility();
})();
