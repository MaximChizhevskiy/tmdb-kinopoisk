import type { ReactNode } from "react"

export type Movie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  original_title: string
  genre_ids: number[]
  video: boolean
}

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

export type MovieCardProps = {
  movie: Movie
  showRating?: boolean
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
