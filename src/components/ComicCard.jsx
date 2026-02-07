function ComicCard({ comic, isFavorite, onToggleFavorite }) {
    let imageUrl = "https://via.placeholder.com/300x450?text=No+Image";
    if (comic.thumbnail) {
        imageUrl = comic.thumbnail.path + "." + comic.thumbnail.extension;
    }

    function handleFavoriteClick(event) {
        event.stopPropagation();
        onToggleFavorite(comic);
    }

    return (
        <article className="card">
            <button
                className={isFavorite ? "favorite-btn active" : "favorite-btn"}
                onClick={handleFavoriteClick}
            >
                {isFavorite ? "★" : "☆"}
            </button>
            <img
                src={imageUrl}
                alt={comic.title}
                className="card-image"
            />
            <div className="card-content">
                <h3 className="card-title">{comic.title}</h3>
                <p className="card-description">
                    {comic.description || "Aucune description disponible."}
                </p>
            </div>
        </article>
    );
}

export default ComicCard;
