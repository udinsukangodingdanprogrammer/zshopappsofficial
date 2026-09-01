(()=>{
  'use strict';
  const start=document.getElementById('preflixRegisterStart');
  if(!start)return;
  start.addEventListener('click',()=>{
    const card=document.querySelector('#productGrid .product-card[data-product-type="business-portal"]');
    if(card&&window.ZSHOP_CART){
      window.ZSHOP_CART.addFromCard(card);
      window.ZSHOP_CART.open();
      window.setTimeout(()=>document.getElementById('cartBuyerName')?.focus(),120);
      return;
    }
    card?.querySelector('[data-buy]')?.click();
  });
})();
