import { useNavigate } from "react-router-dom"
import { useFavorites } from "../../hooks"
import type { MovieCardProps } from "../../types"
import styles from "./MovieCard.module.css"
import React from "react"
import type { Movie } from "../../schemas"

export const MovieCard = ({ movie, showRating = true }: MovieCardProps) => {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFav = isFavorite(movie.id)

  const handleClick = () => {
    navigate(`/movie/${movie.id}`)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()

    const favoriteMovieData = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    }

    toggleFavorite(favoriteMovieData as Movie)
  }

  const releaseYear = movie.release_date?.split("-")[0] || "Нет года"
  const rating = movie.vote_average.toFixed(1)

  return (
    <div className={styles.movieCard} onClick={handleClick}>
      <div className={styles.movieCardPoster}>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className={styles.movieCardImage}
            loading="lazy"
          />
        ) : (
          <div className={styles.movieCardNoImage}>
            <span>Нет изображения</span>
          </div>
        )}

        {showRating && <div className={styles.movieCardRating}>⭐ {rating}</div>}
      </div>

      <div className={styles.movieCardContent}>
        <h3 className={styles.movieCardTitle} title={movie.title}>
          {movie.title}
        </h3>
        <div className={styles.movieCardFooter}>
          <button
            className={`${styles.movieCardFavorite} ${isFav ? styles.active : ""}`}
            onClick={handleFavoriteClick}
            aria-label={isFav ? "Удалить из избранного" : "Добавить в избранное"}
            title={isFav ? "Удалить из избранного" : "Добавить в избранное"}
            type="button"
          >
            <span className={styles.movieCardFavoriteIcon}>{isFav ? "❤️" : "🤍"}</span>
          </button>
          <span className={styles.movieCardYear}>{releaseYear}</span>
        </div>
      </div>
    </div>
  )
}
