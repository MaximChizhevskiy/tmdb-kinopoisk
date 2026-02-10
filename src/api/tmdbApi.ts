import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { MoviesResponse, SearchMoviesParams } from "../types"
import type { MovieCredits, MovieDetails, MovieVideos, RecommendationsResponse } from "../types/tmdbTypes.ts"

export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"

export const tmdbApi = createApi({
  reducerPath: "tmdbApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${TMDB_API_KEY}`)
      headers.set("accept", "application/json")
      return headers
    },
  }),
  endpoints: (builder) => ({
    getPopularMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/popular?language=ru-RU&page=${page}`,
    }),
    searchMovies: builder.query<MoviesResponse, SearchMoviesParams>({
      query: ({ query, page = 1, language = "ru-RU" }) => ({
        url: "/search/movie",
        params: {
          query,
          page,
          language,
        },
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
  }),
})

export const {
  useGetPopularMoviesQuery,
  useSearchMoviesQuery,
  useLazySearchMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useGetMovieDetailsQuery,
  useGetMovieCreditsQuery,
  useGetMovieVideosQuery,
  useGetMovieRecommendationsQuery,
} = tmdbApi
