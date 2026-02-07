require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// Clé API Marvel
const API_KEY = process.env.MARVEL_API_KEY;

// Route 1: Les personnages
app.get("/api/characters", async function (req, res) {
    try {
        const name = req.query.name || "";
        const page = req.query.page || 1;
        const limit = 100;
        const skip = (page - 1) * limit;

        let url = "https://lereacteur-marvel-api.herokuapp.com/characters";
        url = url + "?apiKey=" + API_KEY;
        url = url + "&skip=" + skip;
        url = url + "&limit=" + limit;

        if (name) {
            url = url + "&name=" + name;
        }

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route 2: Les comics d'un personnage
app.get("/api/character/:id/comics", async function (req, res) {
    try {
        const id = req.params.id;

        let url = "https://lereacteur-marvel-api.herokuapp.com/comics/" + id;
        url = url + "?apiKey=" + API_KEY;

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Route 3: Tous les comics
app.get("/api/comics", async function (req, res) {
    try {
        const title = req.query.title || "";
        const page = req.query.page || 1;
        const limit = 100;
        const skip = (page - 1) * limit;

        let url = "https://lereacteur-marvel-api.herokuapp.com/comics";
        url = url + "?apiKey=" + API_KEY;
        url = url + "&skip=" + skip;
        url = url + "&limit=" + limit;

        if (title) {
            url = url + "&title=" + title;
        }

        const response = await axios.get(url);
        res.json(response.data);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
