import { useState, useEffect, type ChangeEvent } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useSearchMoviesQuery } from "../api/tmdbApi"
import type { Movie } from "../types/tmdb"
import "./SearchPage.css"
import { SearchBar } from "../components/SearchBar/SearchBar.tsx"

export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("query") || ""
  const [currentPage, setCurrentPage] = useState(1)
  const [customPageInput, setCustomPageInput] = useState("")

  const { data, isLoading, isError } = useSearchMoviesQuery(
    {
      query,
      page: currentPage,
    },
    { skip: !query },
  )

  useEffect(() => {
    setCurrentPage(1)
    setCustomPageInput("")
  }, [query])

  const handleSearch = (searchQuery: string) => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
  }

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => {
    if (data?.total_pages) {
      setCurrentPage(Math.min(data.total_pages, 500))
    }
  }
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1))
  const goToNextPage = () => {
    if (data?.total_pages && currentPage < Math.min(data.total_pages, 500)) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handleCustomPageSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const pageNum = parseInt(customPageInput)
    const totalPages = data?.total_pages ? Math.min(data.total_pages, 500) : 1

    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum)
      setCustomPageInput("")
    }
  }

  const handleCustomPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomPageInput(e.target.value)
  }

  if (!query) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <h1>Поиск фильмов</h1>
          <SearchBar onSearch={handleSearch} align="left" />
        </div>
        <div className="no-query">
          <p>Введите поисковый запрос, чтобы найти фильмы</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <h1>Поиск фильмов</h1>
          <SearchBar initialQuery={query} onSearch={handleSearch} align="left" />
        </div>
        <div className="loading">Загрузка результатов...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <h1>Поиск фильмов</h1>
          <SearchBar initialQuery={query} onSearch={handleSearch} align="left" />
        </div>
        <div className="error">Ошибка при загрузке фильмов</div>
      </div>
    )
  }

  const movies = data?.results || []
  const totalPages = Math.min(data?.total_pages || 0, 500)
  const totalResults = data?.total_results || 0

  return (
    <div className="search-page">
      <div className="search-page-header">
        <h1>Поиск фильмов</h1>
        <SearchBar initialQuery={query} onSearch={handleSearch} align="left" />
      </div>

      {movies.length === 0 ? (
        <div className="no-results">
          <h2>Результаты поиска: "{query}"</h2>
          <p>По вашему запросу ничего не найдено</p>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>
      ) : (
        <>
          <div className="search-results-header">
            <h2>Результаты поиска: "{query}"</h2>
            <p className="results-count">Найдено фильмов: {totalResults.toLocaleString()}</p>
          </div>

          <div className="movies-grid">
            {movies.map((movie: Movie) => (
              <div key={movie.id} className="movie-card">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                    loading="lazy"
                  />
                ) : (
                  <div className="movie-poster-placeholder">Нет изображения</div>
                )}
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-info">
                  <span className="movie-year">{movie.release_date?.split("-")[0] || "Нет года"}</span>
                  <span className="movie-rating">⭐ {movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* УЛУЧШЕННАЯ ПАГИНАЦИЯ */}
          {totalPages > 1 && (
            <div className="pagination">
              <div className="pagination-controls">
                <button
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="pagination-button pagination-button-first"
                  aria-label="Первая страница"
                  title="Первая страница"
                >
                  ««
                </button>

                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="pagination-button pagination-button-prev"
                  aria-label="Предыдущая страница"
                  title="Предыдущая страница"
                >
                  «
                </button>

                <span className="page-info">
                  Страница <strong>{currentPage}</strong> из <strong>{totalPages}</strong>
                </span>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage >= totalPages}
                  className="pagination-button pagination-button-next"
                  aria-label="Следующая страница"
                  title="Следующая страница"
                >
                  »
                </button>

                <button
                  onClick={goToLastPage}
                  disabled={currentPage >= totalPages}
                  className="pagination-button pagination-button-last"
                  aria-label="Последняя страница"
                  title="Последняя страница"
                >
                  »»
                </button>
              </div>

              <form className="custom-page-form" onSubmit={handleCustomPageSubmit}>
                <label htmlFor="custom-page" className="custom-page-label">
                  Перейти на страницу:
                </label>
                <input
                  id="custom-page"
                  type="number"
                  min="1"
                  max={totalPages}
                  value={customPageInput}
                  onChange={handleCustomPageChange}
                  placeholder="№"
                  className="custom-page-input"
                  aria-label="Номер страницы для перехода"
                />
                <button
                  type="submit"
                  className="custom-page-button"
                  disabled={!customPageInput}
                  aria-label="Перейти на указанную страницу"
                >
                  Перейти
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  )
}
