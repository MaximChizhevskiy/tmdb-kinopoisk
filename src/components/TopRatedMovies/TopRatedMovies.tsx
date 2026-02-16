import { useGetTopRatedMoviesQuery } from "../../api"
import { MoviesCategory } from "../MoviesCategory/MoviesCategory.tsx"

export const TopRatedMovies = () => {
  const { data, isLoading, isError } = useGetTopRatedMoviesQuery(1)

  return (
    <MoviesCategory
      title="Топ рейтинга"
      category="top_rated"
      movies={data?.results || []}
      isLoading={isLoading}
      isError={isError}
      viewMoreLink="/movies?category=top_rated"
    />
  )
}
