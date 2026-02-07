import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import { ThemeProvider } from "./context/ThemeContext.tsx"
import { Header } from "./components/Header/Header.tsx"
import { WelcomeSection } from "./components/WelcomeSection/WelcomeSection.tsx"
import { SearchPage } from "./pages/SearchPage.tsx"

export const HomePage = () => {
  return (
    <div className="page">
      <WelcomeSection />
      {/* Здесь позже добавим остальные секции */}
    </div>
  )
}

export const MoviesPage = () => (
  <div className="page">
    <h1>🎥 Фильмы по категориям</h1>
    <p>Скоро здесь будут фильмы</p>
  </div>
)

export const FiltersPage = () => (
  <div className="page">
    <h1>🔍 Фильтры</h1>
    <p>Фильтрация фильмов</p>
  </div>
)

export const FavoritesPage = () => (
  <div className="page">
    <h1>⭐ Избранное</h1>
    <p>Ваши сохранённые фильмы</p>
  </div>
)

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/filters" element={<FiltersPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}
