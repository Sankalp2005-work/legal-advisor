# LegalLens (Legal-Advisor) - Procedural Legal Intelligence Platform

This is our college project — an AI-powered legal procedural roadmap generator specialized in **Industrial Law** and **Personal Law**.

## Team
- **Project Lead**: Sankalp
- **Contributors**:
  1. Aviral
  2. Ravi

## Architecture Overview

The project is structured into two clean directories:

```
LegalLens/
├── backend/                  # Node.js + Express backend API with Qwen AI integration
│   ├── src/
│   │   ├── server.js         # Express server on port 5000
│   │   └── services/
│   │       └── qwenService.js# Qwen 2.5 / OpenRouter / Public Gateway AI engine
│   ├── .env                  # Backend environment variables
│   └── package.json
│
└── frontend/                 # Single-page React application (Vite + Tailwind CSS)
    ├── src/
    │   ├── App.jsx           # LegalLens UI (Toggle, Centered input, Generate button)
    │   ├── services/
    │   │   └── api.js        # API client connecting to backend
    │   └── index.css         # Styling & typography
    ├── index.html
    └── package.json
```

## Quick Start Guide

### 1. Start the Backend API (Port 5000)
```bash
cd backend
npm install
npm run dev
```

### 2. Start the Frontend React App (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:3000/`.

## Features
- **Central Query Interface**: Middle text bar with placeholder `"ask about legal procedure"`.
- **Domain Selector**: 2-way toggle between `"Industrial"` and `"Person"` legal frameworks.
- **Qwen 2.5 AI Powered**: Generates structured procedural roadmaps, documentation checklists, and statutory limitation timelines.
- **AI Settings**: Switch models and optionally configure a free OpenRouter key or use the built-in zero-config public gateway.
