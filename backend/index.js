require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// URL de base de l'API Marvel (lereacteur - Heroku)
const MARVEL_API_BASE = "https://lereacteur-marvel-api.herokuapp.com";

// Configuration CORS - autorise le frontend en dev et prod
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            // Ajoute ton domaine Netlify ici quand tu déploies
            // "https://ton-app.netlify.app"
        ],
    })
);

app.use(express.json());

// Middleware pour vérifier que la clé API est présente
const checkApiKey = (req, res, next) => {
    if (!process.env.MARVEL_API_KEY) {
        return res.status(500).json({ error: "MARVEL_API_KEY non configurée" });
    }
    next();
};

// ============================================
// ROUTE: GET /api/characters
// Liste des personnages avec pagination et recherche
// ============================================
app.get("/api/characters", checkApiKey, async (req, res) => {
    try {
        const { page = 1, name = "" } = req.query;
        const skip = (page - 1) * 100;

        // Construction de l'URL avec paramètres
        let url = `${MARVEL_API_BASE}/characters?apiKey=${process.env.MARVEL_API_KEY}&limit=100&skip=${skip}`;

        if (name) {
            url += `&name=${encodeURIComponent(name)}`;
        }

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Erreur /api/characters:", error.message);
        res.status(error.response?.status || 500).json({
            error: "Erreur lors de la récupération des personnages",
        });
    }
});

// ============================================
// ROUTE: GET /api/character/:id/comics
// Comics liés à un personnage spécifique
// ============================================
app.get("/api/character/:id/comics", checkApiKey, async (req, res) => {
    try {
        const { id } = req.params;
        const { page = 1 } = req.query;
        const skip = (page - 1) * 100;

        const url = `${MARVEL_API_BASE}/comics/${id}?apiKey=${process.env.MARVEL_API_KEY}&limit=100&skip=${skip}`;

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Erreur /api/character/:id/comics:", error.message);
        res.status(error.response?.status || 500).json({
            error: "Erreur lors de la récupération des comics du personnage",
        });
    }
});

// ============================================
// ROUTE: GET /api/comics
// Liste des comics avec pagination et recherche
// ============================================
app.get("/api/comics", checkApiKey, async (req, res) => {
    try {
        const { page = 1, title = "" } = req.query;
        const skip = (page - 1) * 100;

        let url = `${MARVEL_API_BASE}/comics?apiKey=${process.env.MARVEL_API_KEY}&limit=100&skip=${skip}`;

        if (title) {
            url += `&title=${encodeURIComponent(title)}`;
        }

        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error("Erreur /api/comics:", error.message);
        res.status(error.response?.status || 500).json({
            error: "Erreur lors de la récupération des comics",
        });
    }
});

// Route de test / health check
app.get("/", (req, res) => {
    res.json({ message: "Marvel API Backend - OK" });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 Backend Marvel en écoute sur http://localhost:${PORT}`);
});
