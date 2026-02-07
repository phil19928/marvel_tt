import { useState, useEffect } from "react";

function Favorites() {
    const [characterFavorites, setCharacterFavorites] = useState([]);
    const [comicFavorites, setComicFavorites] = useState([]);

    useEffect(function () {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            setCharacterFavorites(parsedFavorites.favoriteCharacters || []);
            setComicFavorites(parsedFavorites.favoriteComics || []);
        }
    }, []);

    function removeCharacter(id) {
        const newHelper = characterFavorites.filter(function (item) {
            return item.id !== id;
        });
        setCharacterFavorites(newHelper);

        // Mise à jour localStorage
        const savedData = localStorage.getItem("favorites");
        let allFavorites = JSON.parse(savedData);
        allFavorites.favoriteCharacters = newHelper;
        localStorage.setItem("favorites", JSON.stringify(allFavorites));
    }

    function removeComic(id) {
        const newHelper = comicFavorites.filter(function (item) {
            return item.id !== id;
        });
        setComicFavorites(newHelper);

        // Mise à jour localStorage
        const savedData = localStorage.getItem("favorites");
        let allFavorites = JSON.parse(savedData);
        allFavorites.favoriteComics = newHelper;
        localStorage.setItem("favorites", JSON.stringify(allFavorites));
    }

    function getImageUrl(thumbnail) {
        if (thumbnail) {
            return thumbnail.path + "." + thumbnail.extension;
        } else {
            return "https://via.placeholder.com/300x300?text=No+Image";
        }
    }

    return (
        <div className="page">
            <h1>Mes Favoris</h1>

            <section className="favorites-section">
                <h2>Personnages</h2>
                {characterFavorites.length === 0 ? (
                    <p>Aucun personnage favori.</p>
                ) : (
                    <div className="cards-grid">
                        {characterFavorites.map(function (character) {
                            return (
                                <article key={character.id} className="card">
                                    <button
                                        className="favorite-btn active"
                                        onClick={function () { removeCharacter(character.id); }}
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
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="favorites-section">
                <h2>Comics</h2>
                {comicFavorites.length === 0 ? (
                    <p>Aucun comic favori.</p>
                ) : (
                    <div className="cards-grid">
                        {comicFavorites.map(function (comic) {
                            return (
                                <article key={comic.id} className="card">
                                    <button
                                        className="favorite-btn active"
                                        onClick={function () { removeComic(comic.id); }}
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
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default Favorites;
