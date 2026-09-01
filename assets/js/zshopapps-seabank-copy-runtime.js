(()=>{
  const SEA_BANK_ACCOUNT = '901297235411';
  const copyValue = async (value, button) => {
    const original = button.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const area = document.createElement('textarea');
        area.value = value; area.setAttribute('readonly',''); area.style.position = 'fixed'; area.style.opacity = '0';
        document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove();
      }
      button.textContent = 'Tersalin ✓';
    } catch (_) {
      button.textContent = 'Salin: ' + value;
    }
    window.setTimeout(()=>{ button.textContent = original; }, 1800);
  };
  document.querySelectorAll('[data-copy-seabank-account]').forEach(button=>{
    button.addEventListener('click', ()=>copyValue(SEA_BANK_ACCOUNT, button));
  });
})();
