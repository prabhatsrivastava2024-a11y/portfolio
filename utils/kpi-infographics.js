(function(){
  const isMobile = matchMedia('(max-width: 767px)').matches;

  function numberFrom(v){ const m=(v||'').match(/-?\d+(?:\.\d+)?/); return m?Math.min(100,Math.abs(+m[0])):65; }

  function enhanceKpiChip(kpi){
    if(kpi.querySelector('.kpi-mini')) return;
    const v = kpi.querySelector('.v')?.textContent || '';
    const pct = numberFrom(v);
    const mini = document.createElement('span');
    mini.className='kpi-mini';
    mini.innerHTML = `<svg viewBox="0 0 36 36" class="kpi-mini-ring"><circle cx="18" cy="18" r="15" class="bg"></circle><circle cx="18" cy="18" r="15" class="fg" style="stroke-dashoffset:${94-pct*0.94}"></circle></svg><span class="kpi-mini-bars"><i style="--h:35%"></i><i style="--h:65%"></i><i style="--h:90%"></i></span>`;
    kpi.appendChild(mini);
  }

  function enhanceCard(card){
    if(card.querySelector('.kpi-infographic')) return;
    card.classList.add('kpi-on-hover'); card.style.position='relative';
    const metrics=card.querySelectorAll('.kpi'); metrics.forEach((m,i)=>{ enhanceKpiChip(m); m.style.setProperty('--delay',`${i*70}ms`); });
    const overlay=document.createElement('div'); overlay.className='kpi-infographic';
    overlay.innerHTML='<div class="kpi-overlay-title">Impact Infographics</div><div class="kpi-overlay-line"></div><div class="kpi-overlay-bars"><i></i><i></i><i></i><i></i></div>';
    card.appendChild(overlay);
    if(isMobile){ card.addEventListener('click',()=>card.classList.toggle('kpi-tap')); }
  }

  window.addEventListener('load',()=>document.querySelectorAll('.item .card, .svc').forEach(enhanceCard));
})();
