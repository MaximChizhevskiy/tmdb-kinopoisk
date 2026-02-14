import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { toast } from "react-toastify"
import { z } from "zod"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type {
  DiscoverMoviesParams,
  GenresResponse,
  MovieCredits,
  MovieDetails,
  MoviesResponse,
  MovieVideos,
  RecommendationsResponse,
} from "../types"

// Импортируем схемы
import {
  genresResponseSchema,
  movieCreditsSchema,
  movieDetailsSchema,
  moviesResponseSchema,
  movieVideosSchema,
  recommendationsResponseSchema,
} from "../schemas/tmdbSchemas"

export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

// Тип для ошибки TMDB
interface TMDBErrorData {
  status_message?: string
  status_code?: number
  success?: boolean
}

// Базовый query
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Authorization", `Bearer ${TMDB_API_KEY}`)
    headers.set("accept", "application/json")
    return headers
  },
})

// Функция для валидации с ошибкой

function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown, endpoint: string): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error && typeof error === "object" && "errors" in error) {
      const zodError = error as { errors: z.core.$ZodIssue[] }

      console.group("🔴 Zod Validation Error")
      console.error("Endpoint:", endpoint)
      console.error("Errors:", zodError.errors)

      // Детальный вывод проблемных полей
      zodError.errors.forEach((issue, index) => {
        const path = issue.path.join(".") || "root"

        // Формируем сообщение в зависимости от типа ошибки
        let receivedValue = "unknown"

        // Проверяем наличие поля received в объекте ошибки
        if ("received" in issue) {
          // @ts-ignore - временно игнорируем, так как поле есть в рантайме
          receivedValue = issue.received
        } else if ("expected" in issue) {
          receivedValue = "invalid value"
        }

        console.error(`  ${index + 1}. ${path}: ${issue.message} (received: ${JSON.stringify(receivedValue)})`)
      })

      console.error("Received data:", data)
      console.groupEnd()
    }

    throw error
  }
}

// Обертка для обработки ошибок и валидации
const baseQueryWithValidation: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions)

  // Обработка ошибок
  if (result.error) {
    const error = result.error

    console.group("❌ API Error")
    console.error("Endpoint:", typeof args === "string" ? args : args.url)
    console.error("Error:", error)
    console.groupEnd()

    let errorMessage = "Произошла неизвестная ошибка"

    if (typeof error.status === "string") {
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
      }
    } else {
      const status = error.status
      const data = error.data as TMDBErrorData | undefined

      if (data?.status_message) {
        errorMessage = data.status_message
      } else {
        switch (status) {
          case 401:
            errorMessage = "🔑 Недействительный ключ API. Проверьте AUTH_TOKEN."
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
            }
        }
      }
    }

    toast.error(errorMessage, {
      position: "top-right",
      autoClose: 5000,
      theme: "colored",
    })
  }

  return result
}

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: baseQueryWithValidation,
  endpoints: (builder) => ({
    // Popular Movies с валидацией
    getPopularMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/popular?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "getPopularMovies"),
    }),

    // Search Movies с валидацией
    searchMovies: builder.query<MoviesResponse, { query: string; page?: number; language?: string }>({
      query: ({ query, page = 1, language = "ru-RU" }) => ({
        url: "/search/movie",
        params: { query, page, language },
      }),
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "searchMovies"),
    }),

    // Top Rated с валидацией
    getTopRatedMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/top_rated?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "getTopRatedMovies"),
    }),

    // Upcoming с валидацией
    getUpcomingMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/upcoming?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "getUpcomingMovies"),
    }),

    // Now Playing с валидацией
    getNowPlayingMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/now_playing?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "getNowPlayingMovies"),
    }),

    // Movie Details с валидацией
    getMovieDetails: builder.query<MovieDetails, { movieId: number; language?: string }>({
      query: ({ movieId, language = "ru-RU" }) => `/movie/${movieId}?language=${language}`,
      transformResponse: (response: unknown) => validateWithZod(movieDetailsSchema, response, "getMovieDetails"),
    }),

    // Movie Credits с валидацией
    getMovieCredits: builder.query<MovieCredits, number>({
      query: (movieId) => `/movie/${movieId}/credits?language=ru-RU`,
      transformResponse: (response: unknown) => validateWithZod(movieCreditsSchema, response, "getMovieCredits"),
    }),

    // Movie Videos с валидацией
    getMovieVideos: builder.query<MovieVideos, number>({
      query: (movieId) => `/movie/${movieId}/videos?language=ru-RU`,
      transformResponse: (response: unknown) => validateWithZod(movieVideosSchema, response, "getMovieVideos"),
    }),

    // Recommendations с валидацией
    getMovieRecommendations: builder.query<RecommendationsResponse, { movieId: number; page?: number }>({
      query: ({ movieId, page = 1 }) => `/movie/${movieId}/recommendations?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) =>
        validateWithZod(recommendationsResponseSchema, response, "getMovieRecommendations"),
    }),

    // Genres с валидацией
    getGenres: builder.query<GenresResponse, string>({
      query: (language = "ru-RU") => `/genre/movie/list?language=${language}`,
      transformResponse: (response: unknown) => validateWithZod(genresResponseSchema, response, "getGenres"),
    }),

    // Discover Movies с валидацией
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
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "discoverMovies"),
    }),
  }),
})

// Экспорты хуков
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
