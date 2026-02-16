import { useLocation } from "react-router-dom"
import styles from "./Header.module.css"
import { useTheme } from "../../context"

export const Header = () => {
  const location = useLocation()
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <a href="/">
            <img src="/tmdb-logo.svg" alt="TMDB Logo" className={styles.tmdbLogo} width="154" height="20" />
          </a>
        </div>

        <nav className={styles.headerNav}>
          <a href="/" className={`${styles.navLink} ${location.pathname === "/" ? styles.active : ""}`}>
            Главная
          </a>
          <span className={styles.navSeparator}>|</span>

          <a
            href="/movies?category=popular"
            className={`${styles.navLink} ${location.pathname === "/movies" ? styles.active : ""}`}
          >
            Категории
          </a>
          <span className={styles.navSeparator}>|</span>

          <a href="/filters" className={`${styles.navLink} ${location.pathname === "/filters" ? styles.active : ""}`}>
            Фильтры
          </a>
          <span className={styles.navSeparator}>|</span>

          <a href="/search" className={`${styles.navLink} ${location.pathname === "/search" ? styles.active : ""}`}>
            Поиск
          </a>
          <span className={styles.navSeparator}>|</span>

          <a
            href="/favorites"
            className={`${styles.navLink} ${location.pathname === "/favorites" ? styles.active : ""}`}
          >
            Избранное
          </a>
        </nav>

        <div className={styles.headerTheme}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  )
}
