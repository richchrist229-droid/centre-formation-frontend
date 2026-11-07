# Centre de formation : Interface React

Interface web de gestion des étudiants, des formations et des inscriptions.
Ce dépôt contient le frontend. L'API Laravel est dans le dépôt
`centre-formation-backend`.

## Fonctionnalités
- Tableau de bord statistique
- Gestion des étudiants (ajout, modification, suppression)
- Recherche et filtres multicritères
- Gestion des formations et des inscriptions

## Technologies
React (Vite), Axios, React Router, Recharts

## Installation
Prérequis : Node.js 18+, et l'API Laravel qui tourne sur http://127.0.0.1:8000

    git clone https://github.com/richchrist229-droid/centre-formation-frontend.git
    cd centre-formation-frontend
    npm install
    npm run dev

Ouvre http://localhost:5173













# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
