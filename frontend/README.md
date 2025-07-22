# Crypto Analytics Dashboard

A real-time cryptocurrency tracking dashboard built with Next.js, React, D3, and Tailwind CSS.

## Features

- **Live Bitcoin Price Chart**
  - Real-time updating line and area chart for Bitcoin price.
  - Interactive tooltips on hover showing price and timestamp.
  - Animated dots highlight the current data point under the cursor.
  - Responsive and visually appealing with gradients and grid lines.

- **Timeframe Selection**
  - Toggle between multiple timeframes: 1M, 5M, 15M, 1H, 4H, 1D.
  - Chart and data update instantly based on selected timeframe.

- **Price Change Indicator**
  - Displays current price and percentage change.
  - Visual indicator (arrow up/down) and color (green/red) for positive/negative change.

- **Live Status**
  - "Live" badge with animated icon to indicate real-time updates.

- **Dark Mode Support**
  - Fully styled for dark backgrounds using Tailwind CSS and theme context.

- **Accessible & Responsive**
  - Mobile-friendly layout.
  - Semantic HTML and accessible color contrast.

## Tech Stack

- **Next.js** (App Router)
- **React** (with hooks and context)
- **D3.js** (for chart rendering and interactivity)
- **Tailwind CSS** (utility-first styling)
- **TypeScript** (type safety throughout)
- **Lucide React** (for icons)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open [http://localhost:3000](http://localhost:3000) to view the dashboard.**

---

## Folder Structure

- `src/components/LiveChart.tsx` – Main live chart component with all chart logic and interactivity.
- `src/contexts/ThemeContext.tsx` – Theme provider for dark/light mode.
- `src/app/layout.tsx` – App layout and providers.
- `public/` – Static assets.

---

## Screenshots

![Live Chart Screenshot](./public/screenshot.png)

---

## License