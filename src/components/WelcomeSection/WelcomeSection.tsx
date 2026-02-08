import { type ChangeEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./WelcomeSection.css"
import { useGetPopularMoviesQuery } from "../../api/tmdbApi.ts"

export const WelcomeSection = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [randomBackdrop, setRandomBackdrop] = useState<string | null>(null)

  const { data: popularMovies, isLoading } = useGetPopularMoviesQuery(1)

  useEffect(() => {
    if (!isLoading && popularMovies?.results && popularMovies.results.length > 0) {
      const randomIndex = Math.floor(Math.random() * popularMovies.results.length)
      const randomMovie = popularMovies.results[randomIndex]

      if (randomMovie?.backdrop_path) {
        setRandomBackdrop(`https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`)
      }
    }
  }, [popularMovies, isLoading])

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const isSearchDisabled = !searchQuery.trim()

  return (
    <section
      className="welcome-section"
      style={{
        backgroundImage: randomBackdrop
          ? `url(${randomBackdrop})`
          : "linear-gradient(135deg, #0d253f 0%, #01b4e4 100%)",
      }}
    >
      <div className="welcome-content">
        <h1 className="welcome-title">Добро пожаловать.</h1>
        <p className="welcome-subtitle">
          Миллионы фильмов, сериалов и людей. <br />
          Исследуйте сейчас.
        </p>

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
