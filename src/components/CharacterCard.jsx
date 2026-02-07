import { useNavigate } from "react-router-dom";

const CharacterCard = ({ character, isFavorite, onToggleFavorite }) => {
    const navigate = useNavigate();

    // Construire l'URL de l'image
    const imageUrl = character.thumbnail
        ? `${character.thumbnail.path}.${character.thumbnail.extension}`
        : "https://via.placeholder.com/300x300?text=No+Image";

    const handleCardClick = () => {
        navigate(`/characters/${character._id}`);
    };

    const handleFavoriteClick = (e) => {
        e.stopPropagation(); // Empêche la navigation
        onToggleFavorite(character);
    };

    return (
        <article className="card" onClick={handleCardClick}>
            <button
                className={`favorite-btn ${isFavorite ? "active" : ""}`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
                {isFavorite ? "★" : "☆"}
            </button>
            <img
                src={imageUrl}
                alt={character.name}
                className="card-image"
                loading="lazy"
            />
            <div className="card-content">
                <h3 className="card-title">{character.name}</h3>
                <p className="card-description">
                    {character.description || "Aucune description disponible."}
                </p>
            </div>
        </article>
    );
};

export default CharacterCard;
