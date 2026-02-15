import { useSelector } from "react-redux"
import type { RootState } from "../store"

const excludedEndpoints: string[] = ["getPopularMovies"]

export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {
    const queries = Object.values(state.tmdbApi?.queries || {})
    const mutations = Object.values(state.tmdbApi?.mutations || {})

    const hasActiveQueries = queries.some((query) => {
      return query?.status === "pending" && !excludedEndpoints.includes(query?.endpointName || "")
    })

    const hasActiveMutations = mutations.some(
      (mutation) => mutation?.status === "pending" && !excludedEndpoints.includes(mutation?.endpointName || ""),
    )

    return hasActiveQueries || hasActiveMutations
  })
}
