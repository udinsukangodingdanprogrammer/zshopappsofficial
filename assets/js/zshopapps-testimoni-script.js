function openTestimoni(el) {
    const img = el.querySelector("img").src;
    const w = window.open();
    if (w) {
        w.document.write('<title>Testimoni ZSHOPAPPS</title><img style="max-width:100%;display:block;margin:auto" src="' + img + '">');
    }
}
