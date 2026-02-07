import { useState, useEffect } from "react";
import axios from "axios";
import CharacterCard from "../components/CharacterCard";

// URL du backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const Characters = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [favorites, setFavorites] = useState([]);

    const ITEMS_PER_PAGE = 100;

    // Charger les favoris depuis localStorage
    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            const parsed = JSON.parse(storedFavorites);
            setFavorites(parsed.favoriteCharacters || []);
        }
    }, []);

    // Fetch des personnages
    useEffect(() => {
        const fetchCharacters = async () => {
            setLoading(true);
            setError(null);

            try {
                let url = `${API_BASE_URL}/api/characters?page=${page}`;
                if (searchName) {
                    url += `&name=${encodeURIComponent(searchName)}`;
                }

                const response = await axios.get(url);
                setCharacters(response.data.results || []);
                setTotalCount(response.data.count || 0);
            } catch (err) {
                console.error("Erreur fetch characters:", err);
                setError("Impossible de charger les personnages. Vérifiez que le backend est lancé.");
            } finally {
                setLoading(false);
            }
        };

        fetchCharacters();
    }, [page, searchName]);

    // Gestion de la recherche
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchName(searchInput);
        setPage(1); // Reset à la page 1 lors d'une nouvelle recherche
    };

    // Toggle favori
    const toggleFavorite = (character) => {
        const storedFavorites = localStorage.getItem("favorites");
        const currentFavorites = storedFavorites
            ? JSON.parse(storedFavorites)
            : { favoriteCharacters: [], favoriteComics: [] };

        const existingIndex = currentFavorites.favoriteCharacters.findIndex(
            (fav) => fav.id === character._id
        );

        if (existingIndex > -1) {
            // Retirer des favoris
            currentFavorites.favoriteCharacters.splice(existingIndex, 1);
        } else {
            // Ajouter aux favoris (garder seulement l'essentiel)
            currentFavorites.favoriteCharacters.push({
                id: character._id,
                name: character.name,
                thumbnail: character.thumbnail,
            });
        }

        localStorage.setItem("favorites", JSON.stringify(currentFavorites));
        setFavorites(currentFavorites.favoriteCharacters);
    };

    // Vérifier si un personnage est en favori
    const isFavorite = (characterId) => {
        return favorites.some((fav) => fav.id === characterId);
    };

    // Calcul pagination
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    if (loading) {
        return <div className="loading">⏳ Chargement des personnages...</div>;
    }

    if (error) {
        return <div className="error">❌ {error}</div>;
    }

    return (
        <div className="page">
            <h1>🦸 Personnages Marvel</h1>

            {/* Barre de recherche */}
            <form className="search-container" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher un personnage (ex: Iron Man, Spider)..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                    🔍 Rechercher
                </button>
                {searchName && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setSearchInput("");
                            setSearchName("");
                            setPage(1);
                        }}
                    >
                        ✕ Effacer
                    </button>
                )}
            </form>

            {/* Info résultats */}
            <p style={{ marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
                {totalCount} personnage{totalCount > 1 ? "s" : ""} trouvé{totalCount > 1 ? "s" : ""}
                {searchName && ` pour "${searchName}"`}
            </p>

            {/* Grille de cartes */}
            {characters.length > 0 ? (
                <div className="cards-grid">
                    {characters.map((character) => (
                        <CharacterCard
                            key={character._id}
                            character={character}
                            isFavorite={isFavorite(character._id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <p className="empty-message">Aucun personnage trouvé.</p>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ◀ Précédent
                    </button>
                    <span>
                        Page {page} / {totalPages}
                    </span>
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Suivant ▶
                    </button>
                </div>
            )}
        </div>
    );
};

export default Characters;
