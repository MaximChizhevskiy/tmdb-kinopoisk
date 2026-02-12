import { useState, type ChangeEvent, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./SearchBar.css"
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
    // Возвращаем фокус на инпут после очистки
    inputRef.current?.focus()

    // Опционально: очищаем результаты поиска
    if (onSearch) {
      onSearch("")
    }
  }

  const isDisabled = !searchQuery.trim()
  const showClearButton = searchQuery.length > 0

  return (
    <form className={`search-bar search-bar-${align}`} onSubmit={handleSubmit} role="search">
      <div className="search-input-wrapper">
        <input
          ref={inputRef}
          type="search"
          className="search-bar-input"
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
            className="search-clear-button"
            onClick={handleClear}
            aria-label="Очистить поиск"
            title="Очистить"
          >
            ✕
          </button>
        )}
      </div>

      <button type="submit" className="search-bar-button" disabled={isDisabled} aria-disabled={isDisabled}>
        Search
      </button>
    </form>
  )
}
