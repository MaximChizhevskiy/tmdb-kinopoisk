import { useState, useEffect } from "react"
import "./FiltersPage.css"

import { useDebounce } from "../../hooks/useDebounce"
import { type DiscoverMoviesParams, SORT_OPTIONS } from "../../types"
import { useGetGenresQuery } from "../../api"

interface FiltersSidebarProps {
  filters: DiscoverMoviesParams
  onFilterChange: (filters: DiscoverMoviesParams) => void
}

export const FiltersSidebar = ({ filters, onFilterChange }: FiltersSidebarProps) => {
  const { data: genresData } = useGetGenresQuery("ru-RU")

  // ✅ 1. Локальное состояние для UI элементов (ползунки, инпуты)
  // Инициализируем их из пропса `filters` один раз при монтировании.
  const [ratingMin, setRatingMin] = useState(filters["vote_average.gte"] ?? 0)
  const [ratingMax, setRatingMax] = useState(filters["vote_average.lte"] ?? 10)
  const [yearFrom, setYearFrom] = useState(filters["release_date.gte"]?.split("-")[0] ?? "")
  const [yearTo, setYearTo] = useState(filters["release_date.lte"]?.split("-")[0] ?? "")

  // ✅ 2. Дебаунс для значений UI
  const debouncedRatingMin = useDebounce(ratingMin, 200)
  const debouncedRatingMax = useDebounce(ratingMax, 200)
  const debouncedYearFrom = useDebounce(yearFrom, 300)
  const debouncedYearTo = useDebounce(yearTo, 300)

  // ✅ 3. Эффект ТОЛЬКО для отправки дебаунс-значений наверх.
  // Это не просто setState, а синхронизация с "внешней системой" (родительским компонентом и URL).
  useEffect(() => {
    // Формируем новые параметры на основе текущих фильтров и дебаунс-значений
    const newFilters: DiscoverMoviesParams = {
      ...filters, // Берем все текущие фильтры (жанры, сортировку и т.д.)
      page: 1, // Сбрасываем на первую страницу при изменении фильтров
      sort_by: filters.sort_by, // Сохраняем сортировку
      "vote_average.gte": debouncedRatingMin > 0 ? debouncedRatingMin : undefined,
      "vote_average.lte": debouncedRatingMax < 10 ? debouncedRatingMax : undefined,
      "release_date.gte": debouncedYearFrom ? `${debouncedYearFrom}-01-01` : undefined,
      "release_date.lte": debouncedYearTo ? `${debouncedYearTo}-12-31` : undefined,
    }

    // Проверяем, действительно ли изменились рейтинг или год, чтобы избежать лишних вызовов
    const hasRatingChanged =
      (newFilters["vote_average.gte"] ?? 0) !== (filters["vote_average.gte"] ?? 0) ||
      (newFilters["vote_average.lte"] ?? 10) !== (filters["vote_average.lte"] ?? 10)

    const hasYearChanged =
      (newFilters["release_date.gte"] ?? "") !== (filters["release_date.gte"] ?? "") ||
      (newFilters["release_date.lte"] ?? "") !== (filters["release_date.lte"] ?? "")

    if (hasRatingChanged || hasYearChanged) {
      onFilterChange(newFilters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedRatingMin, debouncedRatingMax, debouncedYearFrom, debouncedYearTo]) // Зависимости только от дебаунс-значений

  // ✅ 4. Удалены useEffect для синхронизации с пропсом.
  // Теперь локальное состояние (ratingMin, и т.д.) не зависит от `filters` после монтирования.
  // Это нормально, потому что эти поля управляются пользователем через UI.
  // Если нужно сбросить фильтры извне, для этого есть кнопка "Сбросить все".

  const handleChange = (key: keyof DiscoverMoviesParams, value: unknown) => {
    // Можно добавить небольшую валидацию
    const updated = { ...filters, [key]: value, page: 1 }
    onFilterChange(updated)
  }

  const handleGenreToggle = (genreId: number) => {
    const currentGenres = filters.with_genres?.split(",").filter(Boolean) || []
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
    onFilterChange(clearedFilters)

    // Сбрасываем локальные состояния UI
    setRatingMin(0)
    setRatingMax(10)
    setYearFrom("")
    setYearTo("")
  }

  const hasActiveFilters = Object.keys(filters).some(
    (key) => !["page", "sort_by", "language"].includes(key) && filters[key as keyof DiscoverMoviesParams],
  )

  // Эффект для обновления градиента ползунков (оставляем, это работа с DOM)
  useEffect(() => {
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
          value={filters.sort_by || "popularity.desc"}
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

      {/* 2. РЕЙТИНГ */}
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

          <div className="dual-slider-container">
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={ratingMin}
              onChange={(e) => {
                const value = parseFloat(e.target.value)
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
              className={`genre-chip ${filters.with_genres?.split(",").includes(genre.id.toString()) ? "active" : ""}`}
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
            checked={filters.include_adult || false}
            onChange={(e) => handleChange("include_adult", e.target.checked)}
          />
          Включая 18+
        </label>
      </div>
    </aside>
  )
}
