# Marvel App

Application React pour explorer les personnages et comics Marvel.

## Architecture

```
React (Vite) → Express Backend → Marvel API (lereacteur)
```

La clé API n'est **jamais** exposée côté frontend.

## Lancement Local

### 1. Backend (port 3000)

```bash
cd backend
cp .env.example .env  # Ajouter ta clé API
npm install
npm start
```

### 2. Frontend (port 5173)

```bash
yarn install
yarn dev
```

Ouvrir http://localhost:5173

## Features

- 🦸 Liste des personnages (100/page) avec recherche et pagination
- 📚 Liste des comics avec tri alphabétique
- ⭐ Système de favoris (localStorage)
- 🖼️ Page détail personnage avec comics liés

## Déploiement

- **Backend**: Northflank avec variable `MARVEL_API_KEY`
- **Frontend**: Netlify avec variable `VITE_API_BASE_URL`
