import { useNavigate } from "react-router-dom"
import "./MovieCard.css"
import type { MovieCardProps } from "../../types/tmdbTypes.ts"

export const MovieCard = ({ movie, showRating = true }: MovieCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/movie/${movie.id}`)
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
        <div className="movie-card-info">
          <span className="movie-card-year">{releaseYear}</span>
          <span className="movie-card-genres">
            {movie.genre_ids?.slice(0, 2).map((genreId) => (
              <span key={genreId} className="movie-card-genre">
                {genreId}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}
