import styles from "./NotFoundPage.module.css"
import { useNavigate } from "react-router-dom"

export const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.notFoundPage}>
      <div className={styles.notFoundContent}>
        <div className={styles.notFoundAnimation}>
          <div className={styles.notFoundNumber}>4</div>
          <div className={styles.notFoundCircle}>0</div>
          <div className={styles.notFoundNumber}>4</div>
        </div>

        <h1 className={styles.notFoundTitle}>Страница не найдена</h1>
        <p className={styles.notFoundText}>Возможно, она была удалена или никогда не существовала.</p>

        <div className={styles.notFoundActions}>
          <button onClick={() => navigate(-1)} className={`${styles.notFoundButton} ${styles.notFoundButtonSecondary}`}>
            ← Назад
          </button>
          <button onClick={() => navigate("/")} className={`${styles.notFoundButton} ${styles.notFoundButtonPrimary}`}>
            На главную
          </button>
        </div>

        <div className={styles.notFoundHelp}>
          <h3>Полезные ссылки:</h3>
          <div className={styles.helpLinks}>
            <a href="/movies?category=popular">Популярные фильмы</a>
            <a href="/search">Поиск</a>
            <a href="/filters">Фильтры</a>
            <a href="/favorites">Избранное</a>
          </div>
        </div>
      </div>
    </div>
  )
}
