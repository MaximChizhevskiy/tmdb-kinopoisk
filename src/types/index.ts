// РЕЭКСПОРТ ИЗ СХЕМ (API типы)
export type {
  Movie,
  MoviesResponse,
  MovieDetails,
  MovieCredits,
  MovieVideos,
  RecommendationsResponse,
  Genre,
  GenresResponse,
  FavoriteMovie,
  BaseMovie,
} from "../schemas/tmdbSchemas"

// РЕЭКСПОРТ ИЗ tmdbTypes (типы компонентов)
export type {
  // Props
  SearchBarProps,
  PaginationProps,
  MovieCardProps,
  MoviesCategoryProps,

  // Theme
  ThemeContextType,
  ThemeProviderProps,

  // Filters
  SortOption,
  DiscoverMoviesParams,

  // API params
  SearchMoviesParams,
} from "./tmdbTypes"

// Константы тоже можно реэкспортировать
export { SORT_OPTIONS } from "./tmdbTypes"
