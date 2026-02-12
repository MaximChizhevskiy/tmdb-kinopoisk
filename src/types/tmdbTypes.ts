import type { ReactNode } from "react"

export type MoviesResponse = {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export type SearchMoviesParams = {
  query: string
  page?: number
  language?: string
}

export type SearchBarProps = {
  initialQuery?: string
  onSearch?: (query: string) => void
  align?: "left" | "center" | "right"
}

export type PaginationProps = {
  currentPage: number
  totalPages: number
  totalItems?: number
  onPageChange: (page: number) => void
  showItemsCount?: boolean
}

export type MoviesCategoryProps = {
  title: string
  category: "popular" | "top_rated" | "upcoming" | "now_playing"
  movies: MoviesResponse["results"]
  isLoading: boolean
  isError: boolean
  viewMoreLink: string
}

export type ThemeContextType = {
  isDarkMode: boolean
  toggleTheme: () => void
}

export type ThemeProviderProps = {
  children: ReactNode
}

export type MovieDetails = Movie & {
  budget: number
  genres: {
    id: number
    name: string
  }[]
  homepage: string
  imdb_id: string
  production_companies: {
    id: number
    logo_path: string | null
    name: string
    origin_country: string
  }[]
  production_countries: {
    iso_3166_1: string
    name: string
  }[]
  revenue: number
  runtime: number
  spoken_languages: {
    english_name: string
    iso_639_1: string
    name: string
  }[]
  status: string
  tagline: string
}

export type MovieCredits = {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

export type CastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export type CrewMember = {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export type MovieVideos = {
  id: number
  results: Video[]
}

export type Video = {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

export type RecommendationsResponse = {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

// Добавляем новые типы для фильтров
export type SortOption = {
  value: string
  label: string
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "popularity.desc", label: "По популярности (убыв.)" },
  { value: "popularity.asc", label: "По популярности (возр.)" },
  { value: "vote_average.desc", label: "По рейтингу (убыв.)" },
  { value: "vote_average.asc", label: "По рейтингу (возр.)" },
  { value: "release_date.desc", label: "По дате выхода (новые)" },
  { value: "release_date.asc", label: "По дате выхода (старые)" },
  { value: "title.asc", label: "По названию (А-Я)" },
  { value: "title.desc", label: "По названию (Я-А)" },
  { value: "revenue.desc", label: "По сборам (убыв.)" },
  { value: "revenue.asc", label: "По сборам (возр.)" },
]

export type Genre = {
  id: number
  name: string
}

export type DiscoverMoviesParams = {
  page?: number
  language?: string
  sort_by?: string
  with_genres?: string
  "vote_average.gte"?: number
  "vote_average.lte"?: number
  "release_date.gte"?: string
  "release_date.lte"?: string
  with_runtime_gte?: number
  with_runtime_lte?: number
  include_adult?: boolean
  include_video?: boolean
  with_original_language?: string
  year?: number
  primary_release_year?: number
}

// Создаем базовый интерфейс с минимально необходимыми полями
export interface BaseMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
}

// Полный Movie расширяет BaseMovie
export type Movie = BaseMovie & {
  overview: string
  backdrop_path: string | null
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  original_title: string
  genre_ids: number[]
  video: boolean
}

// FavoriteMovie расширяет BaseMovie + добавляет поле addedAt
export type FavoriteMovie = BaseMovie & {
  addedAt: number
}

// Обновляем MovieCardProps
export type MovieCardProps = {
  movie: BaseMovie // Теперь принимает любой объект с базовыми полями
  showRating?: boolean
}
