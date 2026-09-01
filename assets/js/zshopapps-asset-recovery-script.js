(function(){
    "use strict";
    const legacyMap={
        "preflix-app-prem-screen.png":"./assets/images/portal-lifetime/preflix-app-prem-screen.png",
        "preflix-feature-showcase.png":"./assets/images/portal-lifetime/preflix-feature-showcase.png",
        "preflix-logo.png":"./assets/images/portal-lifetime/preflix-logo.png",
        "preflix-menu-digital.png":"./assets/images/portal-lifetime/preflix-menu-digital.png",
        "preflix-menu-services.png":"./assets/images/portal-lifetime/preflix-menu-services.png"
    };
    document.querySelectorAll('img[src*="preflix-"]').forEach(img=>{
        let triedLegacy=false;
        img.addEventListener("error",()=>{
            const file=(img.getAttribute("src")||"").split("/").pop();
            if(!triedLegacy&&legacyMap[file]){
                triedLegacy=true;
                img.src=legacyMap[file];
                return;
            }
            const box=document.createElement("div");
            box.className="asset-error-placeholder";
            box.textContent="Gambar aset belum terunggah: "+(file||"portal-image.png");
            img.replaceWith(box);
        });
    });
})();
