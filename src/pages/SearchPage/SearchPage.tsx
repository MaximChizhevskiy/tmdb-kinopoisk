import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useSearchMoviesQuery } from "../../api"
import { SearchBar, MovieCard, Pagination } from "../../components"
import { SkeletonMovieCard } from "../../components"
import { useErrorType } from "../../hooks"
import styles from "./SearchPage.module.css"
import { ErrorMessage } from "../../components"

const SearchContent = ({ query, onSearch }: { query: string; onSearch: (q: string) => void }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const { data, isLoading, isFetching, isError, error, refetch } = useSearchMoviesQuery(
    { query, page: currentPage },
    { skip: !query },
  )
  const errorType = useErrorType(error)

  if (isLoading) {
    return (
      <div className={styles.searchPage}>
        <div className={styles.searchPageHeader}>
          <h1>Поиск фильмов</h1>
          <SearchBar initialQuery={query} onSearch={onSearch} align="left" />
        </div>
        <div className={styles.moviesGrid}>
          {[...Array(20)].map((_, i) => (
            <SkeletonMovieCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.searchPage}>
        <div className={styles.searchPageHeader}>
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
    <div className={styles.searchPage}>
      <div className={styles.searchPageHeader}>
        <h1>Поиск фильмов</h1>
        <SearchBar initialQuery={query} onSearch={onSearch} align="left" />
      </div>

      {movies.length === 0 ? (
        <div className={styles.noResults}>
          <h2>Результаты поиска: "{query}"</h2>
          <p>По вашему запросу ничего не найдено</p>
          <p>Попробуйте изменить поисковый запрос</p>
        </div>
      ) : (
        <>
          <div className={styles.searchResultsHeader}>
            <h2>Результаты поиска: "{query}"</h2>
            <p className={styles.resultsCount}>Найдено фильмов: {totalResults.toLocaleString()}</p>
          </div>

          <div className={`${styles.moviesGrid} ${isFetching ? styles.fetching : ""}`}>
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

export const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get("query") || ""

  const handleSearch = (searchQuery: string) => {
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
  }

  if (!query) {
    return (
      <div className={styles.searchPage}>
        <div className={styles.searchPageHeader}>
          <h1>Поиск фильмов</h1>
          <SearchBar onSearch={handleSearch} align="left" />
        </div>
        <div className={styles.noQuery}>
          <p>Введите поисковый запрос, чтобы найти фильмы</p>
        </div>
      </div>
    )
  }

  return <SearchContent key={query} query={query} onSearch={handleSearch} />
}
