# Smartgkquiz.com — PDF GK Generator

This branch adds a simple Node.js/Express-based PDF generator using PDFKit and a lightweight front-end to trigger generation.

Files added:
- `server.js` — Express server with `/generate-pdf` endpoint that streams a text-only PDF generated from `data/gk_facts.json`.
- `data/gk_facts.json` — Sample GK facts (replace with a much larger dataset if you want unique facts across many pages).
- `public/index.html` — A simple UI to request PDF generation.
- `package.json` — Dependencies and start script.

How to run locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open `http://localhost:3000` in your browser and use the UI to generate a PDF.

Deployment notes

- This app can be deployed to services such as Render, Railway, or Heroku. For small tests, you can run it on a VM or container.
- For very large PDFs (tens of thousands of pages), prefer a hosted server with enough disk space and CPU. Consider generating PDFs in chunks and joining them or providing multiple smaller PDFs to the user.

Next steps I can do for you

- Replace `data/gk_facts.json` with your full GK dataset (CSV/JSON) so pages do not repeat.
- Add a background/header image or multilingual content (Gujarati/English).
- Create a GitHub Actions workflow to deploy to a provider (requires API keys/secrets).

If you want me to deploy this to a hosting provider, tell me which provider (Render, Railway, Vercel, Heroku) and provide any required access or API key (or I can prepare a deployment workflow and instructions).
