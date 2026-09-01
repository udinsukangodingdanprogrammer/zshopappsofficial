(function() {
    function fillMiniApps() {
        const chips = [...document.querySelectorAll('.visual .app-chip')].slice(0, 20);
        document.querySelectorAll('[data-mini-app]').forEach((el, index) => {
            const src = chips[index] ?.querySelector('img');
            if (!src || el.querySelector('img')) return;
            const img = src.cloneNode(true);
            img.width = 38;
            img.height = 38;
            el.querySelector('.mini-app-placeholder') ?.remove();
            el.prepend(img);
        });
        document.querySelectorAll('[data-drawer-app]').forEach((el, index) => {
            const src = chips[index] ?.querySelector('img');
            if (!src || el.querySelector('img')) return;
            const img = src.cloneNode(true);
            img.width = 28;
            img.height = 28;
            el.append(img);
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fillMiniApps);
    else fillMiniApps();
})();
