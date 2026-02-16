import { useNavigate } from "react-router-dom"
import styles from "./MoviesCategory.module.css"
import type { MoviesCategoryProps } from "../../types"
import { MovieCard } from "../MovieCard/MovieCard.tsx"

export const MoviesCategory = ({ title, movies, isLoading, isError, viewMoreLink }: MoviesCategoryProps) => {
  const navigate = useNavigate()

  const handleViewMore = () => {
    navigate(viewMoreLink)
  }

  if (isLoading) {
    return <div className={styles.moviesCategoryLoading}>Загрузка {title.toLowerCase()}...</div>
  }

  if (isError) {
    return <div className={styles.moviesCategoryError}>Ошибка при загрузке {title.toLowerCase()}</div>
  }

  const displayedMovies = movies?.slice(0, 6) || []

  if (displayedMovies.length === 0) {
    return null
  }

  return (
    <section className={styles.moviesCategory}>
      <div className={styles.moviesCategoryHeader}>
        <h2 className={styles.moviesCategoryTitle}>{title}</h2>
        <button
          className={styles.moviesCategoryViewMore}
          onClick={handleViewMore}
          aria-label={`View more ${title.toLowerCase()}`}
        >
          Смотреть все
        </button>
      </div>

      <div className={styles.moviesCategoryGrid}>
        {displayedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  )
}
