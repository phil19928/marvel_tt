const ComicCard = ({ comic, isFavorite, onToggleFavorite }) => {
    // Construire l'URL de l'image
    const imageUrl = comic.thumbnail
        ? `${comic.thumbnail.path}.${comic.thumbnail.extension}`
        : "https://via.placeholder.com/300x450?text=No+Image";

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        onToggleFavorite(comic);
    };

    return (
        <article className="card">
            <button
                className={`favorite-btn ${isFavorite ? "active" : ""}`}
                onClick={handleFavoriteClick}
                aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
                {isFavorite ? "★" : "☆"}
            </button>
            <img
                src={imageUrl}
                alt={comic.title}
                className="card-image"
                loading="lazy"
            />
            <div className="card-content">
                <h3 className="card-title">{comic.title}</h3>
                <p className="card-description">
                    {comic.description || "Aucune description disponible."}
                </p>
            </div>
        </article>
    );
};

export default ComicCard;
