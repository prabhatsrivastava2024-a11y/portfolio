(function(){
  const suggested = ['Summarize his experience','What measurable outcomes did he achieve?','What impact did he create at Sodexo?','What are his strongest skills?'];
  const state = { open:false, loading:false, resume:null, context:'', controller:null };

  const esc = (s='')=>s.replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  function initUI(){
    const wrap=document.createElement('div');wrap.className='ai-chatbot';
    wrap.innerHTML=`<button class="ai-chatbot__fab" aria-label="Open AI Assistant">✦</button><section class="ai-chatbot__panel" aria-live="polite"><header><strong>AI Portfolio Assistant</strong><button class="ai-chatbot__close" aria-label="Close">×</button></header><div class="ai-chatbot__chips"></div><div class="ai-chatbot__messages"></div><div class="ai-chatbot__typing" hidden>Thinking…</div><form class="ai-chatbot__form"><input placeholder="Ask recruiter-style questions..."/><button>Send</button></form></section>`;
    document.body.appendChild(wrap);

    const panel=wrap.querySelector('.ai-chatbot__panel'),fab=wrap.querySelector('.ai-chatbot__fab'),close=wrap.querySelector('.ai-chatbot__close');
    const msgs=wrap.querySelector('.ai-chatbot__messages'),typing=wrap.querySelector('.ai-chatbot__typing'),form=wrap.querySelector('form'),input=wrap.querySelector('input'),chips=wrap.querySelector('.ai-chatbot__chips');
    fab.onclick=()=>panel.classList.toggle('is-open',true);close.onclick=()=>panel.classList.remove('is-open');

    const add=(role,t)=>{const d=document.createElement('div');d.className=`ai-msg ai-msg--${role}`;d.innerHTML=`<p>${esc(t)}</p>`;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;};
    suggested.forEach(q=>{const b=document.createElement('button');b.type='button';b.className='ai-chatbot__chip';b.textContent=q;b.onclick=()=>ask(q);chips.appendChild(b);});

    const ask = async (q)=>{
      add('user',q); input.value=''; typing.hidden=false; state.loading=true;
      try{ state.controller?.abort(); state.controller = new AbortController(); const resp=await getAssistantAnswer(q,state.controller.signal); add('assistant',resp); }
      catch(e){ add('assistant',`I couldn't fetch Gemini right now. ${e.message}`); }
      finally{ typing.hidden=true; state.loading=false; }
    };

    form.onsubmit=(e)=>{e.preventDefault();const q=input.value.trim();if(!q||state.loading)return;ask(q);};
    add('assistant','Hi! Ask me about experience, impact metrics, strengths, and achievements.');
  }

  async function loadContext(){
    const resume = await fetch('data/resume-context.json').then(r=>r.json());
    const portfolio = window.ContextEngine.collectPortfolioContext();
    state.resume = resume;
    state.context = window.ContextEngine.buildPromptContext(resume, portfolio);
  }

  async function getAssistantAnswer(q, signal){
    try { return await window.GeminiService.callGemini({prompt:q, context:state.context, signal}); }
    catch (_) {
      const lower=q.toLowerCase();
      if(lower.includes('sodexo')) return 'At Sodexo India he led healthcare operations across North India with ₹4 Cr portfolio revenue, 99% client retention, 1,500+ workforce, and +18% EBITDA growth.';
      if(lower.includes('skill')) return `Core strengths: ${(state.resume?.skills||[]).join(', ')}.`;
      return 'He is a 25+ year operations leader focused on healthcare, IFM, compliance, and multi-site business performance.';
    }
  }

  window.addEventListener('load',()=>setTimeout(()=>loadContext().then(initUI).catch(console.error),250));
})();
