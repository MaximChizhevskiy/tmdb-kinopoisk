import { z } from "zod"

// Базовая схема для фильма (минимальные поля)
export const baseMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
})

// Полная схема фильма
export const movieSchema = baseMovieSchema.extend({
  overview: z.string(),
  backdrop_path: z.string().nullable(),
  vote_count: z.number(),
  popularity: z.number(),
  adult: z.boolean(),
  original_language: z.string(),
  original_title: z.string(),
  genre_ids: z.array(z.number()),
  video: z.boolean(),
})

// Схема для избранного фильма
export const favoriteMovieSchema = baseMovieSchema.extend({
  addedAt: z.number(),
})

// ... остальные схемы

// Базовая схема для фильма
// Схема для ответа со списком фильмов
export const moviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

// Схема для жанров
export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const genresResponseSchema = z.object({
  genres: z.array(genreSchema),
})

// Схема для детальной информации о фильме
export const movieDetailsSchema = movieSchema.extend({
  budget: z.number(),
  genres: z.array(genreSchema),
  homepage: z.string().nullable(),
  imdb_id: z.string().nullable(),
  production_companies: z.array(
    z.object({
      id: z.number(),
      logo_path: z.string().nullable(),
      name: z.string(),
      origin_country: z.string(),
    }),
  ),
  production_countries: z.array(
    z.object({
      iso_3166_1: z.string(),
      name: z.string(),
    }),
  ),
  revenue: z.number(),
  runtime: z.number(),
  spoken_languages: z.array(
    z.object({
      english_name: z.string(),
      iso_639_1: z.string(),
      name: z.string(),
    }),
  ),
  status: z.string(),
  tagline: z.string(),
})

// Схема для актера
export const castMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
})

export const crewMemberSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
})

export const movieCreditsSchema = z.object({
  id: z.number(),
  cast: z.array(castMemberSchema),
  crew: z.array(crewMemberSchema),
})

// Схема для видео
export const videoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
})

export const movieVideosSchema = z.object({
  id: z.number(),
  results: z.array(videoSchema),
})

// Схема для рекомендаций
export const recommendationsResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

// Типы, экспортируемые из схем

export type MoviesResponse = z.infer<typeof moviesResponseSchema>
export type MovieDetails = z.infer<typeof movieDetailsSchema>
export type MovieCredits = z.infer<typeof movieCreditsSchema>
export type MovieVideos = z.infer<typeof movieVideosSchema>
export type RecommendationsResponse = z.infer<typeof recommendationsResponseSchema>
export type Genre = z.infer<typeof genreSchema>
export type GenresResponse = z.infer<typeof genresResponseSchema>
// Типы
export type BaseMovie = z.infer<typeof baseMovieSchema>
export type Movie = z.infer<typeof movieSchema>
export type FavoriteMovie = z.infer<typeof favoriteMovieSchema>
