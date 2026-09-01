(function() {
    "use strict";

    const modal = document.getElementById("purchaseThanksModal");
    const textNode = document.getElementById("purchaseThanksText");
    const codeNode = document.getElementById("purchaseThanksCode");
    const whatsappButton = document.getElementById("purchaseThanksWhatsApp");
    const telegramPrimaryButton = document.getElementById("purchaseThanksTelegramPrimary");
    const telegramSecondaryButton = document.getElementById("purchaseThanksTelegramSecondary");
    let lastWhatsAppUrl = "";
    let lastTelegramPrimaryUrl = "";
    let lastTelegramSecondaryUrl = "";

    function complimentForGreeting(greeting) {
        if (["Abang", "Om"].includes(greeting)) return "ganteng";
        if (["Neng", "Mbak"].includes(greeting)) return "cantik";
        return "ganteng/cantik";
    }

    function makeThankYou(greeting) {
        const safeGreeting = greeting || "Kakak";
        const compliment = complimentForGreeting(safeGreeting);

        return (
            "Terima kasih sudah berkunjung dan mampir beli di ZSHOPAPPS. " +
            "Semoga rezekinya semakin lancar, banyak, berkah, dan melimpah. " +
            "Semoga semua urusannya dipermudah, usahanya makin sukses, dan " +
            safeGreeting + " sehat selalu, panjang umur, bahagia, serta tetap " +
            compliment + "! Ditunggu mampir dan belanja lagi di ZSHOPAPPS ya. 💚"
        );
    }

    function open(payload) {
        if (!payload) return;

        const greeting = payload.greeting || "Kakak";
        const thanks = payload.thanks || makeThankYou(greeting);
        textNode.textContent = thanks;
        codeNode.textContent = payload.code || "-";

        lastWhatsAppUrl = payload.whatsappUrl || "";
        lastTelegramPrimaryUrl = payload.telegramPrimaryUrl || payload.telegramUrl || "";
        lastTelegramSecondaryUrl = payload.telegramSecondaryUrl || "";
        whatsappButton.hidden = !lastWhatsAppUrl;
        telegramPrimaryButton.hidden = !lastTelegramPrimaryUrl;
        telegramSecondaryButton.hidden = !lastTelegramSecondaryUrl;

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("purchase-thanks-open");

        setTimeout(
            () => modal.querySelector(".purchase-thanks-close") ?.focus(),
            30
        );
    }

    function close() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("purchase-thanks-open");
    }

    document.querySelectorAll("[data-purchase-thanks-close]")
        .forEach(element => element.addEventListener("click", close));

    whatsappButton.addEventListener("click", () => {
        if (lastWhatsAppUrl) {
            window.open(lastWhatsAppUrl, "_blank", "noopener");
        }
    });

    telegramPrimaryButton.addEventListener("click", () => {
        if (lastTelegramPrimaryUrl) {
            window.open(lastTelegramPrimaryUrl, "_blank", "noopener");
        }
    });

    telegramSecondaryButton.addEventListener("click", () => {
        if (lastTelegramSecondaryUrl) {
            window.open(lastTelegramSecondaryUrl, "_blank", "noopener");
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            close();
        }
    });

    window.ZSHOP_COMPLETION = {
        open,
        close,
        makeThankYou,
        complimentForGreeting
    };
})();
