# SellWise AI — Starter project

A mobile-responsive, installable PWA prototype with five AI marketing tools and a Cloudflare Worker proxy.

## What this version includes
- Dashboard and five generator screens
- Responsive mobile and desktop layout
- Installable PWA shell
- Bring-your-own OpenAI API key (held in browser `sessionStorage`)
- Cloudflare Worker proxy; API key is forwarded per request and is not written to a database
- Copy generated output

## Important limitations
This is a prototype, not a production-ready SaaS. It has no user accounts, subscription billing, server-side quotas, abuse protection, analytics, or customer support system. The Worker currently allows CORS from any origin and forwards each user's own API key to OpenAI. Tighten CORS and add rate limits/authentication before public paid launch. Users pay their AI provider for usage. Hosting may have free-tier limits and providers can change pricing/terms.

## Part A — Deploy the AI proxy (Cloudflare Workers)
1. Create a Cloudflare account at https://dash.cloudflare.com/
2. Install Node.js LTS on your computer from https://nodejs.org/
3. Open Terminal (Mac/Linux) or PowerShell (Windows).
4. Run: `npm install -g wrangler`
5. Run: `npx wrangler login` and approve the browser login.
6. Unzip this project, then in Terminal/PowerShell move into its `worker` folder.
7. Run: `npx wrangler deploy`
8. Copy the Worker URL shown after deployment. It looks like `https://sellwise-ai-api.YOUR-SUBDOMAIN.workers.dev`.

## Part B — Publish the website on Cloudflare Pages
1. Create a GitHub account at https://github.com/
2. Create a new repository named `sellwise-ai`.
3. Upload the contents of this project to the repository. Important: `index.html`, `styles.css`, and `app.js` must be in the repository root. The `public` folder must also be in the root.
4. In Cloudflare dashboard, open Workers & Pages → Create → Pages → Connect to Git.
5. Choose the `sellwise-ai` repository.
6. Framework preset: None. Build command: leave blank. Build output directory: `/` (if the interface requires a directory, use the repository root setting supported by the Pages setup screen).
7. Deploy. Cloudflare will provide a `pages.dev` URL.

## Part C — Connect the AI
1. Open the deployed SellWise website.
2. Open AI Settings.
3. Create an API key with your chosen AI provider. For OpenAI, use https://platform.openai.com/api-keys and check billing/pricing before use. ChatGPT subscriptions and API billing are separate.
4. Paste your API key into the API key field.
5. Model: enter a model available to your API account, for example `gpt-4o-mini` if available.
6. Worker URL: paste the URL copied in Part A.
7. Select Save for this session.
8. Open one tool, fill the form and generate a test.

## Part D — Install on a phone
- Android: open the website in Chrome → browser menu → Install app / Add to Home screen.
- iPhone: open in Safari → Share → Add to Home Screen.

## Troubleshooting
- 401/invalid key: check that the provider key is correct and has API access/billing enabled.
- 404: check that the Worker URL is correct and ends without `/generate`; the app adds that path.
- CORS/network error: verify the Worker deployed successfully and that you are using its HTTPS URL.
- Model error: use a model name available to your API account.
- No generation: check internet access and provider usage limits.

## Project structure
```text
sellwise-ai/
├── index.html
├── styles.css
├── app.js
├── README.md
├── manifest.webmanifest
├── icon.svg
├── sw.js
└── worker/
    ├── index.js
    └── wrangler.toml
```
