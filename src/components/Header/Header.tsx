import { useLocation } from "react-router-dom"
import "./Header.css"
import { useTheme } from "../../context"

export const Header = () => {
  const location = useLocation()
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <a href="/">
            <img src="/tmdb-logo.svg" alt="TMDB Logo" className="tmdb-logo" width="154" height="20" />
          </a>
        </div>

        <nav className="header-nav">
          <a href="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
            Main
          </a>
          <span className="nav-separator">|</span>
          <a href="/movies" className={`nav-link ${location.pathname === "/movies" ? "active" : ""}`}>
            Category movies
          </a>
          <span className="nav-separator">|</span>
          <a href="/filters" className={`nav-link ${location.pathname === "/filters" ? "active" : ""}`}>
            Filtered movies
          </a>
          <span className="nav-separator">|</span>
          <a href="/search" className={`nav-link ${location.pathname === "/search" ? "active" : ""}`}>
            Search
          </a>
          <span className="nav-separator">|</span>
          <a href="/favorites" className={`nav-link ${location.pathname === "/favorites" ? "active" : ""}`}>
            Favorites
          </a>
        </nav>

        <div className="header-theme">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  )
}
