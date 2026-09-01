(function() {
    const appTotal = document.querySelectorAll('#productGrid .product-card').length;
    const testimonialTotal = document.querySelectorAll('#testimoni .testimonial-card').length;
    const socialCards = [...document.querySelectorAll('#kontak .social-card')];
    document.querySelectorAll('.app-total').forEach(el => el.textContent = '[' + appTotal + ']');
    const visibleCount = document.getElementById('visibleProductCount');
    if (visibleCount && !document.getElementById('searchInput').value) visibleCount.textContent = appTotal;
    document.querySelectorAll('.social-total').forEach(el => el.textContent = '[' + socialCards.length + ']');

    const toggle = document.getElementById('toggleSocials');
    if (toggle) {
        let expanded = false;
        const apply = () => {
            socialCards.forEach((card, index) => {
                if (index >= 30) card.hidden = !expanded;
            });
            toggle.setAttribute('aria-expanded', String(expanded));
            toggle.textContent = expanded ? 'Tampilkan 30 Sosmed Utama' : 'Lihat Semua ' + socialCards.length + ' Sosmed';
        };
        toggle.addEventListener('click', () => {
            expanded = !expanded;
            apply();
        });
        apply();
    }

    document.querySelectorAll('#kontak a[data-placeholder="true"]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            alert('URL resmi sosmed ini belum diisi. Silakan hubungi owner ZSHOPAPPS.');
        });
    });
})();
