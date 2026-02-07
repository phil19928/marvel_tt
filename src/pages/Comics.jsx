import { useState, useEffect } from "react";
import axios from "axios";
import ComicCard from "../components/ComicCard";
import API_URL from "../config";

function Comics() {
    const [comics, setComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [favorites, setFavorites] = useState([]);

    // 1. Charger les favoris
    useEffect(function () {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            setFavorites(parsedFavorites.favoriteComics || []);
        }
    }, []);

    // 2. Charger les comics
    useEffect(function () {
        async function fetchData() {
            setIsLoading(true);
            try {
                let url = API_URL + "/api/comics?page=" + page;
                if (searchText) {
                    url = url + "&title=" + searchText;
                }

                const response = await axios.get(url);
                // On trie les comics par titre (A-Z)
                const sortedComics = response.data.results.sort(function (a, b) {
                    return a.title.localeCompare(b.title);
                });

                setComics(sortedComics);
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

    function toggleFavorite(comic) {
        const newFavorites = [...favorites];

        const existingIndex = newFavorites.findIndex(function (fav) {
            return fav.id === comic._id;
        });

        if (existingIndex !== -1) {
            newFavorites.splice(existingIndex, 1);
        } else {
            newFavorites.push({
                id: comic._id,
                title: comic.title,
                thumbnail: comic.thumbnail
            });
        }

        setFavorites(newFavorites);

        // Sauvegarde
        const savedData = localStorage.getItem("favorites");
        let allFavorites = { favoriteCharacters: [], favoriteComics: [] };
        if (savedData) {
            allFavorites = JSON.parse(savedData);
        }
        allFavorites.favoriteComics = newFavorites;
        localStorage.setItem("favorites", JSON.stringify(allFavorites));
    }

    function isFavorite(comicId) {
        return favorites.some(function (fav) {
            return fav.id === comicId;
        });
    }

    if (isLoading) {
        return <div className="loading">Chargement...</div>;
    }

    return (
        <div className="page">
            <h1>Comics Marvel</h1>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher un comic..."
                    className="search-input"
                    value={searchText}
                    onChange={handleSearch}
                />
            </div>

            <div className="cards-grid">
                {comics.map(function (comic) {
                    return (
                        <ComicCard
                            key={comic._id}
                            comic={comic}
                            isFavorite={isFavorite(comic._id)}
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

export default Comics;
