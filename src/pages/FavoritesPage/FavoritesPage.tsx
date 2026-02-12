import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useFavorites } from "../../hooks/useFavorites"
import { MovieCard } from "../../components"
import "./FavoritesPage.css"

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
      <div className="favorites-page favorites-page--empty">
        <div className="empty-state">
          <div className="empty-state-icon">❤️</div>
          <h1 className="empty-state-title">Здесь пока ничего нет</h1>
          <p className="empty-state-text">Добавляйте фильмы в избранное, нажимая на сердечко в карточке фильма</p>
          <button className="empty-state-button" onClick={() => navigate("/movies?category=popular")}>
            Перейти к фильмам
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <div className="favorites-header-left">
          <h1 className="favorites-title">Мои любимые фильмы</h1>
          <span className="favorites-count">
            {getFavoritesCount()} {getFavoritesCount() === 1 ? "фильм" : "фильмов"}
          </span>
        </div>

        <div className="favorites-controls">
          <div className="filters-sort">
            <label htmlFor="sort-select" className="sort-label">
              Сортировка:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="sort-select"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="rating">По рейтингу</option>
              <option value="title">По названию</option>
            </select>
          </div>

          <button className="clear-all-button" onClick={handleClearAll} aria-label="Удалить все">
            🗑️ Очистить всё
          </button>
        </div>
      </div>

      <div className="favorites-grid">
        {sortedFavorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} showRating={true} />
        ))}
      </div>

      {favorites.length > 0 && (
        <div className="favorites-footer">
          <p className="favorites-hint">💡 Всего добавлено фильмов: {favorites.length}</p>
        </div>
      )}
    </div>
  )
}
