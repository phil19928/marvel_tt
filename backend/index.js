require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;
const MARVEL_API_URL = "https://lereacteur-marvel-api.herokuapp.com";
const API_KEY = process.env.MARVEL_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/", function (request, response) {
    response.json({ message: "Marvel API Backend - OK" });
});

app.get("/api/characters", async function (request, response) {
    if (!API_KEY) {
        return response.status(500).json({ error: "MARVEL_API_KEY non configurée" });
    }

    try {
        const page = request.query.page || 1;
        const name = request.query.name || "";
        const skip = (page - 1) * 100;

        let url = MARVEL_API_URL + "/characters?apiKey=" + API_KEY + "&limit=100&skip=" + skip;
        if (name !== "") {
            url = url + "&name=" + name;
        }

        const apiResponse = await axios.get(url);
        response.json(apiResponse.data);
    } catch (error) {
        console.error("Erreur /api/characters:", error.message);
        response.status(500).json({ error: "Erreur lors de la récupération des personnages" });
    }
});

app.get("/api/character/:id/comics", async function (request, response) {
    if (!API_KEY) {
        return response.status(500).json({ error: "MARVEL_API_KEY non configurée" });
    }

    try {
        const characterId = request.params.id;
        const url = MARVEL_API_URL + "/comics/" + characterId + "?apiKey=" + API_KEY;

        const apiResponse = await axios.get(url);
        response.json(apiResponse.data);
    } catch (error) {
        console.error("Erreur /api/character/:id/comics:", error.message);
        response.status(500).json({ error: "Erreur lors de la récupération des comics" });
    }
});

app.get("/api/comics", async function (request, response) {
    if (!API_KEY) {
        return response.status(500).json({ error: "MARVEL_API_KEY non configurée" });
    }

    try {
        const page = request.query.page || 1;
        const title = request.query.title || "";
        const skip = (page - 1) * 100;

        let url = MARVEL_API_URL + "/comics?apiKey=" + API_KEY + "&limit=100&skip=" + skip;
        if (title !== "") {
            url = url + "&title=" + title;
        }

        const apiResponse = await axios.get(url);
        response.json(apiResponse.data);
    } catch (error) {
        console.error("Erreur /api/comics:", error.message);
        response.status(500).json({ error: "Erreur lors de la récupération des comics" });
    }
});

app.listen(PORT, function () {
    console.log("Backend Marvel en écoute sur http://localhost:" + PORT);
});
