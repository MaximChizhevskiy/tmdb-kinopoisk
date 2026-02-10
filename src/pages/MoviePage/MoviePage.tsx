import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MovieCard } from "../../components"
import { Pagination } from "../../components"
import "./MoviePage.css"
import { useGetMovieCreditsQuery, useGetMovieDetailsQuery, useGetMovieRecommendationsQuery } from "../../api/tmdbApi.ts"

export const MoviePage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const movieId = parseInt(id || "0")
  const [recommendationsPage, setRecommendationsPage] = useState(1)

  useEffect(() => {
    // Прокручиваем наверх при загрузке страницы
    window.scrollTo(0, 0)
  }, [id]) // Зависимость от id, чтобы срабатывало при переходе между разными фильмами

  const {
    data: movie,
    isLoading: isMovieLoading,
    isError: isMovieError,
  } = useGetMovieDetailsQuery({ movieId }, { skip: !movieId })

  const { data: credits, isLoading: isCreditsLoading } = useGetMovieCreditsQuery(movieId, { skip: !movieId })

  const { data: recommendations } = useGetMovieRecommendationsQuery(
    { movieId, page: recommendationsPage },
    { skip: !movieId },
  )

  useEffect(() => {
    if (!movieId || isNaN(movieId)) {
      navigate("/")
    }
  }, [movieId, navigate])

  if (isMovieLoading) {
    return (
      <div className="movie-page">
        <div className="loading">Загрузка информации о фильме...</div>
      </div>
    )
  }

  if (isMovieError || !movie) {
    return (
      <div className="movie-page">
        <div className="error">
          <h2>Фильм не найден</h2>
          <p>К сожалению, мы не смогли найти информацию об этом фильме.</p>
          <button onClick={() => navigate("/")} className="back-button">
            Вернуться на главную
          </button>
        </div>
      </div>
    )
  }

  const director = credits?.crew?.find((person) => person.job === "Director")
  const mainCast = credits?.cast?.slice(0, 8) || []
  const runtimeHours = Math.floor(movie.runtime / 60)
  const runtimeMinutes = movie.runtime % 60
  console.log(recommendations)
  return (
    <div className="movie-page">
      {/* Hero секция с бэкдропом */}
      <div
        className="movie-hero"
        style={{
          backgroundImage: movie.backdrop_path
            ? `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : undefined,
        }}
      >
        <div className="movie-hero-content">
          <div className="movie-poster">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster-image"
              />
            ) : (
              <div className="movie-poster-placeholder">
                <span>Нет изображения</span>
              </div>
            )}
          </div>

          <div className="movie-hero-info">
            <h1 className="movie-title">{movie.title}</h1>

            {movie.tagline && <p className="movie-tagline">{movie.tagline}</p>}

            <div className="movie-meta">
              <div className="movie-rating">
                <span className="rating-star">⭐</span>
                <span className="rating-value">{movie.vote_average.toFixed(1)}</span>
                <span className="rating-count">({movie.vote_count.toLocaleString()} оценок)</span>
              </div>

              <div className="movie-year">{new Date(movie.release_date).getFullYear()}</div>

              {movie.runtime > 0 && (
                <div className="movie-runtime">
                  {runtimeHours}ч {runtimeMinutes}мин
                </div>
              )}

              {movie.adult && <div className="movie-adult">18+</div>}
            </div>

            <div className="movie-genres">
              {movie.genres?.map((genre) => (
                <span key={genre.id} className="genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="movie-content">
        <div className="movie-main">
          {/* Описание */}
          <section className="movie-overview">
            <h2>Описание</h2>
            <p className="overview-text">{movie.overview || "Описание отсутствует"}</p>
          </section>

          {/* Информация о съемочной группе */}
          {director && (
            <section className="movie-director">
              <h2>Режиссер</h2>
              <div className="director-info">
                <span className="director-name">{director.name}</span>
              </div>
            </section>
          )}

          {/* Актерский состав */}
          {mainCast.length > 0 && !isCreditsLoading && (
            <section className="movie-cast">
              <h2>В главных ролях</h2>
              <div className="cast-grid">
                {mainCast.map((actor) => (
                  <div key={actor.id} className="cast-member">
                    <div className="cast-photo">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="cast-image"
                        />
                      ) : (
                        <div className="cast-placeholder">
                          <span>Нет фото</span>
                        </div>
                      )}
                    </div>
                    <div className="cast-info">
                      <h3 className="cast-name">{actor.name}</h3>
                      <p className="cast-character">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
              {credits && credits.cast.length > 8}
            </section>
          )}

          {/* Детальная информация */}
          <section className="movie-details">
            <h2>Детальная информация</h2>
            <div className="details-grid">
              {movie.status && (
                <div className="detail-item">
                  <span className="detail-label">Статус:</span>
                  <span className="detail-value">{movie.status}</span>
                </div>
              )}

              {movie.budget > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Бюджет:</span>
                  <span className="detail-value">${movie.budget.toLocaleString()}</span>
                </div>
              )}

              {movie.revenue > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Сборы:</span>
                  <span className="detail-value">${movie.revenue.toLocaleString()}</span>
                </div>
              )}

              {movie.original_language && (
                <div className="detail-item">
                  <span className="detail-label">Язык оригинала:</span>
                  <span className="detail-value">{movie.original_language.toUpperCase()}</span>
                </div>
              )}

              {movie.production_countries && movie.production_countries.length > 0 && (
                <div className="detail-item">
                  <span className="detail-label">Страна:</span>
                  <span className="detail-value">{movie.production_countries.map((c) => c.name).join(", ")}</span>
                </div>
              )}
            </div>
          </section>

          {/* Рекомендации */}
          {recommendations && recommendations.results.length > 0 && (
            <section className="movie-recommendations">
              <h2>Рекомендации</h2>
              <div className="recommendations-grid">
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
            </section>
          )}
        </div>

        {/* Сайдбар с дополнительной информацией */}
        <div className="movie-sidebar">
          {movie.homepage && (
            <div className="sidebar-section">
              <h3>Официальный сайт</h3>
              <a href={movie.homepage} target="_blank" rel="noopener noreferrer" className="homepage-link">
                Перейти на сайт
              </a>
            </div>
          )}

          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="sidebar-section">
              <h3>Производство</h3>
              <div className="production-companies">
                {movie.production_companies.map((company) => (
                  <div key={company.id} className="company">
                    {company.logo_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                        alt={company.name}
                        className="company-logo"
                        title={company.name}
                      />
                    ) : (
                      <span className="company-name">{company.name}</span>
                    )}
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
