import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useSearchMoviesQuery } from "../../api"
import { SearchBar, MovieCard, Pagination } from "../../components"
import { SkeletonMovieCard } from "../../components/Skeletons/SkeletonMovieCard"
import { useErrorType } from "../../hooks/useErrorType"
import "./SearchPage.css"
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage.tsx"

// Создаем внутренний компонент, который будет получать query и управлять пагинацией
const SearchContent = ({ query, onSearch }: { query: string; onSearch: (q: string) => void }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading, isFetching, isError, error, refetch } = useSearchMoviesQuery(
    { query, page: currentPage },
    { skip: !query },
  )
  const errorType = useErrorType(error)

  // При изменении query (через key) состояние currentPage сбросится автоматически
  // useEffect больше не нужен!

  if (isLoading) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <h1>Поиск фильмов</h1>
          <SearchBar initialQuery={query} onSearch={onSearch} align="left" />
        </div>
        <div className="movies-grid">
          {[...Array(20)].map((_, i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="search-page">
        <div className="search-page-header">
          <h1>Поиск фильмов</h1>
          <SearchBar initialQuery={query} onSearch={onSearch} align="left" />
        </div>
        <ErrorMessage
          errorType={errorType || "unknown"}
          message="Не удалось загрузить результаты поиска"
          onRetry={refetch}
        />
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
        <SearchBar initialQuery={query} onSearch={onSearch} align="left" />
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

          <div className={`movies-grid ${isFetching ? "fetching" : ""}`}>
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalResults}
            onPageChange={setCurrentPage}
            showItemsCount={true}
          />
        </>
      )}
    </div>
  )
}

// Основной компонент страницы
export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("query") || ""

  const handleSearch = (searchQuery: string) => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
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

  // ✅ Используем key={query} для полного сброса состояния при изменении запроса
  return <SearchContent key={query} query={query} onSearch={handleSearch} />
}
