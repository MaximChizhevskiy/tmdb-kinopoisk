import { useState, type ChangeEvent, useRef } from "react"
import { useNavigate } from "react-router-dom"
import styles from "./SearchBar.module.css"
import type { SearchBarProps } from "../../types"

export const SearchBar = ({ initialQuery = "", onSearch, align = "left" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [, setIsFocused] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const trimmedQuery = searchQuery.trim()

    if (trimmedQuery) {
      if (onSearch) {
        onSearch(trimmedQuery)
      } else {
        navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`)
      }
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleClear = () => {
    setSearchQuery("")
    inputRef.current?.focus()

    if (onSearch) {
      onSearch("")
    }
  }

  const isDisabled = !searchQuery.trim()
  const showClearButton = searchQuery.length > 0

  // Определяем класс выравнивания
  const alignClass =
    align === "left" ? styles.searchBarLeft : align === "center" ? styles.searchBarCenter : styles.searchBarRight

  return (
    <form className={`${styles.searchBar} ${alignClass}`} onSubmit={handleSubmit} role="search">
      <div className={styles.searchInputWrapper}>
        <input
          ref={inputRef}
          type="search"
          className={styles.searchBarInput}
          placeholder="Поиск фильмов..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Поиск фильмов"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {showClearButton && (
          <button
            type="button"
            className={styles.searchClearButton}
            onClick={handleClear}
            aria-label="Очистить поиск"
            title="Очистить"
          >
            ✕
          </button>
        )}
      </div>

      <button type="submit" className={styles.searchBarButton} disabled={isDisabled} aria-disabled={isDisabled}>
        Search
      </button>
    </form>
  )
}
