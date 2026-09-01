(function() {
    "use strict";
    if (window.__ZSHOP_WEATHER_SFX__) return;
    window.__ZSHOP_WEATHER_SFX__ = true;

    const body = document.body;
    const atmosphere = document.getElementById("zweatherAtmosphere");
    const rainLayer = document.getElementById("zweatherRain");
    const snowLayer = document.getElementById("zweatherSnow");
    const rippleLayer = document.getElementById("zweatherRipples");
    const fab = document.getElementById("zweatherFab");
    const widgetClose = document.getElementById("zweatherWidgetClose");
    const restoreButton = document.getElementById("zweatherRestore");
    const restoreIcon = document.getElementById("zweatherRestoreIcon");
    const panel = document.getElementById("zweatherPanel");
    const closeButton = document.getElementById("zweatherClose");
    const modeGrid = document.getElementById("zweatherModeGrid");
    const muteButton = document.getElementById("zweatherMute");
    const volumeInput = document.getElementById("zweatherVolume");
    const volumeValue = document.getElementById("zweatherVolumeValue");
    const currentIcon = document.getElementById("zweatherCurrentIcon");
    const currentTitle = document.getElementById("zweatherCurrentTitle");
    const currentDesc = document.getElementById("zweatherCurrentDesc");
    const brandIcon = document.getElementById("zweatherBrandIcon");
    const fabIcon = document.getElementById("zweatherFabIcon");
    const fabTitle = document.getElementById("zweatherFabTitle");
    const fabSub = document.getElementById("zweatherFabSub");
    const audioBadge = document.getElementById("zweatherAudioBadge");
    const toast = document.getElementById("zweatherToast");
    if (!atmosphere || !fab || !panel || !modeGrid) return;

    const MODE_KEY = "zshopappsWeatherMode";
    const VOLUME_KEY = "zshopappsWeatherVolume";
    const MUTED_KEY = "zshopappsWeatherMuted";
    const HIDDEN_KEY = "zshopappsWeatherHidden";
    const modes = {
        sunny: {
            icon: "☀️",
            title: "Mode Cerah",
            fab: "CUACA CERAH",
            desc: "Cahaya hangat, langit bersih, dan SFX burung lembut."
        },
        rain: {
            icon: "🌧️",
            title: "Mode Hujan",
            fab: "HUJAN AKTIF",
            desc: "Rintik bergerak, awan mendung, pantulan air, dan ambience hujan."
        },
        dry: {
            icon: "🏜️",
            title: "Mode Kemarau",
            fab: "KEMARAU",
            desc: "Nuansa panas, gelombang udara, angin kering, dan suara alam ringan."
        },
        storm: {
            icon: "⛈️",
            title: "Mode Hujan Petir",
            fab: "HUJAN PETIR",
            desc: "Hujan lebih deras, langit gelap, kilat, dan guntur dinamis."
        },
        "rain-clear": {
            icon: "🌦️",
            title: "Hujan Berhenti → Cerah",
            fab: "HUJAN MEREDA",
            desc: "Rintik dan SFX hujan memudar, lalu tampilan berpindah ke cerah."
        },
        snow: {
            icon: "❄️",
            title: "Mode Es Salju",
            fab: "ES SALJU",
            desc: "Butiran salju bergerak, kabut dingin, angin lembut, dan bell es."
        },
        "snow-clear": {
            icon: "🌤️",
            title: "Salju Berhenti → Cerah",
            fab: "SALJU MEREDA",
            desc: "Salju dan angin dingin memudar, lalu cahaya cerah kembali."
        }
    };

    let currentMode = "sunny";
    let sfxActivated = false;
    let muted = false;
    let volume = .24;
    let toastTimer = 0;
    let transitionTimer = 0;
    let widgetHidden = false;

    let audioContext = null;
    let masterGain = null;
    let sceneGain = null;
    let sceneNodes = [];
    let sceneTimers = [];
    let sceneToken = 0;
    let noiseBuffer = null;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value))
    }

    function random(min, max) {
        return min + Math.random() * (max - min)
    }

    function seedParticles() {
        if (rainLayer && !rainLayer.children.length) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 86; i++) {
                const drop = document.createElement("span");
                drop.className = "zweather-drop";
                drop.style.setProperty("--x", random(-4, 104).toFixed(2) + "vw");
                drop.style.setProperty("--len", random(26, 74).toFixed(0) + "px");
                drop.style.setProperty("--speed", random(.58, 1.18).toFixed(2) + "s");
                drop.style.setProperty("--delay", (-random(0, 2.4)).toFixed(2) + "s");
                drop.style.setProperty("--alpha", random(.28, .84).toFixed(2));
                fragment.appendChild(drop);
            }
            rainLayer.appendChild(fragment);
        }
        if (snowLayer && !snowLayer.children.length) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 54; i++) {
                const flake = document.createElement("span");
                flake.className = "zweather-flake";
                flake.style.setProperty("--x", random(-2, 102).toFixed(2) + "vw");
                flake.style.setProperty("--size", random(3, 9).toFixed(1) + "px");
                flake.style.setProperty("--speed", random(5.8, 12.8).toFixed(2) + "s");
                flake.style.setProperty("--delay", (-random(0, 13)).toFixed(2) + "s");
                flake.style.setProperty("--alpha", random(.38, .96).toFixed(2));
                fragment.appendChild(flake);
            }
            snowLayer.appendChild(fragment);
        }
        if (rippleLayer && !rippleLayer.children.length) {
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < 18; i++) {
                const ripple = document.createElement("span");
                ripple.className = "zweather-ripple";
                ripple.style.setProperty("--x", random(2, 98).toFixed(1) + "vw");
                ripple.style.setProperty("--y", random(2, 22).toFixed(1) + "vh");
                ripple.style.setProperty("--speed", random(1.6, 3.2).toFixed(2) + "s");
                ripple.style.setProperty("--delay", (-random(0, 4)).toFixed(2) + "s");
                fragment.appendChild(ripple);
            }
            rippleLayer.appendChild(fragment);
        }
    }

    function openPanel() {
        body.classList.add("zweather-panel-open");
        panel.setAttribute("aria-hidden", "false");
        fab.setAttribute("aria-expanded", "true");
        setTimeout(() => panel.querySelector("[data-zweather-mode].is-active") ?.focus({
            preventScroll: true
        }), 40);
    }

    function closePanel() {
        body.classList.remove("zweather-panel-open");
        panel.setAttribute("aria-hidden", "true");
        fab.setAttribute("aria-expanded", "false");
    }

    function togglePanel() {
        body.classList.contains("zweather-panel-open") ? closePanel() : openPanel()
    }

    function setWidgetHidden(hidden, {
        persist = true,
        focus = false
    } = {}) {
        widgetHidden = Boolean(hidden);
        closePanel();
        body.classList.toggle("zweather-widget-hidden", widgetHidden);
        fab.setAttribute("aria-hidden", String(widgetHidden));
        if (widgetClose) widgetClose.setAttribute("aria-hidden", String(widgetHidden));
        if (restoreButton) restoreButton.setAttribute("aria-hidden", String(!widgetHidden));
        if (widgetHidden) {
            stopScene(.16);
            sfxActivated = false;
            updateVolumeUI();
        } else {
            updateModeUI(currentMode);
            if (focus) window.setTimeout(() => fab.focus({
                preventScroll: true
            }), 30);
        }
        if (persist) {
            try {
                localStorage.setItem(HIDDEN_KEY, widgetHidden ? "1" : "0")
            } catch (error) {}
        }
    }

    function showToast(message) {
        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.classList.add("is-visible");
        toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
    }

    function saveState() {
        try {
            localStorage.setItem(MODE_KEY, currentMode);
            localStorage.setItem(VOLUME_KEY, String(volume));
            localStorage.setItem(MUTED_KEY, muted ? "1" : "0");
        } catch (error) {}
    }

    function updateVolumeUI() {
        const percent = Math.round(volume * 100);
        volumeInput.value = String(percent);
        volumeInput.style.setProperty("--zweather-volume", percent + "%");
        volumeValue.textContent = percent + "%";
        body.classList.toggle("zweather-sfx-muted", muted || percent === 0);
        muteButton.classList.toggle("is-muted", muted);
        muteButton.textContent = muted ? "🔇 SFX Mati" : "🔊 SFX Aktif";
        if (masterGain && audioContext) {
            const now = audioContext.currentTime;
            masterGain.gain.cancelScheduledValues(now);
            masterGain.gain.setTargetAtTime(muted ? 0 : volume, now, .035);
        }
        if (audioBadge) {
            audioBadge.innerHTML = "<i></i> " + (sfxActivated ? (muted ? "SFX dimatikan" : "SFX aktif") : "SFX siap");
        }
        fabSub.textContent = sfxActivated ? (muted ? "SFX mati • visual aktif" : "SFX aktif • terpisah musik") : "7 mode • tap aktifkan SFX";
    }

    function updateModeUI(mode) {
        const info = modes[mode] || modes.sunny;
        body.dataset.zweather = mode;
        currentIcon.textContent = info.icon;
        currentTitle.textContent = info.title;
        currentDesc.textContent = info.desc;
        brandIcon.textContent = info.icon;
        fabIcon.textContent = info.icon;
        if (restoreIcon) restoreIcon.textContent = info.icon;
        fabTitle.textContent = info.fab;
        modeGrid.querySelectorAll("[data-zweather-mode]").forEach(button => {
            const active = button.dataset.zweatherMode === mode;
            button.classList.toggle("is-active", active);
            button.setAttribute("aria-pressed", String(active));
        });
        updateVolumeUI();
    }

    function ensureAudio() {
        if (!AudioCtx) return null;
        if (!audioContext) {
            audioContext = new AudioCtx();
            masterGain = audioContext.createGain();
            masterGain.gain.value = muted ? 0 : volume;
            masterGain.connect(audioContext.destination);
            noiseBuffer = createNoiseBuffer();
        }
        if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
        sfxActivated = true;
        updateVolumeUI();
        return audioContext;
    }

    function createNoiseBuffer() {
        const rate = audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, rate * 3, rate);
        const data = buffer.getChannelData(0);
        let last = 0;
        for (let i = 0; i < data.length; i++) {
            const white = Math.random() * 2 - 1;
            last = (last * .985) + (white * .015);
            data[i] = (white * .48) + (last * .92);
        }
        return buffer;
    }

    function rememberNode(node) {
        sceneNodes.push(node);
        return node
    }

    function rememberTimer(timer) {
        sceneTimers.push(timer);
        return timer
    }

    function stopScene(fade = .22) {
        sceneToken++;
        window.clearTimeout(transitionTimer);
        sceneTimers.forEach(timer => window.clearTimeout(timer));
        sceneTimers = [];
        const oldGain = sceneGain;
        const oldNodes = sceneNodes.slice();
        sceneNodes = [];
        sceneGain = null;
        if (oldGain && audioContext) {
            const now = audioContext.currentTime;
            try {
                oldGain.gain.cancelScheduledValues(now);
                oldGain.gain.setValueAtTime(Math.max(.0001, oldGain.gain.value), now);
                oldGain.gain.exponentialRampToValueAtTime(.0001, now + fade);
            } catch (error) {}
            window.setTimeout(() => {
                oldNodes.forEach(node => {
                    try {
                        if (typeof node.stop === "function") node.stop()
                    } catch (error) {}
                    try {
                        node.disconnect()
                    } catch (error) {}
                });
                try {
                    oldGain.disconnect()
                } catch (error) {}
            }, Math.ceil((fade + .08) * 1000));
        } else {
            oldNodes.forEach(node => {
                try {
                    if (typeof node.stop === "function") node.stop()
                } catch (error) {}
                try {
                    node.disconnect()
                } catch (error) {}
            });
        }
    }

    function beginScene(level = 1) {
        if (!ensureAudio()) return null;
        stopScene(.16);
        sceneToken++;
        const token = sceneToken;
        sceneGain = audioContext.createGain();
        sceneGain.gain.value = .0001;
        sceneGain.connect(masterGain);
        sceneGain.gain.exponentialRampToValueAtTime(Math.max(.0001, level), audioContext.currentTime + .22);
        return token;
    }

    function noiseLayer({
        gain = .12,
        lowpass = 7000,
        highpass = 0,
        rate = 1
    } = {}) {
        const source = rememberNode(audioContext.createBufferSource());
        source.buffer = noiseBuffer;
        source.loop = true;
        source.playbackRate.value = rate;
        let last = source;
        if (highpass > 0) {
            const hp = rememberNode(audioContext.createBiquadFilter());
            hp.type = "highpass";
            hp.frequency.value = highpass;
            last.connect(hp);
            last = hp
        }
        if (lowpass > 0) {
            const lp = rememberNode(audioContext.createBiquadFilter());
            lp.type = "lowpass";
            lp.frequency.value = lowpass;
            lp.Q.value = .45;
            last.connect(lp);
            last = lp
        }
        const level = rememberNode(audioContext.createGain());
        level.gain.value = gain;
        last.connect(level);
        level.connect(sceneGain);
        source.start();
        return source;
    }

    function tone({
        from = 1200,
        to = 2200,
        duration = .22,
        gain = .04,
        type = "sine",
        delay = 0
    } = {}) {
        if (!audioContext || !sceneGain) return;
        const now = audioContext.currentTime + delay;
        const osc = rememberNode(audioContext.createOscillator());
        const env = rememberNode(audioContext.createGain());
        osc.type = type;
        osc.frequency.setValueAtTime(from, now);
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);
        env.gain.setValueAtTime(.0001, now);
        env.gain.exponentialRampToValueAtTime(Math.max(.0001, gain), now + .018);
        env.gain.exponentialRampToValueAtTime(.0001, now + duration);
        osc.connect(env);
        env.connect(sceneGain);
        osc.start(now);
        osc.stop(now + duration + .03);
    }

    function birdChirp() {
        tone({
            from: 2100,
            to: 3900,
            duration: .12,
            gain: .055,
            type: "sine"
        });
        tone({
            from: 2950,
            to: 1800,
            duration: .16,
            gain: .038,
            type: "sine",
            delay: .13
        });
        tone({
            from: 2500,
            to: 4300,
            duration: .11,
            gain: .035,
            type: "triangle",
            delay: .33
        });
    }

    function iceBell() {
        tone({
            from: 880,
            to: 875,
            duration: 1.15,
            gain: .030,
            type: "sine"
        });
        tone({
            from: 1320,
            to: 1312,
            duration: 1.05,
            gain: .018,
            type: "sine",
            delay: .04
        });
        tone({
            from: 1760,
            to: 1740,
            duration: .85,
            gain: .011,
            type: "sine",
            delay: .08
        });
    }

    function cicadaBurst() {
        for (let i = 0; i < 6; i++) tone({
            from: 5200,
            to: 5900,
            duration: .055,
            gain: .010,
            type: "square",
            delay: i * .075
        });
    }

    function scheduleLoop(token, callback, minDelay, maxDelay) {
        const run = () => {
            if (token !== sceneToken) return;
            callback();
            rememberTimer(window.setTimeout(run, random(minDelay, maxDelay)));
        };
        rememberTimer(window.setTimeout(run, random(minDelay * .45, maxDelay * .75)));
    }

    function thunder() {
        if (!audioContext || !sceneGain) return;
        body.classList.remove("zweather-flash");
        void body.offsetWidth;
        body.classList.add("zweather-flash");
        window.setTimeout(() => body.classList.remove("zweather-flash"), 700);

        const source = rememberNode(audioContext.createBufferSource());
        source.buffer = noiseBuffer;
        source.loop = false;
        source.playbackRate.value = .42;
        const low = rememberNode(audioContext.createBiquadFilter());
        low.type = "lowpass";
        low.frequency.value = 180;
        low.Q.value = 1.2;
        const rumble = rememberNode(audioContext.createGain());
        const now = audioContext.currentTime + .06;
        rumble.gain.setValueAtTime(.0001, now);
        rumble.gain.exponentialRampToValueAtTime(.72, now + .08);
        rumble.gain.exponentialRampToValueAtTime(.0001, now + 2.7);
        source.connect(low);
        low.connect(rumble);
        rumble.connect(sceneGain);
        source.start(now);
        source.stop(now + 2.9);
        tone({
            from: 72,
            to: 38,
            duration: 2.1,
            gain: .14,
            type: "sine",
            delay: .04
        });
    }

    function playScene(mode) {
        if (!sfxActivated) return;
        let token;
        if (mode === "rain") {
            token = beginScene(.92);
            if (!token) return;
            noiseLayer({
                gain: .22,
                lowpass: 7600,
                highpass: 620,
                rate: 1.08
            });
            noiseLayer({
                gain: .16,
                lowpass: 2200,
                highpass: 90,
                rate: .72
            });
            scheduleLoop(token, () => tone({
                from: 980,
                to: 720,
                duration: .075,
                gain: .012,
                type: "triangle"
            }), 850, 2100);
        } else if (mode === "storm") {
            token = beginScene(1);
            if (!token) return;
            noiseLayer({
                gain: .31,
                lowpass: 8000,
                highpass: 500,
                rate: 1.14
            });
            noiseLayer({
                gain: .24,
                lowpass: 1700,
                highpass: 55,
                rate: .62
            });
            scheduleLoop(token, thunder, 3800, 7600);
            rememberTimer(window.setTimeout(thunder, 850));
        } else if (mode === "dry") {
            token = beginScene(.78);
            if (!token) return;
            noiseLayer({
                gain: .09,
                lowpass: 980,
                highpass: 65,
                rate: .48
            });
            scheduleLoop(token, cicadaBurst, 2300, 5100);
        } else if (mode === "snow") {
            token = beginScene(.76);
            if (!token) return;
            noiseLayer({
                gain: .075,
                lowpass: 1500,
                highpass: 70,
                rate: .58
            });
            scheduleLoop(token, iceBell, 3100, 6500);
            rememberTimer(window.setTimeout(iceBell, 500));
        } else {
            token = beginScene(.72);
            if (!token) return;
            noiseLayer({
                gain: .028,
                lowpass: 3200,
                highpass: 180,
                rate: .66
            });
            scheduleLoop(token, birdChirp, 2100, 5100);
            rememberTimer(window.setTimeout(birdChirp, 420));
        }
    }

    function completeTransition(target, label) {
        currentMode = target;
        updateModeUI(target);
        playScene(target);
        saveState();
        showToast(label + " Tampilan cerah dan SFX alam aktif.");
    }

    function setMode(mode, {
        silent = false
    } = {}) {
        if (!modes[mode]) mode = "sunny";
        window.clearTimeout(transitionTimer);
        currentMode = mode;
        updateModeUI(mode);
        if (!silent) showToast(modes[mode].title + " diaktifkan.");
        saveState();

        if (mode === "rain-clear") {
            playScene("rain");
            transitionTimer = window.setTimeout(() => completeTransition("sunny", "Hujan sudah berhenti."), 4700);
        } else if (mode === "snow-clear") {
            playScene("snow");
            transitionTimer = window.setTimeout(() => completeTransition("sunny", "Es salju sudah berhenti."), 5000);
        } else {
            playScene(mode);
        }
    }

    fab.addEventListener("click", togglePanel);
    widgetClose ?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        setWidgetHidden(true);
    });
    restoreButton ?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        setWidgetHidden(false, {
            focus: true
        });
    });
    closeButton.addEventListener("click", closePanel);
    modeGrid.addEventListener("click", event => {
        const button = event.target.closest("[data-zweather-mode]");
        if (!button) return;
        ensureAudio();
        setMode(button.dataset.zweatherMode);
    });
    muteButton.addEventListener("click", () => {
        if (!sfxActivated) {
            ensureAudio();
            playScene(currentMode === "rain-clear" ? "rain" : currentMode === "snow-clear" ? "snow" : currentMode)
        }
        muted = !muted;
        updateVolumeUI();
        saveState();
        showToast(muted ? "SFX cuaca dimatikan. Visual tetap aktif." : "SFX cuaca diaktifkan kembali.");
    });
    volumeInput.addEventListener("input", () => {
        volume = clamp(Number(volumeInput.value) / 100, 0, 1);
        if (volume > 0 && muted) muted = false;
        updateVolumeUI();
        saveState();
    });
    document.addEventListener("click", event => {
        if (!body.classList.contains("zweather-panel-open")) return;
        if (panel.contains(event.target) || fab.contains(event.target)) return;
        closePanel();
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && body.classList.contains("zweather-panel-open")) closePanel()
    });
    window.addEventListener("pagehide", () => stopScene(.05));

    try {
        const savedMode = localStorage.getItem(MODE_KEY);
        if (savedMode && modes[savedMode] && !savedMode.includes("clear")) currentMode = savedMode;
        const savedVolume = Number(localStorage.getItem(VOLUME_KEY));
        if (Number.isFinite(savedVolume)) volume = clamp(savedVolume, 0, 1);
        muted = localStorage.getItem(MUTED_KEY) === "1";
        widgetHidden = localStorage.getItem(HIDDEN_KEY) === "1";
    } catch (error) {}

    seedParticles();
    updateModeUI(currentMode);
    updateVolumeUI();
    setWidgetHidden(widgetHidden, {
        persist: false
    });

    window.ZSHOP_WEATHER = {
        setMode(mode) {
            ensureAudio();
            setMode(mode)
        },
        mute() {
            muted = true;
            updateVolumeUI();
            saveState()
        },
        unmute() {
            ensureAudio();
            muted = false;
            updateVolumeUI();
            playScene(currentMode);
            saveState()
        },
        hide() {
            setWidgetHidden(true)
        },
        show() {
            setWidgetHidden(false, {
                focus: true
            })
        },
        getMode() {
            return currentMode
        }
    };
})();
