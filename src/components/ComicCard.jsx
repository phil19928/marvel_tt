function ComicCard({ comic, isFavorite, onToggleFavorite }) {

    function getImageUrl() {
        if (comic.thumbnail) {
            return comic.thumbnail.path + "." + comic.thumbnail.extension;
        } else {
            return "https://via.placeholder.com/300x450?text=No+Image";
        }
    }

    function handleFavoriteClick(event) {
        // Empêche le clic sur la carte si besoin
        event.stopPropagation();
        onToggleFavorite(comic);
    }

    let favoriteClass = "favorite-btn";
    let favoriteIcon = "☆";

    if (isFavorite) {
        favoriteClass = "favorite-btn active";
        favoriteIcon = "★";
    }

    return (
        <article className="card">
            <button className={favoriteClass} onClick={handleFavoriteClick}>
                {favoriteIcon}
            </button>

            <img
                src={getImageUrl()}
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
