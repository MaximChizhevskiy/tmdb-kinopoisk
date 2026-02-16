import { useGetPopularMoviesQuery } from "../../api"
import { MoviesCategory } from "../MoviesCategory/MoviesCategory.tsx"

export const PopularMovies = () => {
  const { data, isLoading, isError } = useGetPopularMoviesQuery(1)

  return (
    <MoviesCategory
      title="Популярные фильмы"
      category="popular"
      movies={data?.results || []}
      isLoading={isLoading}
      isError={isError}
      viewMoreLink="/movies?category=popular"
    />
  )
}
