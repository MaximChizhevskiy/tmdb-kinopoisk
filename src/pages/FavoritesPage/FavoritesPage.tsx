import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useFavorites } from "../../hooks"
import { MovieCard } from "../../components"
import styles from "./FavoritesPage.module.css"

type SortOption = "newest" | "oldest" | "rating" | "title"

export const FavoritesPage = () => {
  const navigate = useNavigate()
  const { favorites, clearAllFavorites, getFavoritesCount } = useFavorites()
  const [sortBy, setSortBy] = useState<SortOption>("newest")

  const sortedFavorites = useMemo(() => {
    const sorted = [...favorites]

    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => b.addedAt - a.addedAt)
      case "oldest":
        return sorted.sort((a, b) => a.addedAt - b.addedAt)
      case "rating":
        return sorted.sort((a, b) => b.vote_average - a.vote_average)
      case "title":
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      default:
        return sorted
    }
  }, [favorites, sortBy])

  const handleClearAll = () => {
    if (window.confirm("Вы уверены, что хотите удалить все фильмы из избранного?")) {
      clearAllFavorites()
    }
  }

  if (favorites.length === 0) {
    return (
      <div className={`${styles.favoritesPage} ${styles.favoritesPageEmpty}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>❤️</div>
          <h1 className={styles.emptyStateTitle}>Здесь пока ничего нет</h1>
          <p className={styles.emptyStateText}>Добавляйте фильмы в избранное, нажимая на сердечко в карточке фильма</p>
          <button className={styles.emptyStateButton} onClick={() => navigate("/movies?category=popular")}>
            Перейти к фильмам
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.favoritesPage}>
      <div className={styles.favoritesHeader}>
        <div className={styles.favoritesHeaderLeft}>
          <h1 className={styles.favoritesTitle}>Мои любимые фильмы</h1>
          <span className={styles.favoritesCount}>
            {getFavoritesCount()} {getFavoritesCount() === 1 ? "фильм" : "фильмов"}
          </span>
        </div>

        <div className={styles.favoritesControls}>
          <div className={styles.filtersSort}>
            <label htmlFor="sort-select" className={styles.sortLabel}>
              Сортировка:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className={styles.sortSelect}
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="rating">По рейтингу</option>
              <option value="title">По названию</option>
            </select>
          </div>

          <button className={styles.clearAllButton} onClick={handleClearAll} aria-label="Удалить все">
            🗑️ Очистить всё
          </button>
        </div>
      </div>

      <div className={styles.favoritesGrid}>
        {sortedFavorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} showRating={true} />
        ))}
      </div>

      {favorites.length > 0 && (
        <div className={styles.favoritesFooter}>
          <p className={styles.favoritesHint}>💡 Всего добавлено фильмов: {favorites.length}</p>
        </div>
      )}
    </div>
  )
}
