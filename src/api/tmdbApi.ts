import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { toast } from "react-toastify"
import { z } from "zod"
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query"
import {
  type GenresResponse,
  genresResponseSchema,
  type MovieCredits,
  movieCreditsSchema,
  type MovieDetails,
  movieDetailsSchema,
  type MoviesResponse,
  moviesResponseSchema,
  type MovieVideos,
  movieVideosSchema,
  type RecommendationsResponse,
  recommendationsResponseSchema,
} from "../schemas/tmdbSchemas"
import type { DiscoverMoviesParams } from "../types"

export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

interface TMDBErrorData {
  status_message?: string
  status_code?: number
  success?: boolean
}

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    headers.set("Authorization", `Bearer ${TMDB_API_KEY}`)
    headers.set("accept", "application/json")
    return headers
  },
})

function validateWithZod<T>(schema: z.ZodSchema<T>, data: unknown, endpoint: string): T {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error && typeof error === "object" && "errors" in error) {
      const zodError = error as { errors: z.core.$ZodIssue[] }

      console.group("🔴 Zod Validation Error")
      console.error("Endpoint:", endpoint)
      console.error("Errors:", zodError.errors)

      function isZodIssueWithReceived(issue: z.core.$ZodIssue): issue is z.core.$ZodIssue & { received: unknown } {
        return "received" in issue
      }

      function isZodIssueWithExpected(issue: z.core.$ZodIssue): issue is z.core.$ZodIssue & { expected: unknown } {
        return "expected" in issue
      }

      zodError.errors.forEach((issue, index) => {
        const path = issue.path.join(".") || "root"
        let receivedInfo = ""

        if (isZodIssueWithReceived(issue)) {
          receivedInfo = ` (received: ${JSON.stringify(issue.received)})`
        } else if (isZodIssueWithExpected(issue)) {
          receivedInfo = ` (expected: ${JSON.stringify(issue.expected)})`
        }

        console.error(`  ${index + 1}. ${path}: ${issue.message}${receivedInfo}`)
      })

      console.error("Received data:", data)
      console.groupEnd()
    }

    throw error
  }
}

const baseQueryWithValidation: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await baseQuery(args, api, extraOptions)

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
    getPopularMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/popular?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "getPopularMovies"),
    }),

    searchMovies: builder.query<MoviesResponse, { query: string; page?: number; language?: string }>({
      query: ({ query, page = 1, language = "ru-RU" }) => ({
        url: "/search/movie",
        params: { query, page, language },
      }),
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "searchMovies"),
    }),

    getTopRatedMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/top_rated?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "getTopRatedMovies"),
    }),

    getUpcomingMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/upcoming?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "getUpcomingMovies"),
    }),

    getNowPlayingMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/now_playing?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "getNowPlayingMovies"),
    }),

    getMovieDetails: builder.query<MovieDetails, { movieId: number; language?: string }>({
      query: ({ movieId, language = "ru-RU" }) => `/movie/${movieId}?language=${language}`,
      transformResponse: (response: unknown) => validateWithZod(movieDetailsSchema, response, "getMovieDetails"),
    }),

    getMovieCredits: builder.query<MovieCredits, number>({
      query: (movieId) => `/movie/${movieId}/credits?language=ru-RU`,
      transformResponse: (response: unknown) => validateWithZod(movieCreditsSchema, response, "getMovieCredits"),
    }),

    getMovieVideos: builder.query<MovieVideos, number>({
      query: (movieId) => `/movie/${movieId}/videos?language=ru-RU`,
      transformResponse: (response: unknown) => validateWithZod(movieVideosSchema, response, "getMovieVideos"),
    }),

    getMovieRecommendations: builder.query<RecommendationsResponse, { movieId: number; page?: number }>({
      query: ({ movieId, page = 1 }) => `/movie/${movieId}/recommendations?language=ru-RU&page=${page}`,
      transformResponse: (response: unknown) =>
        validateWithZod(recommendationsResponseSchema, response, "getMovieRecommendations"),
    }),

    getGenres: builder.query<GenresResponse, string>({
      query: (language = "ru-RU") => `/genre/movie/list?language=${language}`,
      transformResponse: (response: unknown) => validateWithZod(genresResponseSchema, response, "getGenres"),
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
      transformResponse: (response: unknown) => validateWithZod(moviesResponseSchema, response, "discoverMovies"),
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
