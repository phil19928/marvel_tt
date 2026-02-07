import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Favorites() {
    const navigate = useNavigate();
    const [favoriteCharacters, setFavoriteCharacters] = useState([]);
    const [favoriteComics, setFavoriteComics] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem("favorites");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFavoriteCharacters(parsed.favoriteCharacters || []);
            setFavoriteComics(parsed.favoriteComics || []);
        }
    }, []);

    function removeCharacter(characterId) {
        const newCharacters = favoriteCharacters.filter(
            (character) => character.id !== characterId
        );
        setFavoriteCharacters(newCharacters);

        const dataToSave = {
            favoriteCharacters: newCharacters,
            favoriteComics: favoriteComics,
        };
        localStorage.setItem("favorites", JSON.stringify(dataToSave));
    }

    function removeComic(comicId) {
        const newComics = favoriteComics.filter(
            (comic) => comic.id !== comicId
        );
        setFavoriteComics(newComics);

        const dataToSave = {
            favoriteCharacters: favoriteCharacters,
            favoriteComics: newComics,
        };
        localStorage.setItem("favorites", JSON.stringify(dataToSave));
    }

    function getImageUrl(thumbnail) {
        if (!thumbnail) {
            return "https://via.placeholder.com/300x300?text=No+Image";
        }
        return thumbnail.path + "." + thumbnail.extension;
    }

    function goToCharacterDetail(characterId) {
        navigate("/characters/" + characterId);
    }

    const hasNoFavorites = favoriteCharacters.length === 0 && favoriteComics.length === 0;

    return (
        <div className="page">
            <h1>Mes Favoris</h1>

            {hasNoFavorites ? (
                <div style={{ textAlign: "center", padding: "48px" }}>
                    <p className="empty-message" style={{ fontSize: "19px", marginBottom: "16px" }}>
                        Vous n'avez aucun favori pour le moment.
                    </p>
                    <p style={{ color: "rgba(255,255,255,0.5)" }}>
                        Ajoutez des personnages ou comics en cliquant sur ☆
                    </p>
                </div>
            ) : (
                <>
                    <section className="favorites-section">
                        <h2>Personnages ({favoriteCharacters.length})</h2>
                        {favoriteCharacters.length === 0 ? (
                            <p className="empty-message">Aucun personnage favori.</p>
                        ) : (
                            <div className="cards-grid">
                                {favoriteCharacters.map((character) => (
                                    <article
                                        key={character.id}
                                        className="card"
                                        onClick={() => goToCharacterDetail(character.id)}
                                    >
                                        <button
                                            className="favorite-btn active"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removeCharacter(character.id);
                                            }}
                                        >
                                            ✕
                                        </button>
                                        <img
                                            src={getImageUrl(character.thumbnail)}
                                            alt={character.name}
                                            className="card-image"
                                        />
                                        <div className="card-content">
                                            <h3 className="card-title">{character.name}</h3>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="favorites-section">
                        <h2>Comics ({favoriteComics.length})</h2>
                        {favoriteComics.length === 0 ? (
                            <p className="empty-message">Aucun comic favori.</p>
                        ) : (
                            <div className="cards-grid">
                                {favoriteComics.map((comic) => (
                                    <article key={comic.id} className="card">
                                        <button
                                            className="favorite-btn active"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removeComic(comic.id);
                                            }}
                                        >
                                            ✕
                                        </button>
                                        <img
                                            src={getImageUrl(comic.thumbnail)}
                                            alt={comic.title}
                                            className="card-image"
                                        />
                                        <div className="card-content">
                                            <h3 className="card-title">{comic.title}</h3>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
}

export default Favorites;
