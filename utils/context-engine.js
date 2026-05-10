(function(global){
  function text(el){ return (el?.textContent || '').replace(/\s+/g,' ').trim(); }

  function collectPortfolioContext(){
    const sections = Array.from(document.querySelectorAll('main section')).map(sec => ({
      id: sec.id,
      title: text(sec.querySelector('h2')),
      content: text(sec).slice(0, 1200)
    }));

    const cards = Array.from(document.querySelectorAll('.item .card, .svc')).map(card => ({
      title: text(card.querySelector('h3')),
      period: text(card.querySelector('.period')),
      role: text(card.querySelector('.role')),
      bullets: Array.from(card.querySelectorAll('.b span:last-child, li span:last-child')).map(text).filter(Boolean),
      kpis: Array.from(card.querySelectorAll('.kpi')).map(k=>({ value:text(k.querySelector('.v')), label:text(k.querySelector('.l')), detail:text(k.querySelector('.d')) }))
    }));

    return { sections, cards };
  }

  function buildPromptContext(resumeContext, portfolioContext){
    return `PROFILE: ${JSON.stringify(resumeContext?.profile || {})}\nSKILLS: ${(resumeContext?.skills || []).join(', ')}\nEXPERIENCE: ${JSON.stringify(resumeContext?.experience || [])}\nPORTFOLIO: ${JSON.stringify(portfolioContext || {})}`;
  }

  global.ContextEngine = { collectPortfolioContext, buildPromptContext };
})(window);
