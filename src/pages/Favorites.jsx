import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState({
        favoriteCharacters: [],
        favoriteComics: [],
    });

    // Charger les favoris depuis localStorage
    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    // Supprimer un personnage favori
    const removeCharacter = (id) => {
        const updated = {
            ...favorites,
            favoriteCharacters: favorites.favoriteCharacters.filter(
                (char) => char.id !== id
            ),
        };
        setFavorites(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
    };

    // Supprimer un comic favori
    const removeComic = (id) => {
        const updated = {
            ...favorites,
            favoriteComics: favorites.favoriteComics.filter((comic) => comic.id !== id),
        };
        setFavorites(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
    };

    // Construire l'URL de l'image
    const getImageUrl = (thumbnail) => {
        if (!thumbnail) return "https://via.placeholder.com/300x300?text=No+Image";
        return `${thumbnail.path}.${thumbnail.extension}`;
    };

    const hasNoFavorites =
        favorites.favoriteCharacters.length === 0 &&
        favorites.favoriteComics.length === 0;

    return (
        <div className="page">
            <h1>⭐ Mes Favoris</h1>

            {hasNoFavorites ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                    <p className="empty-message" style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                        Vous n'avez aucun favori pour le moment.
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.5)" }}>
                        Ajoutez des personnages ou comics en cliquant sur ☆
                    </p>
                </div>
            ) : (
                <>
                    {/* Section Personnages */}
                    <section className="favorites-section">
                        <h2>🦸 Personnages ({favorites.favoriteCharacters.length})</h2>
                        {favorites.favoriteCharacters.length > 0 ? (
                            <div className="cards-grid">
                                {favorites.favoriteCharacters.map((character) => (
                                    <article
                                        key={character.id}
                                        className="card"
                                        onClick={() => navigate(`/characters/${character.id}`)}
                                    >
                                        <button
                                            className="favorite-btn active"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeCharacter(character.id);
                                            }}
                                            aria-label="Retirer des favoris"
                                        >
                                            ✕
                                        </button>
                                        <img
                                            src={getImageUrl(character.thumbnail)}
                                            alt={character.name}
                                            className="card-image"
                                            loading="lazy"
                                        />
                                        <div className="card-content">
                                            <h3 className="card-title">{character.name}</h3>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">Aucun personnage favori.</p>
                        )}
                    </section>

                    {/* Section Comics */}
                    <section className="favorites-section">
                        <h2>📖 Comics ({favorites.favoriteComics.length})</h2>
                        {favorites.favoriteComics.length > 0 ? (
                            <div className="cards-grid">
                                {favorites.favoriteComics.map((comic) => (
                                    <article key={comic.id} className="card">
                                        <button
                                            className="favorite-btn active"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeComic(comic.id);
                                            }}
                                            aria-label="Retirer des favoris"
                                        >
                                            ✕
                                        </button>
                                        <img
                                            src={getImageUrl(comic.thumbnail)}
                                            alt={comic.title}
                                            className="card-image"
                                            loading="lazy"
                                        />
                                        <div className="card-content">
                                            <h3 className="card-title">{comic.title}</h3>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="empty-message">Aucun comic favori.</p>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default Favorites;
