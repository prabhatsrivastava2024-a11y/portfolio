(function(){
  const suggested = [
    'Summarize his experience',
    'What technologies/operations skills has he worked with?',
    'Tell me about Sodexo impact',
    'Show strongest achievements'
  ];

  const state = { open:false, loading:false, resume:null, context:'' };

  function escapeHtml(str){return str.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}

  function initUI(){
    const wrap = document.createElement('div');
    wrap.className = 'ai-chatbot';
    wrap.innerHTML = `
      <button class="ai-chatbot__fab" aria-label="Open AI Assistant">✦</button>
      <section class="ai-chatbot__panel" aria-live="polite">
        <header><strong>AI Portfolio Assistant</strong><button class="ai-chatbot__close" aria-label="Close">×</button></header>
        <div class="ai-chatbot__chips"></div>
        <div class="ai-chatbot__messages"></div>
        <div class="ai-chatbot__typing" hidden>Thinking<span></span></div>
        <form class="ai-chatbot__form"><input placeholder="Ask about experience, KPIs, or skills..."/><button>Send</button></form>
      </section>`;
    document.body.appendChild(wrap);

    const panel = wrap.querySelector('.ai-chatbot__panel');
    const fab = wrap.querySelector('.ai-chatbot__fab');
    const close = wrap.querySelector('.ai-chatbot__close');
    const form = wrap.querySelector('.ai-chatbot__form');
    const input = form.querySelector('input');
    const msgs = wrap.querySelector('.ai-chatbot__messages');
    const typing = wrap.querySelector('.ai-chatbot__typing');
    const chips = wrap.querySelector('.ai-chatbot__chips');

    function toggle(open = !state.open){ state.open=open; panel.classList.toggle('is-open',open); }
    fab.onclick=()=>toggle(true); close.onclick=()=>toggle(false);

    suggested.forEach(s=>{ const b=document.createElement('button'); b.type='button'; b.textContent=s; b.className='ai-chatbot__chip'; b.onclick=()=>ask(s); chips.appendChild(b); });

    function add(role, content){
      const div = document.createElement('div');
      div.className = `ai-msg ai-msg--${role}`;
      div.innerHTML = `<p>${escapeHtml(content)}</p>`;
      msgs.appendChild(div); msgs.scrollTop = msgs.scrollHeight;
    }

    async function ask(q){
      add('user', q); input.value=''; state.loading=true; typing.hidden=false;
      const answer = await getAssistantAnswer(q);
      typing.hidden=true; state.loading=false; add('assistant', answer);
    }

    form.onsubmit=(e)=>{ e.preventDefault(); const q=input.value.trim(); if(!q || state.loading) return; ask(q); };
    add('assistant','Hi! I can help recruiters quickly understand Prabhat’s experience, achievements, and strengths.');
  }

  async function loadContext(){
    const res = await fetch('data/resume-context.json');
    state.resume = await res.json();
    const portfolio = window.ContextEngine.collectPortfolioContext();
    state.context = window.ContextEngine.buildPromptContext(state.resume, portfolio);
  }

  async function getAssistantAnswer(q){
    const lower = q.toLowerCase();
    if (lower.includes('summarize')) return 'Prabhat is a senior operations leader with 25+ years in healthcare, IFM, and retail, known for multi-site delivery, compliance excellence, and P&L improvement.';
    if (lower.includes('sodexo') || lower.includes('impact')) return 'At Sodexo India, he led a North India healthcare portfolio with metrics including ₹4 Cr managed revenue, 99% retention, and +18% EBITDA growth while leading 1,500+ workforce.';
    if (lower.includes('skill') || lower.includes('technolog')) return `Core strengths: ${(state.resume?.skills||[]).join(', ')}.`;
    const snippet = state.context.slice(0,700);
    return `Based on portfolio context: ${snippet} ...\n\nRecruiter summary: He combines operational governance, growth focus, and people leadership with strong measurable outcomes.`;
  }

  async function bootstrap(){
    await loadContext();
    initUI();
  }

  window.addEventListener('load', ()=>setTimeout(()=>bootstrap().catch(console.error), 300));
})();
