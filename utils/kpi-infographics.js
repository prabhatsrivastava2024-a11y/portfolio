(function(){
  function enhanceCard(card){
    if(card.querySelector('.kpi-infographic')) return;
    card.classList.add('kpi-on-hover');
    card.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.className = 'kpi-infographic';
    overlay.innerHTML = `<svg class="kpi-ring" viewBox="0 0 56 56"><circle class="bg" cx="28" cy="28" r="25"/><circle class="fg" cx="28" cy="28" r="25"/></svg><div><div class="kpi-bars"><i style="height:40%"></i><i style="height:65%"></i><i style="height:82%"></i><i style="height:55%"></i></div><small style="color:rgba(255,255,255,.85)">Impact KPIs · Hover Insights</small></div>`;
    card.appendChild(overlay);
  }

  window.addEventListener('load', ()=>{
    document.querySelectorAll('.item .card, .svc').forEach(enhanceCard);
  });
})();
