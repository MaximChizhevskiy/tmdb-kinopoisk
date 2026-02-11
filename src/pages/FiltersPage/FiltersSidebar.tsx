import { useState, useEffect } from "react"
import "./FiltersPage.css"

import { useDebounce } from "../../hooks/useDebounce"
import { type DiscoverMoviesParams, SORT_OPTIONS } from "../../types/tmdbTypes.ts"
import { useGetGenresQuery } from "../../api/tmdbApi.ts"

interface FiltersSidebarProps {
  filters: DiscoverMoviesParams
  onFilterChange: (filters: DiscoverMoviesParams) => void
}

export const FiltersSidebar = ({ filters, onFilterChange }: FiltersSidebarProps) => {
  const { data: genresData } = useGetGenresQuery("ru-RU")
  const [localFilters, setLocalFilters] = useState(filters)

  // Локальные состояния для ползунков
  const [ratingMin, setRatingMin] = useState(filters["vote_average.gte"] || 0)
  const [ratingMax, setRatingMax] = useState(filters["vote_average.lte"] || 10)
  const [yearFrom, setYearFrom] = useState(filters["release_date.gte"]?.split("-")[0] || "")
  const [yearTo, setYearTo] = useState(filters["release_date.lte"]?.split("-")[0] || "")

  // Дебаунс значений
  const debouncedRatingMin = useDebounce(ratingMin, 200)
  const debouncedRatingMax = useDebounce(ratingMax, 200)
  const debouncedYearFrom = useDebounce(yearFrom, 300)
  const debouncedYearTo = useDebounce(yearTo, 300)

  // Синхронизируем локальные фильтры с пропсами
  useEffect(() => {
    setLocalFilters(filters)
    setRatingMin(filters["vote_average.gte"] || 0)
    setRatingMax(filters["vote_average.lte"] || 10)
    setYearFrom(filters["release_date.gte"]?.split("-")[0] || "")
    setYearTo(filters["release_date.lte"]?.split("-")[0] || "")
  }, [filters])

  // Применяем debounced рейтинг
  useEffect(() => {
    if (
      debouncedRatingMin !== (filters["vote_average.gte"] || 0) ||
      debouncedRatingMax !== (filters["vote_average.lte"] || 10)
    ) {
      handleRatingChange(debouncedRatingMin, debouncedRatingMax)
    }
  }, [debouncedRatingMin, debouncedRatingMax])

  // Применяем debounced год
  useEffect(() => {
    if (
      debouncedYearFrom !== (filters["release_date.gte"]?.split("-")[0] || "") ||
      debouncedYearTo !== (filters["release_date.lte"]?.split("-")[0] || "")
    ) {
      handleYearChange(debouncedYearFrom, debouncedYearTo)
    }
  }, [debouncedYearFrom, debouncedYearTo])

  // Эффект для обновления градиента ползунков
  useEffect(() => {
    // Обновляем CSS переменные для позиции ползунков
    const minPercent = (ratingMin / 10) * 100
    const maxPercent = (ratingMax / 10) * 100

    const sliderMin = document.querySelector(".slider-min") as HTMLElement
    const sliderMax = document.querySelector(".slider-max") as HTMLElement

    if (sliderMin) {
      sliderMin.style.background = `linear-gradient(to right, 
        var(--secondary-color) 0%, 
        var(--secondary-color) ${minPercent}%,
        var(--border-color) ${minPercent}%,
        var(--border-color) 100%
      )`
    }

    if (sliderMax) {
      sliderMax.style.background = `linear-gradient(to right, 
        var(--border-color) 0%, 
        var(--border-color) ${minPercent}%,
        var(--secondary-color) ${minPercent}%,
        var(--secondary-color) ${maxPercent}%,
        var(--border-color) ${maxPercent}%,
        var(--border-color) 100%
      )`
    }
  }, [ratingMin, ratingMax])

  const handleChange = (key: keyof DiscoverMoviesParams, value: any) => {
    const updated = { ...localFilters, [key]: value, page: 1 }
    setLocalFilters(updated)
    onFilterChange(updated)
  }

  const handleRatingChange = (min: number, max: number) => {
    const updated: DiscoverMoviesParams = {
      ...localFilters,
      "vote_average.gte": min > 0 ? min : undefined,
      "vote_average.lte": max < 10 ? max : undefined,
      page: 1,
    }
    setLocalFilters(updated)
    onFilterChange(updated)
  }

  const handleYearChange = (from: string, to: string) => {
    const updated: DiscoverMoviesParams = {
      ...localFilters,
      "release_date.gte": from ? `${from}-01-01` : undefined,
      "release_date.lte": to ? `${to}-12-31` : undefined,
      page: 1,
    }
    setLocalFilters(updated)
    onFilterChange(updated)
  }

  const handleGenreToggle = (genreId: number) => {
    const currentGenres = localFilters.with_genres?.split(",").filter(Boolean) || []
    let newGenres: string[]

    if (currentGenres.includes(genreId.toString())) {
      newGenres = currentGenres.filter((id) => id !== genreId.toString())
    } else {
      newGenres = [...currentGenres, genreId.toString()]
    }

    handleChange("with_genres", newGenres.join(",") || undefined)
  }

  const clearAllFilters = () => {
    const clearedFilters: DiscoverMoviesParams = {
      page: 1,
      sort_by: "popularity.desc",
    }
    setLocalFilters(clearedFilters)
    onFilterChange(clearedFilters)

    // Сбрасываем локальные состояния
    setRatingMin(0)
    setRatingMax(10)
    setYearFrom("")
    setYearTo("")
  }

  const hasActiveFilters = Object.keys(localFilters).some(
    (key) => !["page", "sort_by", "language"].includes(key) && localFilters[key as keyof DiscoverMoviesParams],
  )

  return (
    <aside className="filters-sidebar">
      <div className="filters-header">
        <h2>Фильтры</h2>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className="clear-filters">
            ✕ Сбросить все
          </button>
        )}
      </div>

      {/* 1. СОРТИРОВКА */}
      <div className="filter-section">
        <h3>Сортировка</h3>
        <select
          value={localFilters.sort_by || "popularity.desc"}
          onChange={(e) => handleChange("sort_by", e.target.value)}
          className="filter-select"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 2. РЕЙТИНГ (ТЕПЕРЬ ПЕРЕД ЖАНРАМИ) */}
      <div className="filter-section">
        <h3>Рейтинг</h3>
        <div className="rating-range">
          <div className="rating-values">
            <span>
              От: <strong>{ratingMin.toFixed(1)}</strong>
            </span>
            <span>
              До: <strong>{ratingMax.toFixed(1)}</strong>
            </span>
          </div>

          {/* КОНТЕЙНЕР С ДВУМЯ ПОЛЗУНКАМИ */}
          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={ratingMin}
              onChange={(e) => {
                const value = parseFloat(e.target.value)
                // Не даём минимальному ползунку обогнать максимальный
                setRatingMin(Math.min(value, ratingMax - 0.1))
              }}
              className="slider slider-min"
            />
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={ratingMax}
              onChange={(e) => {
                const value = parseFloat(e.target.value)
                // Не даём максимальному ползунку стать меньше минимального
                setRatingMax(Math.max(value, ratingMin + 0.1))
              }}
              className="slider slider-max"
            />
          </div>

          <div className="rating-inputs">
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={ratingMin}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0
                setRatingMin(Math.min(value, ratingMax - 0.1))
              }}
              className="filter-input"
            />
            <span className="rating-separator">—</span>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={ratingMax}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 10
                setRatingMax(Math.max(value, ratingMin + 0.1))
              }}
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {/* 3. ЖАНРЫ */}
      <div className="filter-section">
        <h3>Жанры</h3>
        <div className="genres-grid">
          {genresData?.genres.map((genre) => (
            <button
              key={genre.id}
              className={`genre-chip ${localFilters.with_genres?.split(",").includes(genre.id.toString()) ? "active" : ""}`}
              onClick={() => handleGenreToggle(genre.id)}
              type="button"
            >
              {genre.name}
            </button>
          ))}
        </div>
        <p className="filter-hint">Можно выбрать несколько жанров</p>
      </div>

      {/* 4. ГОД ВЫПУСКА */}
      <div className="filter-section">
        <h3>Год выпуска</h3>
        <div className="year-inputs">
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            placeholder="От"
            className="filter-input"
          />
          <span className="year-separator">—</span>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            placeholder="До"
            className="filter-input"
          />
        </div>
      </div>

      {/* 5. ДОПОЛНИТЕЛЬНО */}
      <div className="filter-section">
        <h3>Дополнительно</h3>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={localFilters.include_adult || false}
            onChange={(e) => handleChange("include_adult", e.target.checked)}
          />
          Включая 18+
        </label>
      </div>
    </aside>
  )
}
