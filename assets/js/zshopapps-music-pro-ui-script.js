(function() {
    "use strict";
    const dock = document.getElementById("musicDock");
    const audio = document.getElementById("playlistAudio");
    const play = document.getElementById("musicPlay");
    const volumeToggle = document.getElementById("musicVolumeToggle");
    const mute = document.getElementById("musicMute");
    const search = document.getElementById("musicPlaylistSearch");
    const visibleCount = document.getElementById("musicPlaylistVisibleCount");
    const empty = document.getElementById("musicPlaylistEmpty");
    const items = [...document.querySelectorAll(".playlist-item")];
    if (!dock || !audio || !play) return;

    const icons = {
        play: '<svg aria-hidden="true" class="music-icon" viewBox="0 0 24 24"><path class="icon-fill" d="m8 5 11 7-11 7z"/></svg>',
        pause: '<svg aria-hidden="true" class="music-icon" viewBox="0 0 24 24"><path class="icon-fill" d="M7 5h4v14H7zM14 5h4v14h-4z"/></svg>',
        volume: '<svg aria-hidden="true" class="music-icon" viewBox="0 0 24 24"><path d="M4 10v4h4l5 4V6L8 10H4Zm12.5-2.5a6 6 0 0 1 0 9M15 10a3 3 0 0 1 0 4"/></svg>',
        low: '<svg aria-hidden="true" class="music-icon" viewBox="0 0 24 24"><path d="M4 10v4h4l5 4V6L8 10H4Zm11 0a3 3 0 0 1 0 4"/></svg>',
        mute: '<svg aria-hidden="true" class="music-icon" viewBox="0 0 24 24"><path d="M4 10v4h4l5 4V6L8 10H4Zm12-1 5 6m0-6-5 6"/></svg>'
    };

    function syncVisualState() {
        const playing = !audio.paused;
        play.innerHTML = icons[playing ? "pause" : "play"];
        items.forEach((item, index) => {
            const current = item.classList.contains("is-current");
            item.classList.toggle("is-playing", current && playing);
        });
        const muted = audio.muted || audio.volume === 0;
        const volumeIcon = muted ? "mute" : audio.volume < .45 ? "low" : "volume";
        if (volumeToggle) volumeToggle.innerHTML = icons[volumeIcon];
        if (mute) {
            mute.innerHTML = icons[muted ? "mute" : "volume"] + "<span>" + (muted ? "Aktifkan suara" : "Suara aktif") + "</span>";
        }
    }

    ["play", "pause", "volumechange", "loadedmetadata", "ended"].forEach(type => {
        audio.addEventListener(type, () => requestAnimationFrame(syncVisualState));
    });
    items.forEach(item => item.addEventListener("click", () => requestAnimationFrame(syncVisualState)));

    function filterPlaylist() {
        const query = (search ?.value || "").trim().toLocaleLowerCase("id-ID");
        let shown = 0;
        items.forEach(item => {
            const haystack = (item.dataset.trackSearch || item.textContent || "").toLocaleLowerCase("id-ID");
            const match = !query || haystack.includes(query);
            item.hidden = !match;
            if (match) shown++;
        });
        if (visibleCount) visibleCount.textContent = String(shown);
        if (empty) empty.hidden = shown !== 0;
    }
    search ?.addEventListener("input", filterPlaylist);
    search ?.addEventListener("keydown", event => {
        if (event.key === "Escape" && search.value) {
            search.value = "";
            filterPlaylist();
        }
    });

    dock.addEventListener("keydown", event => {
        const tag = event.target ?.tagName;
        if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
        if (event.code === "Space") {
            event.preventDefault();
            play.click();
        } else if (event.key === "ArrowLeft" && Number.isFinite(audio.duration)) {
            event.preventDefault();
            audio.currentTime = Math.max(0, audio.currentTime - 10);
        } else if (event.key === "ArrowRight" && Number.isFinite(audio.duration)) {
            event.preventDefault();
            audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
        }
    });

    filterPlaylist();
    syncVisualState();
})();
