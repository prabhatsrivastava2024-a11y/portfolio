# AI-Enhanced Portfolio

## Architecture
- `config/gemini-config.js`: centralized Gemini model + API settings (no hardcoded key in UI logic).
- `components/chatbot/gemini-service.js`: async Gemini API client with retries and safe error handling.
- `components/chatbot/chatbot.js`: floating assistant UI, typing state, recruiter prompt chips, context-aware answers.
- `utils/context-engine.js`: builds dynamic context from resume JSON + existing portfolio sections/cards.
- `utils/kpi-infographics.js`: reusable infographic enhancer for cards and KPI chips.

## Gemini API setup
1. Before loading chatbot scripts, provide API key via runtime global:
   - `window.GEMINI_API_KEY = 'your-key';`
   - or `window.__ENV__ = { GEMINI_API_KEY: 'your-key' }`.
2. Default model is `gemini-2.0-flash`.
3. To change model/settings:
   - call `window.GeminiConfig.set({ model: 'gemini-1.5-pro', temperature: 0.2 })`.

## How chatbot works
- Loads `data/resume-context.json`.
- Parses live DOM content from experience/services sections.
- Builds one structured context payload and sends it to Gemini.
- If API fails/rate-limits, chatbot falls back to local recruiter-safe summaries.

## KPI infographic system
- Every existing KPI chip gets an inline micro infographic (mini ring + bars).
- Every experience/service card gets a consistent overlay with glassmorphism + animated bars.
- Desktop: hover reveal; mobile: tap-to-toggle infographic layer.

## Adding new experiences/KPIs
- Add content to existing timeline/service cards as usual.
- If you add `.kpi` chips with `.v/.l/.d`, infographics are auto-generated.
- Update `data/resume-context.json` for improved AI answer quality.

## Performance and compatibility
- No heavy chart libraries used.
- All enhancement scripts are deferred and modular.
- Existing navigation, reveal animations, form behavior, and layout remain unchanged.
