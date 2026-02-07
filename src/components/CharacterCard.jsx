import { useNavigate } from "react-router-dom";

function CharacterCard({ character, isFavorite, onToggleFavorite }) {
    const navigate = useNavigate();

    let imageUrl = "https://via.placeholder.com/300x300?text=No+Image";
    if (character.thumbnail) {
        imageUrl = character.thumbnail.path + "." + character.thumbnail.extension;
    }

    function handleCardClick() {
        navigate("/characters/" + character._id);
    }

    function handleFavoriteClick(event) {
        event.stopPropagation();
        onToggleFavorite(character);
    }

    return (
        <article className="card" onClick={handleCardClick}>
            <button
                className={isFavorite ? "favorite-btn active" : "favorite-btn"}
                onClick={handleFavoriteClick}
            >
                {isFavorite ? "★" : "☆"}
            </button>
            <img
                src={imageUrl}
                alt={character.name}
                className="card-image"
            />
            <div className="card-content">
                <h3 className="card-title">{character.name}</h3>
                <p className="card-description">
                    {character.description || "Aucune description disponible."}
                </p>
            </div>
        </article>
    );
}

export default CharacterCard;
