import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import "./MovieCard.css"
import type { MovieCardProps } from "../../types"

export const MovieCard = ({ movie, showRating = true }: MovieCardProps) => {
  const navigate = useNavigate()
  const [isFavorite, setIsFavorite] = useState(false)

  // Загружаем состояние избранного из localStorage
  useEffect(() => {
    const loadFavoriteState = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")
        setIsFavorite(favorites.includes(movie.id))
      } catch (error) {
        console.error("Error loading favorites:", error)
      }
    }

    loadFavoriteState()
  }, [movie.id])

  const handleClick = useCallback(() => {
    navigate(`/movie/${movie.id}`)
  }, [navigate, movie.id])

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      const newFavoriteState = !isFavorite
      setIsFavorite(newFavoriteState)

      // Обновляем localStorage
      try {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]")

        if (newFavoriteState) {
          if (!favorites.includes(movie.id)) {
            const updatedFavorites = [...favorites, movie.id]
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
          }
        } else {
          const updatedFavorites = favorites.filter((id: number) => id !== movie.id)
          localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
        }
      } catch (error) {
        console.error("Error updating favorites:", error)
        setIsFavorite(!newFavoriteState)
      }
    },
    [isFavorite, movie.id],
  )

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
          {/* Сердце слева */}
          <button
            className={`movie-card-favorite ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            type="button"
          >
            <span className="movie-card-favorite-icon">{isFavorite ? "❤️" : "🤍"}</span>
          </button>

          {/* Год справа */}
          <span className="movie-card-year">{releaseYear}</span>
        </div>
      </div>
    </div>
  )
}
