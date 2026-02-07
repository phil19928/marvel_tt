import { useState, useEffect } from "react";
import axios from "axios";
import ComicCard from "../components/ComicCard";
import API_URL from "../config";

function Comics() {
    const [comics, setComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [totalComics, setTotalComics] = useState(0);
    const [favoritesList, setFavoritesList] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem("favorites");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFavoritesList(parsed.favoriteComics || []);
        }
    }, []);

    useEffect(() => {
        async function loadComics() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                let url = API_URL + "/api/comics?page=" + currentPage;
                if (submittedSearch !== "") {
                    url = url + "&title=" + submittedSearch;
                }

                const response = await axios.get(url);
                const comicsData = response.data.results || [];

                const sortedComics = comicsData.sort(function (a, b) {
                    const titleA = a.title || "";
                    const titleB = b.title || "";
                    return titleA.localeCompare(titleB);
                });

                setComics(sortedComics);
                setTotalComics(response.data.count || 0);
            } catch (error) {
                console.error(error);
                setErrorMessage("Erreur lors du chargement des comics.");
            }

            setIsLoading(false);
        }

        loadComics();
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
        const totalPages = Math.ceil(totalComics / 100);
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    function toggleFavorite(comic) {
        const savedData = localStorage.getItem("favorites");
        let currentFavorites = { favoriteCharacters: [], favoriteComics: [] };
        if (savedData) {
            currentFavorites = JSON.parse(savedData);
        }

        const alreadyFavorite = currentFavorites.favoriteComics.find(
            (fav) => fav.id === comic._id
        );

        if (alreadyFavorite) {
            currentFavorites.favoriteComics = currentFavorites.favoriteComics.filter(
                (fav) => fav.id !== comic._id
            );
        } else {
            currentFavorites.favoriteComics.push({
                id: comic._id,
                title: comic.title,
                thumbnail: comic.thumbnail,
            });
        }

        localStorage.setItem("favorites", JSON.stringify(currentFavorites));
        setFavoritesList(currentFavorites.favoriteComics);
    }

    function isComicFavorite(comicId) {
        const found = favoritesList.find((fav) => fav.id === comicId);
        return found !== undefined;
    }

    const totalPages = Math.ceil(totalComics / 100);

    if (isLoading) {
        return <div className="loading">Chargement des comics...</div>;
    }

    if (errorMessage) {
        return <div className="error">{errorMessage}</div>;
    }

    return (
        <div className="page">
            <h1>Comics Marvel</h1>

            <form className="search-container" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Rechercher un comic..."
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
                {totalComics} comic(s) trouvé(s)
                {submittedSearch !== "" && " pour \"" + submittedSearch + "\""}
                {" - Tri alphabétique"}
            </p>

            {comics.length === 0 ? (
                <p className="empty-message">Aucun comic trouvé.</p>
            ) : (
                <div className="cards-grid">
                    {comics.map((comic) => (
                        <ComicCard
                            key={comic._id}
                            comic={comic}
                            isFavorite={isComicFavorite(comic._id)}
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

export default Comics;
