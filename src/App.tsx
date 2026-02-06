import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Header from "./components/Header/Header.tsx"

// Временные страницы
const HomePage = () => (
  <div className="page">
    <h1>TMDB-Kinopoisk</h1>
    <p>Главная страница с популярными фильмами</p>
  </div>
)

const MoviesPage = () => (
  <div className="page">
    <h1>Фильмы по категориям</h1>
    <p>Список фильмов по жанрам</p>
  </div>
)

// ... остальные страницы (FiltersPage, SearchPage, FavoritesPage)

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // Здесь можно добавить сохранение в localStorage
  }

  return (
    <Router>
      <div className={`app ${isDarkMode ? "dark" : "light"}`}>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route
              path="/filters"
              element={
                <div className="page">
                  <h1>Фильтры</h1>
                </div>
              }
            />
            <Route
              path="/search"
              element={
                <div className="page">
                  <h1>Поиск</h1>
                </div>
              }
            />
            <Route
              path="/favorites"
              element={
                <div className="page">
                  <h1>Избранное</h1>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
