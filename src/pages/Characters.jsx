import { useState, useEffect } from "react";
import axios from "axios";
import CharacterCard from "../components/CharacterCard";
import API_URL from "../config";

function Characters() {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [favorites, setFavorites] = useState([]);

    // 1. Charger les favoris au démarrage
    useEffect(function () {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            // On récupère juste le tableau de personnages
            setFavorites(parsedFavorites.favoriteCharacters || []);
        }
    }, []);

    // 2. Charger les personnages depuis l'API
    useEffect(function () {
        async function fetchData() {
            setIsLoading(true);
            try {
                // Construction de l'URL
                let url = API_URL + "/api/characters?page=" + page;
                if (searchText) {
                    url = url + "&name=" + searchText;
                }

                const response = await axios.get(url);
                setCharacters(response.data.results);
            } catch (error) {
                console.log("Erreur:", error);
            }
            setIsLoading(false);
        }

        fetchData();
    }, [page, searchText]);

    // Fonction pour gérer la recherche
    function handleSearch(event) {
        setSearchText(event.target.value);
        setPage(1); // Revenir à la première page
    }

    // Fonction pour gérer les favoris
    function toggleFavorite(character) {
        // Copie des favoris actuels
        const newFavorites = [...favorites];

        // Est-ce que le perso est déjà favori ?
        const existingIndex = newFavorites.findIndex(function (fav) {
            return fav.id === character._id;
        });

        if (existingIndex !== -1) {
            // Si oui, on l'enlève
            newFavorites.splice(existingIndex, 1);
        } else {
            // Sinon, on l'ajoute
            newFavorites.push({
                id: character._id,
                name: character.name,
                thumbnail: character.thumbnail
            });
        }

        // Mise à jour de l'état
        setFavorites(newFavorites);

        // Sauvegarde dans le localStorage (il faut aussi garder les comics !)
        const savedData = localStorage.getItem("favorites");
        let allFavorites = { favoriteCharacters: [], favoriteComics: [] };
        if (savedData) {
            allFavorites = JSON.parse(savedData);
        }
        allFavorites.favoriteCharacters = newFavorites;
        localStorage.setItem("favorites", JSON.stringify(allFavorites));
    }

    // Vérifie si un perso est favori
    function isFavorite(characterId) {
        return favorites.some(function (fav) {
            return fav.id === characterId;
        });
    }

    if (isLoading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="page">
            <h1>Personnages Marvel</h1>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher un personnage..."
                    className="search-input"
                    value={searchText}
                    onChange={handleSearch}
                />
            </div>

            <div className="cards-grid">
                {characters.map(function (character) {
                    return (
                        <CharacterCard
                            key={character._id}
                            character={character}
                            isFavorite={isFavorite(character._id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    );
                })}
            </div>

            <div className="pagination">
                <button
                    className="btn btn-secondary"
                    disabled={page === 1}
                    onClick={function () { setPage(page - 1); }}
                >
                    Précédent
                </button>
                <span>Page {page}</span>
                <button
                    className="btn btn-secondary"
                    onClick={function () { setPage(page + 1); }}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default Characters;
