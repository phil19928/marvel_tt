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

    useEffect(function () {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            setFavorites(parsedFavorites.favoriteCharacters || []);
        }
    }, []);

    useEffect(function () {
        async function fetchData() {
            setIsLoading(true);
            try {
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

    function handleSearch(event) {
        setSearchText(event.target.value);
        setPage(1);
    }

    function toggleFavorite(character) {
        const newFavorites = [...favorites];

        const existingIndex = newFavorites.findIndex(function (fav) {
            return fav.id === character._id;
        });

        if (existingIndex !== -1) {
            newFavorites.splice(existingIndex, 1);
        } else {
            newFavorites.push({
                id: character._id,
                name: character.name,
                thumbnail: character.thumbnail
            });
        }

        setFavorites(newFavorites);

        const savedData = localStorage.getItem("favorites");
        let allFavorites = { favoriteCharacters: [], favoriteComics: [] };
        if (savedData) {
            allFavorites = JSON.parse(savedData);
        }
        allFavorites.favoriteCharacters = newFavorites;
        localStorage.setItem("favorites", JSON.stringify(allFavorites));
    }

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
                    placeholder="Chercher un personnage..."
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
                    disabled={page === 1}
                    onClick={function () { setPage(page - 1); }}
                >
                    Précédent
                </button>
                <span>Page {page}</span>
                <button
                    onClick={function () { setPage(page + 1); }}
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}

export default Characters;
