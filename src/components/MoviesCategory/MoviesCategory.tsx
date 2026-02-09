import { useNavigate } from "react-router-dom"
import "./MoviesCategory.css"
import type { MoviesCategoryProps } from "../../types"
import { MovieCard } from "../MovieCard/MovieCard.tsx"

export const MoviesCategory = ({ title, movies, isLoading, isError, viewMoreLink }: MoviesCategoryProps) => {
  const navigate = useNavigate()

  const handleViewMore = () => {
    navigate(viewMoreLink)
  }

  if (isLoading) {
    return <div className="movies-category-loading">Загрузка {title.toLowerCase()}...</div>
  }

  if (isError) {
    return <div className="movies-category-error">Ошибка при загрузке {title.toLowerCase()}</div>
  }

  const displayedMovies = movies?.slice(0, 6) || []

  if (displayedMovies.length === 0) {
    return null
  }

  return (
    <section className="movies-category">
      <div className="movies-category-header">
        <h2 className="movies-category-title">{title}</h2>
        <button
          className="movies-category-view-more"
          onClick={handleViewMore}
          aria-label={`View more ${title.toLowerCase()}`}
        >
          View More
        </button>
      </div>

      <div className="movies-category-grid">
        {displayedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
