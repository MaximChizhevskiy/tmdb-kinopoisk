import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { toast } from "react-toastify"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { MoviesResponse, SearchMoviesParams } from "../types"
import type {
  DiscoverMoviesParams,
  MovieCredits,
  MovieDetails,
  MovieVideos,
  RecommendationsResponse,
  GenreResponse,
} from "../types/tmdbTypes"

export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

// Тип для ошибки TMDB
interface TMDBErrorData {
  status_message?: string
  status_code?: number
  success?: boolean
}

// Создаем типизированный baseQuery
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Authorization", `Bearer ${TMDB_API_KEY}`)
    headers.set("accept", "application/json")
    return headers
  },
})

// Типизированная обертка для обработки ошибок
const baseQueryWithErrorHandling: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error) {
    const error = result.error

    // Логируем ошибку
    console.group("❌ API Error")
    console.error("Endpoint:", typeof args === "string" ? args : args.url)
    console.error("Error:", error)
    console.groupEnd()

    let errorMessage = "Произошла неизвестная ошибка"

    // Обработка разных типов ошибок
    if (typeof error.status === "string") {
      // Строковые статусы (FETCH_ERROR, TIMEOUT_ERROR, PARSING_ERROR)
      switch (error.status) {
        case "FETCH_ERROR":
          errorMessage = "🌐 Ошибка сети. Проверьте подключение к интернету."
          break
        case "TIMEOUT_ERROR":
          errorMessage = "⏱️ Превышено время ожидания. Попробуйте позже."
          break
        case "PARSING_ERROR":
          errorMessage = "📦 Ошибка при обработке данных от сервера."
          break
        default:
          errorMessage = `❌ Ошибка: ${error.error || "неизвестная"}`
      }
    } else {
      // Числовые HTTP статусы
      const status = error.status
      const data = error.data as TMDBErrorData | undefined

      // Если есть сообщение от TMDB
      if (data?.status_message) {
        errorMessage = data.status_message
      } else {
        // Стандартные HTTP ошибки
        switch (status) {
          case 401:
            errorMessage = "🔑 Недействительный ключ API. Проверьте AUTH_TOKEN."
            break
          case 403:
            errorMessage = "🚫 Доступ запрещен."
            break
          case 404:
            errorMessage = "🔍 Запрашиваемый ресурс не найден (404)."
            break
          case 429:
            errorMessage = "⏳ Слишком много запросов. Попробуйте позже."
            break
          default:
            if (status >= 500) {
              errorMessage = `🔧 Серверная ошибка (${status})`
            } else {
              errorMessage = `❌ Ошибка ${status}`
            }
        }
      }
    }

    // Показываем тост
    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    })
  }

  return result
}

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    getPopularMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/popular?language=ru-RU&page=${page}`,
    }),

    searchMovies: builder.query<MoviesResponse, SearchMoviesParams>({
      query: ({ query, page = 1, language = "ru-RU" }) => ({
        url: "/search/movie",
        params: { query, page, language },
      }),
    }),

    getTopRatedMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/top_rated?language=ru-RU&page=${page}`,
    }),

    getUpcomingMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/upcoming?language=ru-RU&page=${page}`,
    }),

    getNowPlayingMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/now_playing?language=ru-RU&page=${page}`,
    }),

    getMovieDetails: builder.query<MovieDetails, { movieId: number; language?: string }>({
      query: ({ movieId, language = "ru-RU" }) => `/movie/${movieId}?language=${language}`,
    }),

    getMovieCredits: builder.query<MovieCredits, number>({
      query: (movieId) => `/movie/${movieId}/credits?language=ru-RU`,
    }),

    getMovieVideos: builder.query<MovieVideos, number>({
      query: (movieId) => `/movie/${movieId}/videos?language=ru-RU`,
    }),

    getMovieRecommendations: builder.query<RecommendationsResponse, { movieId: number; page?: number }>({
      query: ({ movieId, page = 1 }) => `/movie/${movieId}/recommendations?language=ru-RU&page=${page}`,
    }),

    getGenres: builder.query<GenreResponse, string>({
      query: (language = "ru-RU") => `/genre/movie/list?language=${language}`,
    }),

    discoverMovies: builder.query<MoviesResponse, DiscoverMoviesParams>({
      query: (params) => ({
        url: "/discover/movie",
        params: {
          language: "ru-RU",
          include_adult: false,
          include_video: false,
          page: params.page || 1,
          sort_by: params.sort_by || "popularity.desc",
          ...params,
        },
      }),
    }),
  }),
})

export const {
  useGetPopularMoviesQuery,
  useSearchMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieCreditsQuery,
  useGetMovieVideosQuery,
  useGetMovieRecommendationsQuery,
  useGetGenresQuery,
  useDiscoverMoviesQuery,
  useLazySearchMoviesQuery,
} = tmdbApi
