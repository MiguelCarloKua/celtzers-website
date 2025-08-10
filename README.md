# Lawlite — CeLTZer's Case Digest Generator Tool

This is the source code of CeLTZer's Case Digest Generator Tool, known as **Lawlite**.

Lawlite generates clean, structured case digests from **Lawphil** links in one click. It uses **Google Gemini 2.5 Flash** to summarize Philippine court decisions into the usual sections used in law school.

> **Disclaimer:** Lawlite is for supplementary academic use only. Do not rely on it as the sole basis for understanding or interpreting court cases. Outputs may contain inaccuracies. Always verify with the original case file.

---

## Installation Procedures

1) Install website and Python packages in the project folder:
```bash
npm install
# or
npm i

pip install -r requirements.txt
```

2) Start the development server:
```bash
npm run dev
```

3) Open the app in your browser:
```
http://localhost:3000
```

4) Create a `.env` file in the project root:
```env
GEMINI_API_KEY="[YOUR_GEMINI_KEY_HERE]"
```

---

## Pre-requisites

The following must already be installed on your machine:

- **Python** (used to call the Gemini 2.5 Flash API)
- **Node.js and npm** (to run the Next.js frontend)
- **Gemini API Key** (get one at https://aistudio.google.com/apikey)
- **Git** (optional, for cloning the repository)
- A modern **web browser** (Chrome, Edge, or Firefox)

---

## Features

- **One-click digest generation** from a Lawphil case URL
- **Sectioned outputs**: Facts, Issues, and Rulings
- **Clean UI** built with Next.js and Tailwind CSS
- **Config via `.env`** for simple setup
- **/generator route** for the main workflow

---

## Quick Start

1) Get a valid Lawphil case link.  
2) Go to `/generator`.  
3) Paste the link and click **Generate**.  
4) Review the generated Facts, Issues, and Rulings.

---

## Project Structure (high level)

```
root/
├─ app/                  # Next.js App Router pages (e.g., /, /generator)
├─ components/           # UI components
├─ styles/               # Tailwind and global styles
├─ scripts/ or api/      # Python or server-side helpers that call Gemini (if applicable)
├─ public/               # Static assets
├─ requirements.txt      # Python dependencies
├─ package.json          # Web dependencies and scripts
└─ .env                  # GEMINI_API_KEY
```

*(Folder names may vary slightly depending on your setup.)*

---

## Configuration

Set the following environment variable in `.env`:
- `GEMINI_API_KEY` — your Google Gemini API key

If you run in production, configure your deployment platform to provide the same environment variable.

---

## Troubleshooting

- **`GEMINI_API_KEY` missing or invalid**  
  Ensure `.env` exists at project root and the key is correct. Restart `npm run dev` after changes.

- **npm errors on install**  
  Update Node.js to the latest LTS and retry `npm install`.

- **Requests timing out**  
  Check your network connection. Some Lawphil pages may be slow to fetch.

---

## Tech Stack

- **Next.js** with the App Router
- **Tailwind CSS**
- **Google Gemini 2.5 Flash**
- **TypeScript or JavaScript** (depending on your setup)
- **Python** for Gemini calls where needed

---

## Credits

Developed by **Pierre Genric Cabinbin**, **Jordan Chester Chong**, **Miguel Carlo Kua**, and **Rommel Kendrick Salen**.

---

## License

For educational use. Not affiliated with Lawphil or the Arellano University School of Law.
