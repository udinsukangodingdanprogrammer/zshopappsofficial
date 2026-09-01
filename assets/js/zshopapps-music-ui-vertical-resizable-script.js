(function() {
    "use strict";
    const dock = document.getElementById("musicDock"),
        shell = document.getElementById("musicVolumeShell"),
        toggle = document.getElementById("musicVolumeToggle"),
        popover = document.getElementById("musicVolumePopover"),
        mainVolume = document.getElementById("musicVolume"),
        panelVolume = document.getElementById("musicVolumePanel"),
        mainValue = document.getElementById("musicVolumeValue"),
        panelValue = document.getElementById("musicVolumePanelValue"),
        muteButton = document.getElementById("musicMute"),
        sizeToggle = document.getElementById("musicSizeToggle"),
        sizeLabel = document.getElementById("musicSizeLabel"),
        sizeButtons = [...document.querySelectorAll("[data-music-size]")];
    if (!dock) return;
    const key = "zshopappsMusicPlayerSize",
        sizes = ["compact", "medium", "large"],
        labels = {
            compact: "Ringkas",
            medium: "Sedang",
            large: "Besar"
        };

    function clamp(v, a, b) {
        return Math.max(a, Math.min(b, v))
    }

    function progress(i) {
        if (!i) return;
        const min = +i.min || 0,
            max = +i.max || 1,
            v = clamp(+i.value || 0, min, max);
        i.style.setProperty("--vertical-progress", ((v - min) / (max - min) * 100) + "%")
    }

    function refresh() {
        const audio = document.getElementById("playlistAudio"),
            v = audio ? clamp(+audio.volume || 0, 0, 1) : clamp(+mainVolume.value || 0, 0, 1),
            p = Math.round(v * 100);
        progress(mainVolume);
        progress(panelVolume);
        if (mainValue) mainValue.textContent = p + "%";
        if (panelValue) panelValue.textContent = p + "%";
        if (muteButton && audio) {
            const m = audio.muted || v === 0;
            muteButton.textContent = m ? "🔇 Aktifkan suara" : "🔊 Suara aktif"
        }
        if (toggle && audio) toggle.textContent = audio.muted || v === 0 ? "🔇" : v < .45 ? "🔉" : "🔊"
    }

    function close() {
        shell ?.classList.remove("is-open");
        toggle ?.setAttribute("aria-expanded", "false")
    }
    toggle ?.addEventListener("click", e => {
        e.stopPropagation();
        const open = shell.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open))
    });
    popover ?.addEventListener("click", e => e.stopPropagation());
    document.addEventListener("click", e => {
        if (shell && !shell.contains(e.target)) close()
    });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") close()
    });
    [mainVolume, panelVolume].forEach(i => {
        if (!i) return;
        progress(i);
        i.addEventListener("input", () => requestAnimationFrame(refresh));
        i.addEventListener("change", refresh)
    });
    const audio = document.getElementById("playlistAudio");
    audio ?.addEventListener("volumechange", refresh);
    muteButton ?.addEventListener("click", () => setTimeout(refresh, 0));

    function apply(size, persist = true) {
        const s = sizes.includes(size) ? size : "medium";
        dock.dataset.playerSize = s;
        sizeButtons.forEach(b => {
            const a = b.dataset.musicSize === s;
            b.classList.toggle("is-active", a);
            b.setAttribute("aria-pressed", String(a))
        });
        if (sizeLabel) sizeLabel.textContent = labels[s];
        if (sizeToggle) {
            sizeToggle.title = "Ukuran player: " + labels[s];
            sizeToggle.setAttribute("aria-label", "Ubah ukuran pemutar. Saat ini " + labels[s])
        }
        if (persist) try {
            localStorage.setItem(key, s)
        } catch (e) {}
    }
    sizeButtons.forEach(b => b.addEventListener("click", () => apply(b.dataset.musicSize)));
    sizeToggle ?.addEventListener("click", () => {
        const i = sizes.indexOf(dock.dataset.playerSize || "medium");
        apply(sizes[(i + 1) % sizes.length])
    });
    let saved = "medium";
    try {
        saved = localStorage.getItem(key) || "medium"
    } catch (e) {}
    apply(saved, false);
    requestAnimationFrame(refresh)
})();
