import { useState, useEffect } from "react";
import axios from "axios";
import ComicCard from "../components/ComicCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const Comics = () => {
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [searchTitle, setSearchTitle] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [favorites, setFavorites] = useState([]);

    const ITEMS_PER_PAGE = 100;

    // Charger les favoris comics
    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            const parsed = JSON.parse(storedFavorites);
            setFavorites(parsed.favoriteComics || []);
        }
    }, []);

    // Fetch des comics
    useEffect(() => {
        const fetchComics = async () => {
            setLoading(true);
            setError(null);

            try {
                let url = `${API_BASE_URL}/api/comics?page=${page}`;
                if (searchTitle) {
                    url += `&title=${encodeURIComponent(searchTitle)}`;
                }

                const response = await axios.get(url);
                // Tri alphabétique côté front sur la page courante
                const sortedComics = (response.data.results || []).sort((a, b) =>
                    (a.title || "").localeCompare(b.title || "")
                );
                setComics(sortedComics);
                setTotalCount(response.data.count || 0);
            } catch (err) {
                console.error("Erreur fetch comics:", err);
                setError("Impossible de charger les comics. Vérifiez que le backend est lancé.");
            } finally {
                setLoading(false);
            }
        };

        fetchComics();
    }, [page, searchTitle]);

    // Gestion de la recherche
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchTitle(searchInput);
        setPage(1);
    };

    // Toggle favori
    const toggleFavorite = (comic) => {
        const storedFavorites = localStorage.getItem("favorites");
        const currentFavorites = storedFavorites
            ? JSON.parse(storedFavorites)
            : { favoriteCharacters: [], favoriteComics: [] };

        const existingIndex = currentFavorites.favoriteComics.findIndex(
            (fav) => fav.id === comic._id
        );

        if (existingIndex > -1) {
            currentFavorites.favoriteComics.splice(existingIndex, 1);
        } else {
            currentFavorites.favoriteComics.push({
                id: comic._id,
                title: comic.title,
                thumbnail: comic.thumbnail,
            });
        }

        localStorage.setItem("favorites", JSON.stringify(currentFavorites));
        setFavorites(currentFavorites.favoriteComics);
    };

    const isFavorite = (comicId) => {
        return favorites.some((fav) => fav.id === comicId);
    };

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    if (loading) {
        return <div className="loading">⏳ Chargement des comics...</div>;
    }

    if (error) {
        return <div className="error">❌ {error}</div>;
    }

    return (
        <div className="page">
            <h1>📖 Comics Marvel</h1>

            {/* Barre de recherche */}
            <form className="search-container" onSubmit={handleSearch}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher un comic (ex: Spider-Man, Avengers)..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                    🔍 Rechercher
                </button>
                {searchTitle && (
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                            setSearchInput("");
                            setSearchTitle("");
                            setPage(1);
                        }}
                    >
                        ✕ Effacer
                    </button>
                )}
            </form>

            {/* Info résultats */}
            <p style={{ marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
                {totalCount} comic{totalCount > 1 ? "s" : ""} trouvé{totalCount > 1 ? "s" : ""}
                {searchTitle && ` pour "${searchTitle}"`} • Tri alphabétique
            </p>

            {/* Grille de cartes */}
            {comics.length > 0 ? (
                <div className="cards-grid">
                    {comics.map((comic) => (
                        <ComicCard
                            key={comic._id}
                            comic={comic}
                            isFavorite={isFavorite(comic._id)}
                            onToggleFavorite={toggleFavorite}
                        />
                    ))}
                </div>
            ) : (
                <p className="empty-message">Aucun comic trouvé.</p>
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

export default Comics;
