import { useNavigate } from "react-router-dom"
import { useFavorites } from "../../hooks/useFavorites"
import type { MovieCardProps } from "../../types"
import "./MovieCard.css"

export const MovieCard = ({ movie, showRating = true }: MovieCardProps) => {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFav = isFavorite(movie.id)

  const handleClick = () => {
    navigate(`/movie/${movie.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(movie)
  }

  const releaseYear = movie.release_date?.split("-")[0] || "Нет года"
  const rating = movie.vote_average.toFixed(1)

  return (
    <div className="movie-card" onClick={handleClick}>
      <div className="movie-card-poster">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-card-image"
            loading="lazy"
          />
        ) : (
          <div className="movie-card-no-image">
            <span>Нет изображения</span>
          </div>
        )}

        {showRating && <div className="movie-card-rating">⭐ {rating}</div>}
      </div>

      <div className="movie-card-content">
        <h3 className="movie-card-title" title={movie.title}>
          {movie.title}
        </h3>
        <div className="movie-card-footer">
          <button
            className={`movie-card-favorite ${isFav ? "active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
            title={isFav ? "Удалить из избранного" : "Добавить в избранное"}
            type="button"
          >
            <span className="movie-card-favorite-icon">{isFav ? "❤️" : "🤍"}</span>
          </button>
          <span className="movie-card-year">{releaseYear}</span>
        </div>
      </div>
    </div>
  )
}
