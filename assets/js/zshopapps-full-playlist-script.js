(function() {
    "use strict";
    const DEFAULT_VOLUME = 0.40;

    const dataNode = document.getElementById("zshopapps-playlist-data");
    const audio = document.getElementById("playlistAudio");
    const dock = document.getElementById("musicDock");
    const headerButton = document.getElementById("musicBtn");
    const playButton = document.getElementById("musicPlay");
    const prevButton = document.getElementById("musicPrev");
    const nextButton = document.getElementById("musicNext");
    const muteButton = document.getElementById("musicMute");
    const hideButton = document.getElementById("musicHide");
    const playlistToggle = document.getElementById("playlistToggle");
    const seek = document.getElementById("musicSeek");
    const volume = document.getElementById("musicVolume");
    const volumePanel = document.getElementById("musicVolumePanel");
    const volumeValue = document.getElementById("musicVolumeValue");
    const volumePanelValue = document.getElementById("musicVolumePanelValue");
    const currentTimeNode = document.getElementById("musicCurrent");
    const durationNode = document.getElementById("musicDuration");
    const titleNode = document.getElementById("musicTitle");
    const artistNode = document.getElementById("musicArtist");
    const coverNode = document.getElementById("musicCover");
    const panelTitleNode = document.getElementById("musicPanelTitle");
    const panelArtistNode = document.getElementById("musicPanelArtist");
    const panelCoverNode = document.getElementById("musicPanelCover");
    const repeatButton = document.getElementById("repeatMode");
    const shuffleButton = document.getElementById("shuffleMode");
    const toast = document.getElementById("musicToast");
    const trackButtons = Array.from(document.querySelectorAll(".playlist-item"));

    if (!dataNode || !audio || !dock || !headerButton || !playButton) return;

    const tracks = JSON.parse(dataNode.textContent);
    let currentIndex = 0;
    let repeatMode = "all";
    let shuffle = false;
    let manuallyPaused = false;
    let autoplayUnlocked = false;
    let trackChanging = false;
    let recoveryBusy = false;
    let toastTimer = null;

    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
        const value = Math.floor(seconds);
        return Math.floor(value / 60) + ":" + String(value % 60).padStart(2, "0");
    }

    function setRangeProgress(input, value) {
        const min = Number(input.min) || 0;
        const max = Number(input.max) || 100;
        const percent = ((value - min) / (max - min)) * 100;
        input.style.setProperty("--range-progress", Math.max(0, Math.min(100, percent)) + "%");
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("is-visible");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2100);
    }

    function syncPlaylistHighlight() {
        trackButtons.forEach((button, index) => {
            button.classList.toggle("is-current", index === currentIndex);
            button.setAttribute("aria-current", index === currentIndex ? "true" : "false");
        });
    }

    function syncPlayingState() {
        const playing = !audio.paused;
        playButton.textContent = playing ? "❚❚" : "▶";
        playButton.setAttribute("aria-label", playing ? "Jeda musik" : "Putar musik");
        headerButton.classList.toggle("is-playing", playing);
        headerButton.classList.toggle("needs-action", !playing && !manuallyPaused);
        headerButton.setAttribute("aria-expanded", String(dock.classList.contains("is-open")));
        headerButton.setAttribute(
            "aria-label",
            playing ? "Buka playlist, musik sedang diputar" : "Buka pemutar musik"
        );
    }

    function syncVolume() {
        volume.value = String(audio.volume);
        volumePanel.value = String(audio.volume);
        setRangeProgress(volume, audio.volume);
        setRangeProgress(volumePanel, audio.volume);
        const percent = Math.round(audio.volume * 100);
        if (volumeValue) volumeValue.textContent = percent + "%";
        if (volumePanelValue) volumePanelValue.textContent = percent + "%";
        muteButton.textContent = audio.muted || audio.volume === 0 ? "🔇" : audio.volume < 0.45 ? "🔉" : "🔊";
        muteButton.setAttribute(
            "aria-label",
            audio.muted ? "Aktifkan suara" : "Matikan suara"
        );
    }


    function resolveTrackSource(track) {
        return track && track.src ? track.src : "";
    }

    function loadTrack(index, autoplay) {
        if (!tracks.length) return;
        currentIndex = (index + tracks.length) % tracks.length;
        const track = tracks[currentIndex];

        trackChanging = true;
        audio.src = resolveTrackSource(track);
        audio.load();
        titleNode.textContent = track.title;
        artistNode.textContent = track.artist;
        coverNode.textContent = track.icon || String(currentIndex + 1);
        if (panelTitleNode) panelTitleNode.textContent = track.title;
        if (panelArtistNode) panelArtistNode.textContent = track.artist;
        if (panelCoverNode) panelCoverNode.textContent = track.icon || String(currentIndex + 1);
        currentTimeNode.textContent = "0:00";
        durationNode.textContent = formatTime(track.duration);
        seek.value = "0";
        setRangeProgress(seek, 0);
        syncPlaylistHighlight();
        setTimeout(() => {
            trackChanging = false;
        }, 0);

        try {
            localStorage.setItem("zshopappsMusicTrack", String(currentIndex));
        } catch (error) {}

        if (autoplay) {
            playAudio();
        } else {
            syncPlayingState();
        }
    }

    async function playAudio() {
        manuallyPaused = false;
        audio.muted = false;
        audio.defaultMuted = false;
        if (!Number.isFinite(audio.volume) || audio.volume <= 0) {
            audio.volume = DEFAULT_VOLUME;
        }
        try {
            await audio.play();
            autoplayUnlocked = true;
            syncPlayingState();
            return true;
        } catch (error) {
            syncPlayingState();
            return false;
        }
    }

    function pauseAudio() {
        manuallyPaused = true;
        audio.pause();
        syncPlayingState();
    }

    function togglePlay() {
        if (audio.paused) playAudio();
        else pauseAudio();
    }

    function nextIndex() {
        if (shuffle && tracks.length > 1) {
            let candidate = currentIndex;
            while (candidate === currentIndex) {
                candidate = Math.floor(Math.random() * tracks.length);
            }
            return candidate;
        }
        return (currentIndex + 1) % tracks.length;
    }

    function nextTrack() {
        loadTrack(nextIndex(), true);
    }

    function previousTrack() {
        if (audio.currentTime > 4) {
            audio.currentTime = 0;
            return;
        }
        loadTrack(currentIndex - 1, true);
    }

    function handleEnded() {
        if (repeatMode === "one") {
            audio.currentTime = 0;
            playAudio();
            return;
        }
        if (repeatMode === "off" && currentIndex === tracks.length - 1 && !shuffle) {
            manuallyPaused = true;
            audio.pause();
            audio.currentTime = 0;
            syncPlayingState();
            return;
        }
        nextTrack();
    }

    function toggleDock() {
        dock.classList.remove("is-hidden");
        dock.classList.toggle("is-open");
        const open = dock.classList.contains("is-open");
        playlistToggle.setAttribute("aria-expanded", String(open));
        headerButton.setAttribute("aria-expanded", String(open));
    }

    function restoreDock() {
        dock.classList.remove("is-hidden");
        showToast("Pemutar musik ditampilkan kembali");
    }

    playButton.addEventListener("click", togglePlay);
    prevButton.addEventListener("click", previousTrack);
    nextButton.addEventListener("click", nextTrack);
    headerButton.addEventListener("click", function() {
        if (dock.classList.contains("is-hidden")) restoreDock();
        else toggleDock();
    });
    playlistToggle.addEventListener("click", toggleDock);
    hideButton.addEventListener("click", function() {
        dock.classList.add("is-hidden");
        showToast("Pemutar disembunyikan. Tekan ikon ♫ di header untuk membuka.");
    });

    muteButton.addEventListener("click", function() {
        audio.muted = !audio.muted;
        syncVolume();
    });

    function setVolume(value) {
        const normalized = Math.max(0, Math.min(1, Number(value)));
        audio.volume = normalized;
        audio.muted = false;
        try {
            localStorage.setItem("zshopappsMusicVolume", String(normalized));
        } catch (error) {}
        syncVolume();
    }

    volume.addEventListener("input", event => setVolume(event.target.value));
    volumePanel.addEventListener("input", event => setVolume(event.target.value));

    seek.addEventListener("input", function() {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        audio.currentTime = (Number(seek.value) / 100) * audio.duration;
        setRangeProgress(seek, Number(seek.value));
    });

    repeatButton.addEventListener("click", function() {
        if (repeatMode === "all") {
            repeatMode = "one";
            repeatButton.textContent = "Ulang Satu";
        } else if (repeatMode === "one") {
            repeatMode = "off";
            repeatButton.textContent = "Ulang Mati";
        } else {
            repeatMode = "all";
            repeatButton.textContent = "Ulang Semua";
        }
        repeatButton.classList.toggle("is-active", repeatMode !== "off");
    });

    shuffleButton.addEventListener("click", function() {
        shuffle = !shuffle;
        shuffleButton.textContent = shuffle ? "Acak Aktif" : "Acak Mati";
        shuffleButton.classList.toggle("is-active", shuffle);
    });

    trackButtons.forEach(button => {
        button.addEventListener("click", function() {
            const index = Number(button.dataset.trackIndex);
            loadTrack(index, true);
        });
    });

    audio.addEventListener("play", function() {
        manuallyPaused = false;
        autoplayUnlocked = true;
        syncPlayingState();
    });
    audio.addEventListener("pause", function() {
        if (!trackChanging && !document.hidden && !audio.ended) {
            manuallyPaused = true;
        }
        syncPlayingState();
    });
    audio.addEventListener("volumechange", syncVolume);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadedmetadata", function() {
        durationNode.textContent = formatTime(audio.duration || tracks[currentIndex].duration);
    });
    audio.addEventListener("timeupdate", function() {
        currentTimeNode.textContent = formatTime(audio.currentTime);
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
            const progress = (audio.currentTime / audio.duration) * 100;
            seek.value = String(progress);
            setRangeProgress(seek, progress);
        }
    });
    audio.addEventListener("error", function() {
        showToast("Musik gagal dimuat. Coba pilih musik lain.");
    });

    let restoredTrack = 0;
    let restoredVolume = DEFAULT_VOLUME;
    try {
        const savedTrack = Number(
            localStorage.getItem("zshopappsMusicTrack")
        );
        const savedVolume = Number(
            localStorage.getItem("zshopappsMusicVolume")
        );
        if (
            Number.isInteger(savedTrack) &&
            savedTrack >= 0 &&
            savedTrack < tracks.length
        ) {
            restoredTrack = savedTrack;
        }
        if (
            Number.isFinite(savedVolume) &&
            savedVolume >= 0 &&
            savedVolume <= 1
        ) {
            restoredVolume = savedVolume;
        }
    } catch (error) {}

    audio.volume = restoredVolume;
    audio.muted = false;
    audio.defaultMuted = false;
    loadTrack(restoredTrack, false);
    syncVolume();
    syncPlayingState();

    function recoverPlayback() {
        if (
            recoveryBusy ||
            manuallyPaused ||
            !autoplayUnlocked ||
            document.hidden ||
            !audio.paused ||
            audio.ended ||
            trackChanging
        ) return;

        recoveryBusy = true;
        playAudio().finally(() => {
            recoveryBusy = false;
        });
    }

    document.addEventListener("visibilitychange", function() {
        if (!document.hidden) {
            setTimeout(recoverPlayback, 350);
        }
    });

    window.addEventListener("pageshow", function() {
        setTimeout(recoverPlayback, 350);
    });

    audio.addEventListener("canplay", function() {
        if (!manuallyPaused && autoplayUnlocked) {
            setTimeout(recoverPlayback, 200);
        }
    });
})();
