import type { ReactNode } from "react"
import type { BaseMovie, Movie } from "../schemas/tmdbSchemas.ts"

// ======================================
// ТИПЫ ДЛЯ КОМПОНЕНТОВ
// ======================================

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
  movie: BaseMovie // BaseMovie из схем
  showRating?: boolean
}

export type MoviesCategoryProps = {
  title: string
  category: "popular" | "top_rated" | "upcoming" | "now_playing"
  movies: Movie[] // Movie из схем
  isLoading: boolean
  isError: boolean
  viewMoreLink: string
}

// ======================================
// ТИПЫ ДЛЯ ТЕМЫ
// ======================================

export type ThemeContextType = {
  isDarkMode: boolean
  toggleTheme: () => void
}

export type ThemeProviderProps = {
  children: ReactNode
}

// ======================================
// ТИПЫ ДЛЯ ФИЛЬТРОВ
// ======================================

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

export type DiscoverMoviesParams = {
  page?: number
  sort_by?: string
  with_genres?: string
  "vote_average.gte"?: number
  "vote_average.lte"?: number
  "release_date.gte"?: string
  "release_date.lte"?: string
  with_runtime_gte?: number
  with_runtime_lte?: number
  include_adult?: boolean
  language?: string
}

// ======================================
// ТИПЫ ДЛЯ API (только те, что не в схемах)
// ======================================

export type SearchMoviesParams = {
  query: string
  page?: number
  language?: string
}
