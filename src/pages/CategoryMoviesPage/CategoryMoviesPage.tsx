import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import "./CategoryMoviesPage.css"
import {
  useGetNowPlayingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
} from "../../api"
import { MovieCard, Pagination } from "../../components"
import { SkeletonMovieCard } from "../../components/Skeletons/SkeletonMovieCard"
import { useErrorType } from "../../hooks/useErrorType"
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage.tsx"

type CategoryType = "popular" | "top_rated" | "upcoming" | "now_playing"

const CATEGORIES = [
  { id: "popular", label: "Popular" },
  { id: "top_rated", label: "Top Rated" },
  { id: "upcoming", label: "Upcoming" },
  { id: "now_playing", label: "Now Playing" },
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
        return "Popular Movies"
      case "top_rated":
        return "Top Rated Movies"
      case "upcoming":
        return "Upcoming Movies"
      case "now_playing":
        return "Now Playing Movies"
      default:
        return "Movies"
    }
  }

  if (isLoading) {
    return (
      <div className="category-movies-page">
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} className="category-tab">
              {cat.label}
            </button>
          ))}
        </div>
        <div className="category-movies-grid">
          {[...Array(20)].map((_, i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="category-movies-page">
        <div className="category-tabs">
          {CATEGORIES.map((cat) => (
            <button key={cat.id} className="category-tab">
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
    <div className="category-movies-page">
      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${category === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="category-movies-header">
        <h1>{getCategoryTitle()}</h1>
        <p className="movies-count">Всего фильмов: {totalResults.toLocaleString()}</p>
      </div>

      <div className={`category-movies-grid ${isFetching ? "fetching" : ""}`}>
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
