import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import styles from "./CategoryMoviesPage.module.css"
import {
  useGetNowPlayingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
} from "../../api"
import { MovieCard, Pagination } from "../../components"
import { SkeletonMovieCard } from "../../components"
import { useErrorType } from "../../hooks"
import { ErrorMessage } from "../../components"

type CategoryType = "popular" | "top_rated" | "upcoming" | "now_playing"

const CATEGORIES = [
  { id: "popular", label: "Популярные" },
  { id: "top_rated", label: "Топ рейтинга" },
  { id: "upcoming", label: "Ожидаемые" },
  { id: "now_playing", label: "Сейчас в кино" },
] as const

export const CategoryMoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = (searchParams.get("category") as CategoryType) || "popular"
  const page = parseInt(searchParams.get("page") || "1")
  const [currentPage, setCurrentPage] = useState(page)

  useEffect(() => {
    setCurrentPage(page)
  }, [page])

  const updateUrlParams = (newCategory: string, newPage: number) => {
    setSearchParams({ category: newCategory, page: newPage.toString() })
  }

  const handleCategoryChange = (newCategory: CategoryType) => {
    updateUrlParams(newCategory, 1)
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams(category, newPage)
  }

  const popularQuery = useGetPopularMoviesQuery(currentPage, { skip: category !== "popular" })
  const topRatedQuery = useGetTopRatedMoviesQuery(currentPage, { skip: category !== "top_rated" })
  const upcomingQuery = useGetUpcomingMoviesQuery(currentPage, { skip: category !== "upcoming" })
  const nowPlayingQuery = useGetNowPlayingMoviesQuery(currentPage, { skip: category !== "now_playing" })

  const getActiveQuery = () => {
    switch (category) {
      case "top_rated":
        return topRatedQuery
      case "upcoming":
        return upcomingQuery
      case "now_playing":
        return nowPlayingQuery
      default:
        return popularQuery
    }
  }

  const { data, isLoading, isFetching, isError, error, refetch } = getActiveQuery()
  const errorType = useErrorType(error)

  const getCategoryTitle = () => {
    switch (category) {
      case "popular":
        return "Популярные фильмы"
      case "top_rated":
        return "Топ рейтинга"
      case "upcoming":
        return "Ожидаемые фильмы"
      case "now_playing":
        return "Сейчас в кино"
      default:
        return "Movies"
    }
  }

  if (isLoading) {
    return (
      <div className={styles.categoryMoviesPage}>
        <div className={styles.categoryTabs}>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} className={styles.categoryTab}>
              {cat.label}
            </button>
          ))}
        </div>
        <div className={styles.categoryMoviesGrid}>
          {[...Array(20)].map((_, i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.categoryMoviesPage}>
        <div className={styles.categoryTabs}>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} className={styles.categoryTab}>
              {cat.label}
            </button>
          ))}
        </div>
        <ErrorMessage
          errorType={errorType || "unknown"}
          message={`Ошибка при загрузке ${getCategoryTitle().toLowerCase()}`}
          onRetry={refetch}
        />
      </div>
    )
  }

  const movies = data?.results || []
  const totalPages = Math.min(data?.total_pages || 0, 500)
  const totalResults = data?.total_results || 0

  return (
    <div className={styles.categoryMoviesPage}>
      <div className={styles.categoryTabs}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.categoryTab} ${category === cat.id ? styles.active : ""}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.categoryMoviesHeader}>
        <h1>{getCategoryTitle()}</h1>
        <p className={styles.moviesCount}>Всего фильмов: {totalResults.toLocaleString()}</p>
      </div>

      <div className={`${styles.categoryMoviesGrid} ${isFetching ? styles.fetching : ""}`}>
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalResults}
        onPageChange={handlePageChange}
        showItemsCount={false}
      />
    </div>
  )
}
