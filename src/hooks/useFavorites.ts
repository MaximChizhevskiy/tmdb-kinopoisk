import { useState, useEffect } from "react"
import type { BaseMovie, FavoriteMovie } from "../types/tmdbTypes.ts"

const FAVORITES_STORAGE_KEY = "favorites"

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading favorites:", error)
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (movie: BaseMovie) => {
    setFavorites((prev) => {
      if (prev.some((fav) => fav.id === movie.id)) {
        return prev
      }

      const favoriteMovie: FavoriteMovie = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date,
        addedAt: Date.now(),
      }

      return [...prev, favoriteMovie]
    })
  }

  const removeFavorite = (movieId: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId))
  }

  const toggleFavorite = (movie: BaseMovie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id)
      if (exists) {
        return prev.filter((fav) => fav.id !== movie.id)
      } else {
        const favoriteMovie: FavoriteMovie = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          addedAt: Date.now(),
        }
        return [...prev, favoriteMovie]
      }
    })
  }

  const isFavorite = (movieId: number) => {
    return favorites.some((fav) => fav.id === movieId)
  }

  const clearAllFavorites = () => {
    setFavorites([])
  }

  const getFavoritesCount = () => favorites.length

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearAllFavorites,
    getFavoritesCount,
  }
}
