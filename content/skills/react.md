---
id: react
label: React
subtitle: UI Framework
category: skills
size: 16
color: "#60a5fa"
icon: Atom
connections: []
---
# React

## Overview
Frontend UI library for building component-based, reactive single-page applications. Used in both this portfolio and the custom home dashboard.

## Usage in Projects

### This Portfolio
- Full-screen force graph with real-time physics via `react-force-graph-2d`
- Markdown-rendered detail panels using `react-markdown`
- Zero page reloads — all navigation is component state

### Home Dashboard
- Real-time metric cards fed by WebSocket streams
- `React Query` for REST API data fetching with automatic refetch
- `Zustand` for global alert and connection state

## Skills
- React hooks (`useState`, `useEffect`, `useCallback`, `useRef`, `useMemo`)
- Custom hooks for data fetching, WebSocket management
- Performance optimization: memoization, virtualized lists
- Context API and Zustand for state management

## Build Tooling
Using **Vite** as the build tool — sub-100ms HMR, ESM-native, significantly faster than the webpack-based Create React App.
