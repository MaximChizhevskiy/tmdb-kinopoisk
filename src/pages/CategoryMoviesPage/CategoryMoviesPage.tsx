import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

import "./CategoryMoviesPage.css"
import {
  useGetNowPlayingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
} from "../../api/tmdbApi.ts"
import { MovieCard } from "../../components/MovieCard/MovieCard.tsx"
import { Pagination } from "../../components/Pagination/Pagination.tsx"

export const CategoryMoviesPage = () => {
  const [searchParams] = useSearchParams()
  const category = searchParams.get("category") || "popular"
  const [currentPage, setCurrentPage] = useState(1)

  // Выбираем нужный запрос
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

  const { data, isLoading, isError } = getActiveQuery()

  useEffect(() => {
    setCurrentPage(1)
  }, [category])

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
        <div className="loading">Загрузка {getCategoryTitle().toLowerCase()}...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="category-movies-page">
        <div className="error">Ошибка при загрузке {getCategoryTitle().toLowerCase()}</div>
      </div>
    )
  }

  const movies = data?.results || []
  const totalPages = Math.min(data?.total_pages || 0, 500)
  const totalResults = data?.total_results || 0

  return (
    <div className="category-movies-page">
      <div className="category-movies-header">
        <h1>{getCategoryTitle()}</h1>
        <p className="movies-count">Всего фильмов: {totalResults.toLocaleString()}</p>
      </div>

      <div className="category-movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalResults}
        onPageChange={setCurrentPage}
        showItemsCount={false}
      />
    </div>
  )
}
