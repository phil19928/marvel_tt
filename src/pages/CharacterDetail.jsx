import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ComicCard from "../components/ComicCard";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const CharacterDetail = () => {
    const { id } = useParams();
    const [comics, setComics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
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

    // Fetch des comics du personnage
    useEffect(() => {
        const fetchComics = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/character/${id}/comics?page=${page}`
                );
                setComics(response.data.comics || []);
                setTotalCount(response.data.comics?.length || 0);
            } catch (err) {
                console.error("Erreur fetch comics:", err);
                setError("Impossible de charger les comics de ce personnage.");
            } finally {
                setLoading(false);
            }
        };

        fetchComics();
    }, [id, page]);

    // Toggle favori comic
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
        return (
            <div className="page">
                <Link to="/characters" className="btn btn-secondary" style={{ marginBottom: "1rem", display: "inline-block" }}>
                    ◀ Retour aux personnages
                </Link>
                <div className="error">❌ {error}</div>
            </div>
        );
    }

    return (
        <div className="page">
            <Link to="/characters" className="btn btn-secondary" style={{ marginBottom: "1.5rem", display: "inline-block" }}>
                ◀ Retour aux personnages
            </Link>

            <h1>📚 Comics du personnage</h1>

            <p style={{ marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
                {comics.length} comic{comics.length > 1 ? "s" : ""} trouvé{comics.length > 1 ? "s" : ""}
            </p>

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
                <p className="empty-message">Aucun comic trouvé pour ce personnage.</p>
            )}

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-secondary"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ◀ Précédent
                    </button>
                    <span>Page {page} / {totalPages}</span>
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

export default CharacterDetail;
