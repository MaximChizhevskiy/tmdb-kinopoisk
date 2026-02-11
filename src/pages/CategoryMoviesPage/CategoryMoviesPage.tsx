import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import "./CategoryMoviesPage.css"
import {
  useGetNowPlayingMoviesQuery,
  useGetPopularMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
} from "../../api"
import { MovieCard } from "../../components"
import { Pagination } from "../../components"

type CategoryType = "popular" | "top_rated" | "upcoming" | "now_playing"

const CATEGORIES = [
  { id: "popular", label: "Popular" },
  { id: "top_rated", label: "Top Rated" },
  { id: "upcoming", label: "Upcoming" },
  { id: "now_playing", label: "Now Playing" },
] as const

export const CategoryMoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Получаем категорию и страницу из URL
  const category = (searchParams.get("category") as CategoryType) || "popular"
  const page = parseInt(searchParams.get("page") || "1")
  const [currentPage, setCurrentPage] = useState(page)

  // Синхронизируем currentPage с URL при изменении
  useEffect(() => {
    setCurrentPage(page)
  }, [page])

  // Обновляем URL при смене категории или страницы
  const updateUrlParams = (newCategory: string, newPage: number) => {
    setSearchParams({
      category: newCategory,
      page: newPage.toString(),
    })
  }

  const handleCategoryChange = (newCategory: CategoryType) => {
    updateUrlParams(newCategory, 1) // При смене категории сбрасываем на первую страницу
  }

  const handlePageChange = (newPage: number) => {
    updateUrlParams(category, newPage)
  }

  // Запросы к API
  const popularQuery = useGetPopularMoviesQuery(currentPage, {
    skip: category !== "popular",
  })
  const topRatedQuery = useGetTopRatedMoviesQuery(currentPage, {
    skip: category !== "top_rated",
  })
  const upcomingQuery = useGetUpcomingMoviesQuery(currentPage, {
    skip: category !== "upcoming",
  })
  const nowPlayingQuery = useGetNowPlayingMoviesQuery(currentPage, {
    skip: category !== "now_playing",
  })

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

  const { data, isLoading, isError, isFetching } = getActiveQuery()

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

  const movies = data?.results || []
  const totalPages = Math.min(data?.total_pages || 0, 500)
  const totalResults = data?.total_results || 0

  return (
    <div className="category-movies-page">
      {/* Секция с кнопками категорий */}
      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`category-tab ${category === cat.id ? "active" : ""}`}
            onClick={() => handleCategoryChange(cat.id)}
            disabled={isFetching} // Блокируем кнопки во время загрузки
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Заголовок и информация */}
      <div className="category-movies-header">
        <h1>{getCategoryTitle()}</h1>
        {!isLoading && !isError && <p className="movies-count">Всего фильмов: {totalResults.toLocaleString()}</p>}
      </div>

      {/* Состояния загрузки/ошибки */}
      {isLoading && <div className="loading">Загрузка {getCategoryTitle().toLowerCase()}...</div>}

      {isError && (
        <div className="error">
          Ошибка при загрузке {getCategoryTitle().toLowerCase()}
          <button onClick={() => handlePageChange(currentPage)} className="retry-button">
            Попробовать снова
          </button>
        </div>
      )}

      {/* Сетка фильмов */}
      {!isLoading && !isError && (
        <>
          {movies.length === 0 ? (
            <div className="no-results">
              <p>Фильмы не найдены</p>
            </div>
          ) : (
            <div className="category-movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}

          {/* Пагинация */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalResults}
            onPageChange={handlePageChange}
            showItemsCount={false}
          />
        </>
      )}
    </div>
  )
}
