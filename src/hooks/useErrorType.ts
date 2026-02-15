import { useMemo } from "react"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { SerializedError } from "@reduxjs/toolkit"

export type ErrorType = "network" | "auth" | "notFound" | "server" | "rateLimit" | "validation" | "unknown" | null

interface TMDBErrorResponse {
  status_code?: number
  status_message?: string
  success?: boolean
}

export const useErrorType = (error: FetchBaseQueryError | SerializedError | undefined): ErrorType => {
  return useMemo(() => {
    if (!error) return null

    if (!("status" in error)) {
      return "unknown"
    }

    const status = error.status

    if (typeof status === "string") {
      switch (status) {
        case "FETCH_ERROR":
          return "network"
        case "TIMEOUT_ERROR":
          return "network"
        case "PARSING_ERROR":
          return "unknown"
        default:
          return "unknown"
      }
    }

    const data = error.data as TMDBErrorResponse | undefined
    if (data?.status_code) {
      switch (data.status_code) {
        case 7: // Invalid API key
        case 3: // Authentication failed
          return "auth"
        case 34: // The resource you requested could not be found
          return "notFound"
        case 6: // Invalid parameters
          return "validation"
        case 25: // Delete failed
        case 26: // Too many actions
          return "server"
        case 24: // Duplicate entry
          return "validation"
      }
    }
    if (status === 401 || status === 403) {
      return "auth"
    }
    if (status === 404) {
      return "notFound"
    }
    if (status === 429) {
      return "rateLimit"
    }
    if (status >= 500) {
      return "server"
    }
    if (status === 400 || status === 422) {
      return "validation"
    }

    return "unknown"
  }, [error])
}
