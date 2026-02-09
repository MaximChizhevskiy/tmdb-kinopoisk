import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import "./SearchPage.css"
import { useSearchMoviesQuery } from "../../api"
import { SearchBar } from "../../components"
import type { Movie } from "../../types"
import { MovieCard } from "../../components"
import { Pagination } from "../../components"

export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("query") || ""
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, isError } = useSearchMoviesQuery(
    {
      query,
      page: currentPage,
    },
    { skip: !query },
  )

  useEffect(() => {
    // eslint-disable-next-line
    setCurrentPage(1)
  }, [query])

  const handleSearch = (searchQuery: string) => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalResults}
            onPageChange={handlePageChange}
            showItemsCount={true}
          />
        </>
      )}
    </div>
  )
}
