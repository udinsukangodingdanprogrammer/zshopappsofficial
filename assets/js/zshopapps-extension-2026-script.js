(()=>{
  'use strict';
  document.documentElement.classList.add('zshop-motion-ready');
  const cards=[...document.querySelectorAll('.extension-product-card')];
  const syncArt=card=>{
    const selected=card.dataset.selectedPlan || card.dataset.defaultAsia || '1-bulan';
    card.querySelectorAll('[data-plan-art]').forEach(img=>img.classList.toggle('is-active',img.dataset.planArt===selected));
    const thumb=card.querySelector('.product-head img');
    const active=card.querySelector(`[data-plan-art="${CSS.escape(selected)}"]`);
    if(thumb&&active) thumb.src=active.getAttribute('src');
  };
  cards.forEach(card=>{
    syncArt(card);
    card.addEventListener('click',event=>{
      if(event.target.closest('.plan-option')) requestAnimationFrame(()=>syncArt(card));
    });
  });
  setTimeout(()=>cards.forEach(syncArt),80);
  const reveal=[...document.querySelectorAll('.extension-reveal,.testimonial-card,.testimoni-png-card')];
  if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-inview');io.unobserve(entry.target);}
    }),{threshold:.12,rootMargin:'0px 0px -5%'});
    reveal.forEach((node,index)=>{node.style.transitionDelay=`${Math.min(index%6,5)*45}ms`;io.observe(node);});
  }else reveal.forEach(node=>node.classList.add('is-inview'));
})();
