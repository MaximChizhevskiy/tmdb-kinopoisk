import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./WelcomeSection.css"
import { useGetPopularMoviesQuery } from "../../api"

export const WelcomeSection = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { data: popularMovies, isLoading } = useGetPopularMoviesQuery(1)
  const [randomSeed] = useState(() => Math.random())

  const backdropUrl = useMemo(() => {
    if (!isLoading && popularMovies?.results && popularMovies.results.length > 0) {
      const index = Math.floor(randomSeed * popularMovies.results.length)
      const selectedMovie = popularMovies.results[index]

      if (selectedMovie?.backdrop_path) {
        return `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`
      }
    }
    return ""
  }, [popularMovies, isLoading, randomSeed])

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const isSearchDisabled = !searchQuery.trim()

  return (
    <section
      className="welcome-section"
      style={{
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : "linear-gradient(135deg, #0d253f 0%, #01b4e4 100%)",
      }}
    >
      <div className="welcome-content">
        <h1 className="welcome-title">Добро пожаловать.</h1>
        <p className="welcome-subtitle">Миллионы фильмов, сериалов и людей. Исследуйте сейчас.</p>

        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Поиск фильмов..."
              value={searchQuery}
              onChange={handleInputChange}
              aria-label="Поиск фильмов"
            />
            <button
              type="submit"
              className="search-button"
              disabled={isSearchDisabled}
              aria-disabled={isSearchDisabled}
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
