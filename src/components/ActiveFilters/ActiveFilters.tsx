import styles from "./ActiveFilters.module.css"
import { type DiscoverMoviesParams, SORT_OPTIONS } from "../../types"
import { useGetGenresQuery } from "../../api"

interface ActiveFiltersProps {
  filters: DiscoverMoviesParams
  onRemoveFilter: (key: string) => void
  onClearAll: () => void
}

export const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) => {
  const { data: genresData } = useGetGenresQuery("ru-RU")

  const getActiveFilters = () => {
    const activeFilters: { key: string; label: string }[] = []

    if (filters.sort_by && filters.sort_by !== "popularity.desc") {
      const sortOption = SORT_OPTIONS.find((opt) => opt.value === filters.sort_by)
      if (sortOption) {
        activeFilters.push({
          key: "sort_by",
          label: `Сортировка: ${sortOption.label}`,
        })
      }
    }

    if (filters.with_genres) {
      const genreIds = filters.with_genres.split(",").filter(Boolean)
      const genreNames = genreIds
        .map((id) => genresData?.genres.find((g) => g.id === parseInt(id))?.name)
        .filter(Boolean)

      if (genreNames.length > 0) {
        let label = ""
        if (genreNames.length <= 3) {
          label = `Жанры: ${genreNames.join(", ")}`
        } else {
          label = `Жанры: ${genreNames.slice(0, 3).join(", ")} +${genreNames.length - 3}`
        }
        activeFilters.push({ key: "with_genres", label })
      }
    }

    const ratingMin = filters["vote_average.gte"]
    const ratingMax = filters["vote_average.lte"]
    if (ratingMin || ratingMax) {
      const min = ratingMin?.toFixed(1) || "0.0"
      const max = ratingMax?.toFixed(1) || "10.0"
      activeFilters.push({
        key: "rating",
        label: `Рейтинг: ${min} - ${max}`,
      })
    }

    const yearFrom = filters["release_date.gte"]?.split("-")[0]
    const yearTo = filters["release_date.lte"]?.split("-")[0]
    if (yearFrom || yearTo) {
      const from = yearFrom || "любого"
      const to = yearTo || "любого"
      activeFilters.push({
        key: "year",
        label: `Год: ${from} - ${to}`,
      })
    }

    if (filters.include_adult) {
      activeFilters.push({
        key: "include_adult",
        label: "18+",
      })
    }

    return activeFilters
  }

  const activeFilters = getActiveFilters()

  if (activeFilters.length === 0) {
    return null
  }

  return (
    <div className={styles.activeFilters}>
      <div className={styles.activeFiltersHeader}>
        <span className={styles.activeFiltersTitle}>
          <span className={styles.filterIcon}>⚡</span>
          Активные фильтры:
        </span>
        <button onClick={onClearAll} className={styles.clearAllButton} aria-label="Сбросить все фильтры">
          Сбросить все
        </button>
      </div>

      <div className={styles.filtersTags}>
        {activeFilters.map((filter) => (
          <span key={filter.key} className={styles.filterTag}>
            <span className={styles.filterTagLabel}>{filter.label}</span>
            <button
              onClick={() => onRemoveFilter(filter.key)}
              className={styles.filterTagRemove}
              aria-label={`Удалить фильтр ${filter.label}`}
              title="Удалить фильтр"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
