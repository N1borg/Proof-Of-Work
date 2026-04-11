---
id: portfolio
label: Portfolio
subtitle: This Website
category: projects
size: 12
color: "#f472b6"
icon: Globe
connections: ["robin","react"]
---
# Proof-Of-Work Portfolio

## Overview
An interactive, physics-based portfolio replacing a traditional static resume — built to demonstrate both technical depth and frontend craftsmanship simultaneously.

## Concept
Every technology I use becomes a node in a force-directed graph. The connections between nodes reflect real architectural dependencies. Click any node to explore a detailed write-up.

## Tech Stack
- **React 18 + Vite** — Frontend framework and build tooling
- **react-force-graph-2d** — Canvas-based d3-force physics graph
- **react-markdown + remark-gfm** — Markdown rendering for content panels
- **Tailwind CSS v4** — Utility styling

## Architecture
Content lives in `src/content/*.md` files — edit any markdown file to update the portfolio without touching React code. Node metadata (color, connections, category) lives in `src/data/nodes.js`.

## Adding a New Node
1. Create `src/content/your-tech.md` with your write-up
2. Add an entry to `src/data/nodes.js` with `id`, `label`, `color`, `category`
3. Add connections to `connectionData` in the same file
4. Hot-reload will update immediately

> The graph itself is the proof that I know what I'm talking about.
