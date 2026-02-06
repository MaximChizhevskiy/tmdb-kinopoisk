import { Link, useLocation } from "react-router-dom"
import "./Header.css" // Создадим отдельный CSS файл
import tmdbLogo from "/tmdb-logo.svg"

const Header = () => {
  const location = useLocation()

  return (
    <header className="header">
      <div className="header-container">
        {/* Логотип слева */}
        <div className="header-logo">
          <Link to="/">
            <img src={tmdbLogo} alt="TMDB Logo" className="tmdb-logo" />
          </Link>
        </div>

        {/* Навигация по центру */}
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Main
          </Link>
          <span className="nav-separator">|</span>
          <Link to="/movies" className={`nav-link ${location.pathname === "/movies" ? "active" : ""}`}>
            Category movies
          </Link>
          <span className="nav-separator">|</span>
          <Link to="/filters" className={`nav-link ${location.pathname === "/filters" ? "active" : ""}`}>
            Filtered movies
          </Link>
          <span className="nav-separator">|</span>
          <Link to="/search" className={`nav-link ${location.pathname === "/search" ? "active" : ""}`}>
            Search
          </Link>
          <span className="nav-separator">|</span>
          <Link to="/favorites" className={`nav-link ${location.pathname === "/favorites" ? "active" : ""}`}>
            Favorites
          </Link>
        </nav>

        {/* Кнопка темы справа */}
        <div className="header-theme">
          <button className="theme-toggle" aria-label="Toggle theme">
            🌙
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
