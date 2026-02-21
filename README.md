# Adolfo Platter Test

A product showcase page featuring a "Best Sellers" grid with custom scrollbar, built with Vite, Tailwind CSS, and vanilla JavaScript (custom web components).

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

## Installation

```bash
npm install
```

## Development

Start the dev server with hot reload:

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build

Create a production build:

```bash
npm run build
```

Output goes to the `dist/` folder.

## Preview

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
├── index.html          # Entry HTML
├── src/
│   ├── main.js         # Custom web components (BestSellers)
│   └── site.css        # Tailwind + custom styles
├── public/
│   └── images/         # Product images and assets
└── dist/               # Production build output
```
