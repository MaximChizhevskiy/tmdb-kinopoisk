import { useSelector } from "react-redux"
import type { RootState } from "../store"

// Список эндпоинтов, которые не должны запускать глобальный лоадер
const excludedEndpoints: string[] = [
  // Можно добавить эндпоинты, которые должны быть исключены
  // Например, если какой-то запрос обновляется слишком часто
  // 'getPopularMovies',
]

export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {
    const queries = Object.values(state.tmdbApi?.queries || {})
    const mutations = Object.values(state.tmdbApi?.mutations || {})

    const hasActiveQueries = queries.some((query) => {
      // Проверяем, что запрос в статусе 'pending' и не исключен
      return query?.status === "pending" && !excludedEndpoints.includes(query?.endpointName || "")
    })

    const hasActiveMutations = mutations.some(
      (mutation) => mutation?.status === "pending" && !excludedEndpoints.includes(mutation?.endpointName || ""),
    )

    return hasActiveQueries || hasActiveMutations
  })
}
