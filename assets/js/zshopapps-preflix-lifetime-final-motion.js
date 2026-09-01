(function () {
    "use strict";

    const section = document.getElementById("testimoni");
    const cards = section ? Array.from(section.querySelectorAll(".testimonial-card")).slice(0, 20) : [];
    if (section && cards.length) {
        const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        cards.forEach((card, index) => card.style.setProperty("--testimonial-delay", `${Math.min(index, 9) * 45}ms`));
        if (reduced || !("IntersectionObserver" in window)) {
            section.classList.add("motion-ready");
            cards.forEach(card => card.classList.add("is-visible"));
        } else {
            section.classList.add("motion-ready");
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            }, { rootMargin: "0px 0px -8% 0px", threshold: .12 });
            cards.forEach(card => observer.observe(card));
        }
    }

    // Portal quantity is intentionally fixed to one license per transaction.
    const portalCard = document.querySelector('.product-card[data-product-type="business-portal"]');
    if (portalCard) {
        const enforceOne = () => {
            portalCard.dataset.quantity = "1";
            const input = portalCard.querySelector(".qty-input");
            const minus = portalCard.querySelector(".qty-minus");
            const plus = portalCard.querySelector(".qty-plus");
            if (input) {
                input.value = "1";
                input.min = "1";
                input.max = "1";
                input.readOnly = true;
                input.setAttribute("aria-readonly", "true");
            }
            if (minus) minus.disabled = true;
            if (plus) plus.disabled = true;
        };
        enforceOne();
        portalCard.addEventListener("input", enforceOne, true);
        portalCard.addEventListener("change", enforceOne, true);
    }
})();
