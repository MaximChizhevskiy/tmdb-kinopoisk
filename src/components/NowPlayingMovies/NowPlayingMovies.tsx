import { useGetNowPlayingMoviesQuery } from "../../api"
import { MoviesCategory } from "../MoviesCategory/MoviesCategory.tsx"

export const NowPlayingMovies = () => {
  const { data, isLoading, isError } = useGetNowPlayingMoviesQuery(1)

  return (
    <MoviesCategory
      title="Now Playing Movies"
      category="now_playing"
      movies={data?.results || []}
      isLoading={isLoading}
      isError={isError}
      viewMoreLink="/movies?category=now_playing"
    />
  )
}
