# SkinScan — concept prototype

An interactive visual prototype for **SkinScan**, a concept for a controlled full-body skin
imaging booth that photographs a person from multiple angles and builds a longitudinal 3D
skin map. Built to communicate one flow:

> A person stands inside the booth. Multiple cameras capture them simultaneously from
> different angles across a few standardized poses. The system reconstructs their skin
> into a 3D map. Future scans are compared against this baseline to identify changes
> that may warrant professional review.

**This is a concept visualization, not a medical device.** All measurements, lesion
counts, and scan data in the prototype are illustrative and fabricated — nothing here is
a clinical result, and nothing in the UI claims to diagnose skin cancer.

## Sections

- **Overview** — the end-to-end story and a Capture → Reconstruct → Detect → Compare → Review process strip
- **Booth** — the physical imaging booth with ~18 clickable camera modules
- **Scan** — an animated 4-pose capture sequence (Neutral, Arms raised, Arms extended, Legs separated)
- **Captured Images** — a gallery of standardized clinical-style views with lesion markers
- **3D Skin Map** — a rotatable/zoomable reconstructed body model with clickable lesion markers
- **Changes Over Time** — longitudinal comparison across two illustrative scans, with a split before/after lesion comparison
- **Results** — a summary dashboard of illustrative prototype metrics

## Stack

Vite + React + TypeScript + Tailwind CSS v4, Zustand for view state, lucide-react for icons.
(`three` / `@react-three/fiber` / `@react-three/drei` / `framer-motion` are installed for a
future true-3D pass; the current build uses CSS-based 3D framing for speed.)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
