"use client"
import { useState, useCallback } from "react"
import { ActionIcon } from "@mantine/core"
import { IconSearch, IconX } from "@tabler/icons-react"
import "./search-bar.scss"

export function SearchBar({
  placeholder = "Search...",
  onSearch,
  onClear,
  className = "",
  size = "md", // sm | md | lg
  variant = "default", // default | filled | outlined
  disabled = false,
  autoFocus = false,
}) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = useCallback(
    (e) => {
      const value = e.currentTarget.value
      setQuery(value)
      onSearch?.(value)
    },
    [onSearch]
  )

  const handleClear = useCallback(() => {
    setQuery("")
    onClear?.()
  }, [onClear])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") onSearch?.(query)
      if (e.key === "Escape") handleClear()
    },
    [query, onSearch, handleClear]
  )

  return (
    <div
      className={[
        "search-bar",
        `search-bar--${size}`,
        `search-bar--${variant}`,
        isFocused ? "search-bar--focused" : "",
        disabled ? "search-bar--disabled" : "",
        query.length > 0 ? "search-bar--has-value" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Left Icon */}
      <div className="search-bar__icon-left">
        <IconSearch className="search-bar__search-icon" />
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className="search-bar__input"
        aria-label="Search input"
      />

      {/* Clear Button */}
      {query && (
        <ActionIcon
          size="sm"
          onClick={handleClear}
          disabled={disabled}
          className="search-bar__clear-button"
          aria-label="Clear search"
          variant="subtle"
        >
          <IconX className="search-bar__clear-icon" />
        </ActionIcon>
      )}
    </div>
  )
}
