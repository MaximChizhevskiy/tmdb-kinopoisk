import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import "./FiltersPage.css"
import { MovieCard, Pagination, ActiveFilters } from "../../components"
import { FiltersSidebar } from "./FiltersSidebar"
import type { DiscoverMoviesParams } from "../../types/tmdbTypes.ts"
import { useDiscoverMoviesQuery } from "../../api/tmdbApi.ts"
export const FiltersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  // Инициализируем фильтры из URL
  const [filters, setFilters] = useState<DiscoverMoviesParams>(() => {
    const params: DiscoverMoviesParams = {
      page: parseInt(searchParams.get("page") || "1"),
      sort_by: searchParams.get("sort_by") || "popularity.desc",
    }

    // Читаем все параметры из URL
    if (searchParams.get("with_genres")) params.with_genres = searchParams.get("with_genres")!
    if (searchParams.get("vote_average.gte"))
      params["vote_average.gte"] = parseFloat(searchParams.get("vote_average.gte")!)
    if (searchParams.get("vote_average.lte"))
      params["vote_average.lte"] = parseFloat(searchParams.get("vote_average.lte")!)
    if (searchParams.get("release_date.gte")) params["release_date.gte"] = searchParams.get("release_date.gte")!
    if (searchParams.get("release_date.lte")) params["release_date.lte"] = searchParams.get("release_date.lte")!
    if (searchParams.get("include_adult")) params.include_adult = searchParams.get("include_adult") === "true"

    return params
  })

  const { data, isLoading, isFetching, isError } = useDiscoverMoviesQuery(filters)

  // Обновляем URL при изменении фильтров
  const handleFilterChange = (newFilters: DiscoverMoviesParams) => {
    setFilters(newFilters)

    // Преобразуем фильтры в URL параметры
    const params: Record<string, string> = {
      page: (newFilters.page || 1).toString(),
    }

    if (newFilters.sort_by && newFilters.sort_by !== "popularity.desc") {
      params.sort_by = newFilters.sort_by
    }
    if (newFilters.with_genres) params.with_genres = newFilters.with_genres
    if (newFilters["vote_average.gte"]) params["vote_average.gte"] = newFilters["vote_average.gte"].toString()
    if (newFilters["vote_average.lte"]) params["vote_average.lte"] = newFilters["vote_average.lte"].toString()
    if (newFilters["release_date.gte"]) params["release_date.gte"] = newFilters["release_date.gte"]
    if (newFilters["release_date.lte"]) params["release_date.lte"] = newFilters["release_date.lte"]
    if (newFilters.include_adult) params.include_adult = newFilters.include_adult.toString()

    setSearchParams(params, { replace: true })
  }

  const handlePageChange = (page: number) => {
    handleFilterChange({ ...filters, page })
  }

  const handleRemoveFilter = (key: string) => {
    const updated = { ...filters, page: 1 }

    switch (key) {
      case "sort_by":
        updated.sort_by = "popularity.desc"
        break
      case "with_genres":
        delete updated.with_genres
        break
      case "rating":
        delete updated["vote_average.gte"]
        delete updated["vote_average.lte"]
        break
      case "year":
        delete updated["release_date.gte"]
        delete updated["release_date.lte"]
        break
      case "include_adult":
        delete updated.include_adult
        break
    }

    handleFilterChange(updated)
  }

  const handleClearAllFilters = () => {
    handleFilterChange({ page: 1, sort_by: "popularity.desc" })
  }

  const movies = data?.results || []
  const totalPages = Math.min(data?.total_pages || 0, 500)
  const totalResults = data?.total_results || 0

  return (
    <div className="filters-page">
      <FiltersSidebar filters={filters} onFilterChange={handleFilterChange} />

      <main className="filters-content">
        <div className="filters-header">
          <h1>Фильтры и сортировка</h1>
          {!isLoading && !isError && (
            <span className="results-count">Найдено фильмов: {totalResults.toLocaleString()}</span>
          )}
        </div>

        {/* Компонент активных фильтров */}
        <ActiveFilters filters={filters} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} />

        {isLoading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Загрузка фильмов...</p>
          </div>
        )}

        {isError && (
          <div className="error">
            <h3>Ошибка при загрузке фильмов</h3>
            <p>Попробуйте обновить страницу или изменить параметры фильтрации</p>
            <button onClick={() => handleFilterChange({ ...filters })} className="retry-button">
              Повторить
            </button>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {movies.length === 0 ? (
              <div className="no-results">
                <div className="no-results-icon">🎬</div>
                <h3>Фильмы не найдены</h3>
                <p>Попробуйте изменить параметры фильтрации</p>
                <button onClick={handleClearAllFilters} className="clear-filters-button">
                  Сбросить все фильтры
                </button>
              </div>
            ) : (
              <>
                <div className={`movies-grid ${isFetching ? "fetching" : ""}`}>
                  {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination
                    currentPage={filters.page || 1}
                    totalPages={totalPages}
                    totalItems={totalResults}
                    onPageChange={handlePageChange}
                    showItemsCount={false}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
