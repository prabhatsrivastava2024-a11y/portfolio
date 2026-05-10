(function(global){
  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));

  async function callGemini({prompt, context, signal}){
    const cfg = global.GeminiConfig.get();
    if(!cfg.apiKey) throw new Error('Missing Gemini API key. Set window.GEMINI_API_KEY before chatbot loads.');
    const url = `${cfg.endpoint}/${cfg.model}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`;
    const payload = {
      contents:[{role:'user',parts:[{text:`You are a professional recruiter assistant.\nContext:\n${context}\n\nQuestion:\n${prompt}`}]}],
      generationConfig:{temperature:cfg.temperature,maxOutputTokens:cfg.maxOutputTokens}
    };

    let err;
    for(let i=0;i<=cfg.retryCount;i++){
      try{
        const res = await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal});
        if(res.status===429) throw new Error('Rate limited by Gemini API. Please retry.');
        if(!res.ok) throw new Error(`Gemini API error ${res.status}`);
        const data = await res.json();
        return data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join('\n') || 'No response generated.';
      } catch(e){ err=e; if(i<cfg.retryCount) await sleep(500*(i+1)); }
    }
    throw err;
  }

  global.GeminiService = { callGemini };
})(window);
