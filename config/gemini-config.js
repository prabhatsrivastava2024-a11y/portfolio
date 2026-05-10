(function(global){
  const cfg = {
    model: 'gemini-2.0-flash',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    apiKey: global.GEMINI_API_KEY || global.__ENV__?.GEMINI_API_KEY || '',
    maxOutputTokens: 450,
    temperature: 0.3,
    retryCount: 2
  };
  global.GeminiConfig = {
    get(){ return {...cfg}; },
    set(partial){ Object.assign(cfg, partial || {}); }
  };
})(window);
