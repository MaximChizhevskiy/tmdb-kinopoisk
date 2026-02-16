import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

import { useErrorType } from "../../hooks"
import styles from "./MoviePage.module.css" // ← импорт стилей
import {
  useGetMovieCreditsQuery,
  useGetMovieDetailsQuery,
  useGetMovieRecommendationsQuery,
  useGetMovieVideosQuery,
} from "../../api"
import { BackButton, MovieCard, Pagination } from "../../components"
import { ErrorMessage } from "../../components"

export const MoviePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const movieId = parseInt(id || "0")
  const [recommendationsPage, setRecommendationsPage] = useState(1)

  const {
    data: movie,
    isLoading: isMovieLoading,
    isError: isMovieError,
    error: movieError,
    refetch: refetchMovie,
  } = useGetMovieDetailsQuery({ movieId }, { skip: !movieId })

  const { data: credits, isLoading: isCreditsLoading } = useGetMovieCreditsQuery(movieId, { skip: !movieId })

  const { data: videos } = useGetMovieVideosQuery(movieId, { skip: !movieId })

  const { data: recommendations, isLoading: isRecommendationsLoading } = useGetMovieRecommendationsQuery(
    { movieId, page: recommendationsPage },
    { skip: !movieId },
  )

  const errorType = useErrorType(movieError)

  useEffect(() => {
    if (!movieId || isNaN(movieId)) {
      navigate("/")
    }
  }, [movieId, navigate])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (isMovieLoading) {
    return (
      <div className={styles.moviePage}>
        <div className={styles.moviePageHeader}>
          <BackButton fallbackPath="/movies" />
        </div>
        <div className={styles.loading}>
          <div className="loading-spinner"></div>
          <p>Загрузка информации о фильме...</p>
        </div>
      </div>
    )
  }

  if (isMovieError || !movie) {
    return (
      <div className={styles.moviePage}>
        <div className={styles.moviePageHeader}>
          <BackButton fallbackPath="/movies" />
        </div>
        <ErrorMessage
          errorType={errorType || "notFound"}
          message="Не удалось загрузить информацию о фильме"
          onRetry={refetchMovie}
        />
      </div>
    )
  }

  const trailer =
    videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer" && video.official) ||
    videos?.results?.find((video) => video.site === "YouTube" && video.type === "Trailer")

  const director = credits?.crew?.find((person) => person.job === "Director")

  const mainCast = credits?.cast?.slice(0, 8) || []

  return (
    <div className={styles.moviePage}>
      <div
        className={styles.movieHero}
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : undefined,
        }}
      >
        <div className={styles.movieHeroContent}>
          <div className={styles.moviePoster}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className={styles.moviePosterImage}
              />
            ) : (
              <div className={styles.moviePosterPlaceholder}>
                <span>Нет изображения</span>
              </div>
            )}
          </div>

          <div className={styles.movieHeroInfo}>
            <h1 className={styles.movieTitle}>{movie.title}</h1>

            {movie.tagline && <p className={styles.movieTagline}>{movie.tagline}</p>}

            <div className={styles.movieMeta}>
              <div className={styles.movieRating}>
                <span className={styles.ratingStar}>⭐</span>
                <span className={styles.ratingValue}>{movie.vote_average.toFixed(1)}</span>
                <span className={styles.ratingCount}>({movie.vote_count.toLocaleString()} оценок)</span>
              </div>

              <div className={styles.movieYear}>{new Date(movie.release_date).getFullYear()}</div>

              {movie.runtime ? (
                <div className={styles.movieRuntime}>
                  {Math.floor(movie.runtime / 60)}ч {movie.runtime % 60}мин
                </div>
              ) : (
                <div className={styles.movieRuntime}>Длительность неизвестна</div>
              )}

              {movie.adult && <div className={styles.movieAdult}>18+</div>}
            </div>

            <div className={styles.movieGenres}>
              {movie.genres?.map((genre) => (
                <span key={genre.id} className={styles.genreTag}>
                  {genre.name}
                </span>
              ))}
            </div>

            {trailer && (
              <div className={styles.trailerButtonContainer}>
                <button
                  className={styles.trailerButton}
                  onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank")}
                >
                  ▶ Смотреть трейлер
                </button>
              </div>
            )}
          </div>
          <div className={styles.moviePageHeader}>
            <BackButton fallbackPath="/movies" className={styles.heroBackButton} />
          </div>
        </div>
      </div>

      <div className={styles.movieContent}>
        <div className={styles.movieMain}>
          <section className={styles.movieOverview}>
            <h2>Описание</h2>
            <p className={styles.overviewText}>{movie.overview || "Описание отсутствует"}</p>
          </section>

          {director && (
            <section className={styles.movieDirector}>
              <h2>Режиссер</h2>
              <div className="director-info">
                <span className="director-name">{director.name}</span>
              </div>
            </section>
          )}

          {mainCast.length > 0 && !isCreditsLoading && (
            <section className={styles.movieCast}>
              <h2>В главных ролях</h2>
              <div className={styles.castGrid}>
                {mainCast.map((actor) => (
                  <div key={actor.id} className={styles.castMember}>
                    <div className={styles.castPhoto}>
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className={styles.castImage}
                        />
                      ) : (
                        <div className={styles.castPlaceholder}>
                          <span>Нет фото</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.castInfo}>
                      <h3 className={styles.castName}>{actor.name}</h3>
                      <p className={styles.castCharacter}>{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.movieDetails}>
            <h2>Детальная информация</h2>
            <div className={styles.detailsGrid}>
              {movie.status && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Статус:</span>
                  <span className={styles.detailValue}>{movie.status}</span>
                </div>
              )}

              {movie.budget > 0 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Бюджет:</span>
                  <span className={styles.detailValue}>${movie.budget.toLocaleString()}</span>
                </div>
              )}

              {movie.revenue > 0 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Сборы:</span>
                  <span className={styles.detailValue}>${movie.revenue.toLocaleString()}</span>
                </div>
              )}

              {movie.original_language && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Язык оригинала:</span>
                  <span className={styles.detailValue}>{movie.original_language.toUpperCase()}</span>
                </div>
              )}

              {movie.production_countries && movie.production_countries.length > 0 && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Страна:</span>
                  <span className={styles.detailValue}>{movie.production_countries.map((c) => c.name).join(", ")}</span>
                </div>
              )}

              {movie.release_date && (
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Дата выхода:</span>
                  <span className={styles.detailValue}>{new Date(movie.release_date).toLocaleDateString("ru-RU")}</span>
                </div>
              )}
            </div>
          </section>

          {recommendations && recommendations.results.length > 0 && (
            <section className={styles.movieRecommendations}>
              <h2>Рекомендации</h2>
              {isRecommendationsLoading ? (
                <div className="loading-recommendations">
                  <div className="loading-spinner small"></div>
                  <p>Загрузка рекомендаций...</p>
                </div>
              ) : (
                <>
                  <div className={styles.recommendationsGrid}>
                    {recommendations.results.slice(0, 6).map((recMovie) => (
                      <MovieCard key={recMovie.id} movie={recMovie} showRating={true} />
                    ))}
                  </div>

                  {recommendations.total_pages > 1 && (
                    <Pagination
                      currentPage={recommendationsPage}
                      totalPages={Math.min(recommendations.total_pages, 5)}
                      onPageChange={setRecommendationsPage}
                      showItemsCount={false}
                    />
                  )}
                </>
              )}
            </section>
          )}
        </div>

        <div className={styles.movieSidebar}>
          {movie.homepage && (
            <div className={styles.sidebarSection}>
              <h3>Официальный сайт</h3>
              <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className={styles.homepageLink}>
                🌐 Перейти на сайт
              </a>
            </div>
          )}

          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className={styles.sidebarSection}>
              <h3>Производство</h3>
              <div className={styles.productionCompanies}>
                {movie.production_companies.map((company) => (
                  <div key={company.id} className={styles.company}>
                    {company.logo_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                        alt={company.name}
                        className={styles.companyLogo}
                        title={company.name}
                      />
                    ) : (
                      <span className={styles.companyName}>{company.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {movie.production_countries && movie.production_countries.length > 0 && (
            <div className={styles.sidebarSection}>
              <h3>Страны производства</h3>
              <div className="countries-list">
                {movie.production_countries.map((country) => (
                  <div key={country.iso_3166_1} className="country">
                    <span className="country-flag">{getCountryFlag(country.iso_3166_1)}</span>
                    <span className="country-name">{country.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getCountryFlag(countryCode: string): string {
  const flags: Record<string, string> = {
    US: "🇺🇸",
    GB: "🇬🇧",
    RU: "🇷🇺",
    FR: "🇫🇷",
    DE: "🇩🇪",
    IT: "🇮🇹",
    ES: "🇪🇸",
    JP: "🇯🇵",
    KR: "🇰🇷",
    CN: "🇨🇳",
    IN: "🇮🇳",
    CA: "🇨🇦",
    AU: "🇦🇺",
  }
  return flags[countryCode] || "🌍"
}
