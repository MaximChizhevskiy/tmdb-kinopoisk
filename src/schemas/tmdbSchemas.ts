import { z } from "zod"

export const baseMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
  vote_average: z.number(),
})

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

export const favoriteMovieSchema = baseMovieSchema.extend({
  addedAt: z.number(),
})

export const moviesResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

export const genreSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const genresResponseSchema = z.object({
  genres: z.array(genreSchema),
})

export const movieDetailsSchema = baseMovieSchema.extend({
  overview: z.string(),
  backdrop_path: z.string().nullable(),
  vote_count: z.number(),
  popularity: z.number(),
  adult: z.boolean(),
  original_language: z.string(),
  original_title: z.string(),
  video: z.boolean(),
  genres: z.array(genreSchema).default([]),
  budget: z.number().default(0),
  homepage: z.string().nullable().default(null),
  imdb_id: z.string().nullable().default(null),
  production_companies: z
    .array(
      z.object({
        id: z.number(),
        logo_path: z.string().nullable(),
        name: z.string(),
        origin_country: z.string(),
      }),
    )
    .default([]),
  production_countries: z
    .array(
      z.object({
        iso_3166_1: z.string(),
        name: z.string(),
      }),
    )
    .default([]),
  revenue: z.number().default(0),
  runtime: z.number().nullable().default(null),
  spoken_languages: z
    .array(
      z.object({
        english_name: z.string(),
        iso_639_1: z.string(),
        name: z.string(),
      }),
    )
    .default([]),
  status: z.string().default(""),
  tagline: z.string().default(""),
  belongs_to_collection: z.any().optional(),
})

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

export const recommendationsResponseSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

export type MoviesResponse = z.infer<typeof moviesResponseSchema>
export type MovieCredits = z.infer<typeof movieCreditsSchema>
export type MovieVideos = z.infer<typeof movieVideosSchema>
export type RecommendationsResponse = z.infer<typeof recommendationsResponseSchema>
export type GenresResponse = z.infer<typeof genresResponseSchema>
export type FavoriteMovie = z.infer<typeof favoriteMovieSchema>
export type BaseMovie = z.infer<typeof baseMovieSchema>
export type Movie = z.infer<typeof movieSchema>
export type MovieDetails = z.infer<typeof movieDetailsSchema>
export type Genre = z.infer<typeof genreSchema>
