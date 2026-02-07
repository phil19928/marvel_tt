import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ComicCard from "../components/ComicCard";
import API_URL from "../config";

function CharacterDetail() {
    const params = useParams(); // Récupère l'ID depuis l'URL
    const characterId = params.id;

    const [comics, setComics] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);

    // 1. Charger les favoris
    useEffect(function () {
        const savedFavorites = localStorage.getItem("favorites");
        if (savedFavorites) {
            const parsedFavorites = JSON.parse(savedFavorites);
            setFavorites(parsedFavorites.favoriteComics || []);
        }
    }, []);

    // 2. Charger les comics du personnage
    useEffect(function () {
        async function fetchData() {
            setIsLoading(true);
            try {
                const url = API_URL + "/api/character/" + characterId + "/comics";
                const response = await axios.get(url);
                setComics(response.data.comics);
            } catch (error) {
                console.log("Erreur:", error);
            }
            setIsLoading(false);
        }
        fetchData();
    }, [characterId]);

    // Fonction pour gérer les favoris
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

        // Sauvegarde localStorage
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
            <Link to="/characters" className="btn btn-secondary" style={{ marginBottom: "20px", display: "inline-block" }}>
                ← Retour aux personnages
            </Link>

            <h1>Comics liés au personnage</h1>

            {comics.length === 0 ? (
                <p>Aucun comic trouvé pour ce personnage.</p>
            ) : (
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
            )}
        </div>
    );
}

export default CharacterDetail;
