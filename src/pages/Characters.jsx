import { useState, useEffect } from "react";
import axios from "axios";
import CharacterCard from "../components/CharacterCard";

const API_URL = "http://localhost:3000";

function Characters() {
    const [characters, setCharacters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [totalCharacters, setTotalCharacters] = useState(0);
    const [favoritesList, setFavoritesList] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem("favorites");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFavoritesList(parsed.favoriteCharacters || []);
        }
    }, []);

    useEffect(() => {
        async function loadCharacters() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                let url = API_URL + "/api/characters?page=" + currentPage;
                if (submittedSearch !== "") {
                    url = url + "&name=" + submittedSearch;
                }

                const response = await axios.get(url);
                setCharacters(response.data.results || []);
                setTotalCharacters(response.data.count || 0);
            } catch (error) {
                console.error(error);
                setErrorMessage("Erreur lors du chargement des personnages.");
            }

            setIsLoading(false);
        }

        loadCharacters();
    }, [currentPage, submittedSearch]);

    function handleSearchSubmit(event) {
        event.preventDefault();
        setSubmittedSearch(searchText);
        setCurrentPage(1);
    }

    function handleClearSearch() {
        setSearchText("");
        setSubmittedSearch("");
        setCurrentPage(1);
    }

    function handlePreviousPage() {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    function handleNextPage() {
        const totalPages = Math.ceil(totalCharacters / 100);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    function toggleFavorite(character) {
        const savedData = localStorage.getItem("favorites");
        let currentFavorites = { favoriteCharacters: [], favoriteComics: [] };
        if (savedData) {
            currentFavorites = JSON.parse(savedData);
        }

        const alreadyFavorite = currentFavorites.favoriteCharacters.find(
            (fav) => fav.id === character._id
        );

        if (alreadyFavorite) {
            currentFavorites.favoriteCharacters = currentFavorites.favoriteCharacters.filter(
                (fav) => fav.id !== character._id
            );
        } else {
            currentFavorites.favoriteCharacters.push({
                id: character._id,
                name: character.name,
                thumbnail: character.thumbnail,
            });
        }

        localStorage.setItem("favorites", JSON.stringify(currentFavorites));
        setFavoritesList(currentFavorites.favoriteCharacters);
    }

    function isCharacterFavorite(characterId) {
        const found = favoritesList.find((fav) => fav.id === characterId);
        return found !== undefined;
    }

    const totalPages = Math.ceil(totalCharacters / 100);

    if (isLoading) {
        return <div className="loading">Chargement des personnages...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    return (
        <div className="page">
            <h1>Personnages Marvel</h1>

            <form className="search-container" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher un personnage..."
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                    Rechercher
                </button>
                {submittedSearch !== "" && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClearSearch}
                    >
                        Effacer
                    </button>
                )}
            </form>

            <p style={{ marginBottom: "16px", color: "rgba(255,255,255,0.6)" }}>
                {totalCharacters} personnage(s) trouvé(s)
                {submittedSearch !== "" && " pour \"" + submittedSearch + "\""}
            </p>

            {characters.length === 0 ? (
                <p className="empty-message">Aucun personnage trouvé.</p>
            ) : (
                <div className="cards-grid">
                    {characters.map((character) => (
                        <CharacterCard
                            key={character._id}
                            character={character}
                            isFavorite={isCharacterFavorite(character._id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-secondary"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Précédent
                    </button>
                    <span>Page {currentPage} / {totalPages}</span>
                    <button
                        className="btn btn-secondary"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
}

export default Characters;
