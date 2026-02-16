import { type ChangeEvent, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./WelcomeSection.module.css"
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const isSearchDisabled = !searchQuery.trim()

  return (
    <section
      className={styles.welcomeSection}
      style={{
        backgroundImage: backdropUrl ? `url(${backdropUrl})` : "linear-gradient(135deg, #0d253f 0%, #01b4e4 100%)",
      }}
    >
      <div className={styles.welcomeContent}>
        <h1 className={styles.welcomeTitle}>Добро пожаловать.</h1>
        <p className={styles.welcomeSubtitle}>
          Миллионы фильмов, сериалов и людей. <br />
          Исследуйте сейчас.
        </p>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Поиск фильмов..."
              value={searchQuery}
              onChange={handleInputChange}
              aria-label="Поиск фильмов"
            />
            <button
              type="submit"
              className={styles.searchButton}
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
