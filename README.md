# AetherDesign

AI-powered creative content generation and management platform.

## Structure

| Folder | Contents |
|---|---|
| frontend/ | React + Vite + TypeScript client |
| workbench/ | SNS Agent Workbench workflow exports |
| db/ | PostgreSQL migrations and seed data |
| rag/ | Python source for RAG code nodes |
| docs/ | API contract, architecture, spike results |

## Frontend

Run `npm install` then `npm run dev` inside `frontend/`.

## Backend

Workflows run on SNS Agent Workbench. Exported definitions live in `workbench/workflows/`.
Database schema and seed data in `db/`.