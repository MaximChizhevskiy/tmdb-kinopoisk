import { useState, type ChangeEvent } from "react"
import { useNavigate } from "react-router-dom"
import "./SearchBar.css"
import type { SearchBarProps } from "../../types"

export const SearchBar = ({ initialQuery = "", onSearch, align = "left" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const navigate = useNavigate()

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

  const isDisabled = !searchQuery.trim()

  return (
    <form className={`search-bar search-bar-${align}`} onSubmit={handleSubmit} role="search">
      <input
        type="search"
        className="search-bar-input"
        placeholder="Поиск фильмов..."
        value={searchQuery}
        onChange={handleInputChange}
        aria-label="Поиск фильмов"
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
      />
      <button type="submit" className="search-bar-button" disabled={isDisabled} aria-disabled={isDisabled}>
        Search
      </button>
    </form>
  )
}
