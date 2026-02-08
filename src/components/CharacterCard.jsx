import { useNavigate } from "react-router-dom";

function CharacterCard({ character, isFavorite, onToggleFavorite }) {
    const navigate = useNavigate();

    function getImageUrl() {
        if (character.thumbnail && character.thumbnail.path) {
            return character.thumbnail.path + "." + character.thumbnail.extension;
        } else {
            return "https://via.placeholder.com/300x300?text=Pas+d'image";
        }
    }

    function handleCardClick() {
        navigate("/characters/" + character._id);
    }

    function handleFavoriteClick(event) {
        event.stopPropagation();
        onToggleFavorite(character);
    }

    let favoriteClass = "favorite-btn";
    let favoriteIcon = "☆";

    if (isFavorite === true) {
        favoriteClass = "favorite-btn active";
        favoriteIcon = "★";
    }

    return (
        <article className="card" onClick={handleCardClick}>
            <button className={favoriteClass} onClick={handleFavoriteClick}>
                {favoriteIcon}
            </button>

            <img
                src={getImageUrl()}
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
