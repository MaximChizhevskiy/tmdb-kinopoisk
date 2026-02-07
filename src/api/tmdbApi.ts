import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { MoviesResponse, SearchMoviesParams } from "../types/tmdb"

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
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
    // Популярные фильмы (для рандомного бэкдропа)
    getPopularMovies: builder.query<MoviesResponse, number>({
      query: (page = 1) => `/movie/popular?language=ru-RU&page=${page}`,
    }),

    // Поиск фильмов
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
  }),
})

export const { useGetPopularMoviesQuery, useSearchMoviesQuery, useLazySearchMoviesQuery } = tmdbApi
