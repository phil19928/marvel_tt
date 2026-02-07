import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ComicCard from "../components/ComicCard";

const API_URL = "http://localhost:3000";

function CharacterDetail() {
    const { id } = useParams();
    const [comics, setComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
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
                const url = API_URL + "/api/character/" + id + "/comics";
                const response = await axios.get(url);
                setComics(response.data.comics || []);
            } catch (error) {
                console.error(error);
                setErrorMessage("Erreur lors du chargement des comics.");
            }

            setIsLoading(false);
        }

        loadComics();
    }, [id]);

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

    if (isLoading) {
        return <div className="loading">Chargement des comics...</div>;
    }

    if (errorMessage) {
        return (
            <div className="page">
                <Link to="/characters" className="btn btn-secondary" style={{ marginBottom: "16px", display: "inline-block" }}>
                    Retour aux personnages
                </Link>
                <div className="error">{errorMessage}</div>
            </div>
        );
    }

    return (
        <div className="page">
            <Link to="/characters" className="btn btn-secondary" style={{ marginBottom: "24px", display: "inline-block" }}>
                Retour aux personnages
            </Link>

            <h1>Comics du personnage</h1>

            <p style={{ marginBottom: "16px", color: "rgba(255,255,255,0.6)" }}>
                {comics.length} comic(s) trouvé(s)
            </p>

            {comics.length === 0 ? (
                <p className="empty-message">Aucun comic trouvé pour ce personnage.</p>
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
        </div>
    );
}

export default CharacterDetail;
