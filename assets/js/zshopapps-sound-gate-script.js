(function() {
    "use strict";

    const gate = document.getElementById("soundGate");
    const gateButton = document.getElementById("soundGateButton");
    const gateSilent = document.getElementById("soundGateSilent");
    const gateVolume = document.getElementById("soundGateVolume");
    const gateValue = document.getElementById("soundGateVolumeValue");
    const audio = document.getElementById("playlistAudio");
    const playButton = document.getElementById("musicPlay");

    if (!gate || !gateButton || !gateVolume || !audio || !playButton) return;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    function readSavedVolume() {
        try {
            const saved = Number(
                localStorage.getItem("zshopappsMusicVolume")
            );
            if (Number.isFinite(saved) && saved >= 0 && saved <= 1) {
                return saved;
            }
        } catch (error) {}
        return 0.40;
    }

    function updateGateDisplay(value) {
        const percent = clamp(Number(value), 0, 100);
        gateVolume.style.setProperty(
            "--gate-progress",
            percent + "%"
        );
        if (gateValue) {
            gateValue.textContent = Math.round(percent) + "%";
        }
    }

    function applySelectedVolume() {
        const selected = clamp(
            Number(gateVolume.value) / 100,
            0,
            1
        );
        audio.volume = selected;
        audio.muted = false;
        audio.defaultMuted = false;
        try {
            localStorage.setItem(
                "zshopappsMusicVolume",
                String(selected)
            );
        } catch (error) {}
        return selected;
    }

    const initial = Math.round(readSavedVolume() * 100);
    gateVolume.value = String(initial);
    updateGateDisplay(initial);

    gateVolume.addEventListener("input", function() {
        updateGateDisplay(gateVolume.value);
    });

    gateButton.addEventListener("click", function() {
        applySelectedVolume();
        gateButton.disabled = true;
        gateButton.textContent = "Memulai…";

        if (audio.paused) {
            playButton.click();
        }

        setTimeout(function() {
            gateButton.disabled = false;
            if (!audio.paused) {
                gate.classList.add("is-hidden");
                gateButton.textContent = "✓ Musik Aktif";
            } else {
                gateButton.textContent = "▶ Coba Putar Lagi";
            }
        }, 450);
    });

    if (gateSilent) {
        gateSilent.addEventListener("click", function() {
            if (!audio.paused) {
                playButton.click();
            }
            gate.classList.add("is-hidden");
        });
    }

    audio.addEventListener("play", function() {
        gate.classList.add("is-hidden");
    });

    audio.addEventListener("volumechange", function() {
        const percent = Math.round(audio.volume * 100);
        gateVolume.value = String(percent);
        updateGateDisplay(percent);
    });
})();
