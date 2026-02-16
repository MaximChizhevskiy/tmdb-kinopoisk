import { useState, useEffect } from "react"
import styles from "./FiltersPage.module.css"

import { useDebounce } from "../../hooks"
import { type DiscoverMoviesParams, SORT_OPTIONS } from "../../types"
import { useGetGenresQuery } from "../../api"

interface FiltersSidebarProps {
  filters: DiscoverMoviesParams
  onFilterChange: (filters: DiscoverMoviesParams) => void
}

export const FiltersSidebar = ({ filters, onFilterChange }: FiltersSidebarProps) => {
  const { data: genresData } = useGetGenresQuery("ru-RU")

  const [ratingMin, setRatingMin] = useState(filters["vote_average.gte"] ?? 0)
  const [ratingMax, setRatingMax] = useState(filters["vote_average.lte"] ?? 10)
  const [yearFrom, setYearFrom] = useState(filters["release_date.gte"]?.split("-")[0] ?? "")
  const [yearTo, setYearTo] = useState(filters["release_date.lte"]?.split("-")[0] ?? "")

  const debouncedRatingMin = useDebounce(ratingMin, 200)
  const debouncedRatingMax = useDebounce(ratingMax, 200)
  const debouncedYearFrom = useDebounce(yearFrom, 300)
  const debouncedYearTo = useDebounce(yearTo, 300)

  useEffect(() => {
    const newFilters: DiscoverMoviesParams = {
      ...filters,
      page: 1,
      sort_by: filters.sort_by,
      "vote_average.gte": debouncedRatingMin > 0 ? debouncedRatingMin : undefined,
      "vote_average.lte": debouncedRatingMax < 10 ? debouncedRatingMax : undefined,
      "release_date.gte": debouncedYearFrom ? `${debouncedYearFrom}-01-01` : undefined,
      "release_date.lte": debouncedYearTo ? `${debouncedYearTo}-12-31` : undefined,
    }

    const hasRatingChanged =
      (newFilters["vote_average.gte"] ?? 0) !== (filters["vote_average.gte"] ?? 0) ||
      (newFilters["vote_average.lte"] ?? 10) !== (filters["vote_average.lte"] ?? 10)

    const hasYearChanged =
      (newFilters["release_date.gte"] ?? "") !== (filters["release_date.gte"] ?? "") ||
      (newFilters["release_date.lte"] ?? "") !== (filters["release_date.lte"] ?? "")

    if (hasRatingChanged || hasYearChanged) {
      onFilterChange(newFilters)
    }
  }, [debouncedRatingMin, debouncedRatingMax, debouncedYearFrom, debouncedYearTo])

  const handleChange = (key: keyof DiscoverMoviesParams, value: unknown) => {
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

    setRatingMin(0)
    setRatingMax(10)
    setYearFrom("")
    setYearTo("")
  }

  const hasActiveFilters = Object.keys(filters).some(
    (key) => !["page", "sort_by", "language"].includes(key) && filters[key as keyof DiscoverMoviesParams],
  )

  useEffect(() => {
    const minPercent = (ratingMin / 10) * 100
    const maxPercent = (ratingMax / 10) * 100

    const sliderMin = document.querySelector(`.${styles.sliderMin}`) as HTMLElement
    const sliderMax = document.querySelector(`.${styles.sliderMax}`) as HTMLElement

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
    <aside className={styles.filtersSidebar}>
      <div className={styles.filtersHeader}>
        <h2>Фильтры</h2>
        {hasActiveFilters && (
          <button onClick={clearAllFilters} className={styles.clearFilters}>
            ✕ Сбросить все
          </button>
        )}
      </div>

      <div className={styles.filterSection}>
        <h3>Сортировка</h3>
        <select
          value={filters.sort_by || "popularity.desc"}
          onChange={(e) => handleChange("sort_by", e.target.value)}
          className={styles.filterSelect}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterSection}>
        <h3>Рейтинг</h3>
        <div className={styles.ratingRange}>
          <div className={styles.ratingValues}>
            <span>
              От: <strong>{ratingMin.toFixed(1)}</strong>
            </span>
            <span>
              До: <strong>{ratingMax.toFixed(1)}</strong>
            </span>
          </div>

          <div className={styles.dualSliderContainer}>
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
              className={`${styles.slider} ${styles.sliderMin}`}
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
              className={`${styles.slider} ${styles.sliderMax}`}
            />
          </div>

          <div className={styles.ratingInputs}>
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
              className={styles.filterInput}
            />
            <span className={styles.ratingSeparator}>—</span>
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
              className={styles.filterInput}
            />
          </div>
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3>Жанры</h3>
        <div className={styles.genresGrid}>
          {genresData?.genres.map((genre) => (
            <button
              key={genre.id}
              className={`${styles.genreChip} ${filters.with_genres?.split(",").includes(genre.id.toString()) ? styles.active : ""}`}
              onClick={() => handleGenreToggle(genre.id)}
              type="button"
            >
              {genre.name}
            </button>
          ))}
        </div>
        <p className={styles.filterHint}>Можно выбрать несколько жанров</p>
      </div>

      <div className={styles.filterSection}>
        <h3>Год выпуска</h3>
        <div className={styles.yearInputs}>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={yearFrom}
            onChange={(e) => setYearFrom(e.target.value)}
            placeholder="От"
            className={styles.filterInput}
          />
          <span className={styles.yearSeparator}>—</span>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={yearTo}
            onChange={(e) => setYearTo(e.target.value)}
            placeholder="До"
            className={styles.filterInput}
          />
        </div>
      </div>

      <div className={styles.filterSection}>
        <h3>Дополнительно</h3>
        <label className={styles.checkboxLabel}>
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
