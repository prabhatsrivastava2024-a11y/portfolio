# AI-Enhanced Portfolio

## What was added
- Floating AI chatbot assistant (lazy-initialized after page load).
- Context ingestion layer that combines `data/resume-context.json` + DOM portfolio sections.
- Hover KPI infographic overlays for experience/service cards with animated ring and micro bar graph.

## How chatbot works
1. `components/chatbot/chatbot.js` waits for page load and initializes after a short delay.
2. It fetches `data/resume-context.json`.
3. It calls `ContextEngine.collectPortfolioContext()` to parse current page sections/cards.
4. It builds an internal prompt context and answers recruiter-focused questions.

## How to add or update resume context
- Edit `data/resume-context.json`.
- Add/update `profile`, `experience`, `skills`, and KPI highlights.
- Keep values concise and metric-oriented for best assistant responses.

## How to customize KPI metrics and infographic behavior
- Card metrics are sourced from existing `.kpi` entries in HTML.
- Overlay visuals are controlled in:
  - `components/chatbot/chatbot.css` (`.kpi-infographic`, `.kpi-ring`, `.kpi-bars`)
  - `utils/kpi-infographics.js` (injection logic)
- To disable, remove `utils/kpi-infographics.js` script include.

## Performance & compatibility notes
- No heavy libraries added.
- Chatbot and infographic scripts are `defer` loaded.
- Existing sections, forms, animations, links, and nav were preserved.
