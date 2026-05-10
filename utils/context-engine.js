(function(global){
  const txt=(el)=>(el?.textContent||'').replace(/\s+/g,' ').trim();
  function collectPortfolioContext(){
    const sections=[...document.querySelectorAll('main section')].map(sec=>({id:sec.id,title:txt(sec.querySelector('h2')),summary:txt(sec).slice(0,1200)}));
    const cards=[...document.querySelectorAll('.item .card, .svc')].map(card=>({title:txt(card.querySelector('h3')),period:txt(card.querySelector('.period')),role:txt(card.querySelector('.role')),bullets:[...card.querySelectorAll('.b span:last-child, li span:last-child')].map(txt).filter(Boolean),kpis:[...card.querySelectorAll('.kpi')].map(k=>({value:txt(k.querySelector('.v')),label:txt(k.querySelector('.l')),detail:txt(k.querySelector('.d'))}))}));
    return { sections, cards, generatedAt: new Date().toISOString() };
  }
  function buildPromptContext(resume, portfolio){
    return JSON.stringify({resume, portfolio});
  }
  global.ContextEngine={collectPortfolioContext, buildPromptContext};
})(window);
