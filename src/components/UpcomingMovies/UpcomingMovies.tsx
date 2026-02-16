import { useGetUpcomingMoviesQuery } from "../../api"
import { MoviesCategory } from "../MoviesCategory/MoviesCategory.tsx"

export const UpcomingMovies = () => {
  const { data, isLoading, isError } = useGetUpcomingMoviesQuery(1)

  return (
    <MoviesCategory
      title="Ожидаемые фильмы"
      category="upcoming"
      movies={data?.results || []}
      isLoading={isLoading}
      isError={isError}
      viewMoreLink="/movies?category=upcoming"
    />
  )
}
