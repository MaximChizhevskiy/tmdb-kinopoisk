import { type ChangeEvent, useState } from "react"
import "./Pagination.css"
import type { PaginationProps } from "../../types"

export const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  showItemsCount = false,
}: PaginationProps) => {
  const [customPageInput, setCustomPageInput] = useState("")

  const goToFirstPage = () => onPageChange(1)
  const goToLastPage = () => onPageChange(Math.min(totalPages, 500))
  const goToPrevPage = () => onPageChange(Math.max(1, currentPage - 1))
  const goToNextPage = () => {
    if (currentPage < Math.min(totalPages, 500)) {
      onPageChange(currentPage + 1)
    }
  }

  const handleCustomPageSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    const pageNum = parseInt(customPageInput)

    if (pageNum >= 1 && pageNum <= Math.min(totalPages, 500)) {
      onPageChange(pageNum)
      setCustomPageInput("")
    }
  }

  const handleCustomPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomPageInput(e.target.value)
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="pagination">
      {showItemsCount && totalItems && (
        <div className="pagination-items-count">Всего найдено: {totalItems.toLocaleString()}</div>
      )}

      <div className="pagination-controls">
        <button
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className="pagination-button pagination-button-first"
          aria-label="Первая страница"
          title="Первая страница"
        >
          ««
        </button>

        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className="pagination-button pagination-button-prev"
          aria-label="Предыдущая страница"
          title="Предыдущая страница"
        >
          «
        </button>

        <span className="page-info">
          Страница <strong>{currentPage}</strong> из <strong>{totalPages}</strong>
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className="pagination-button pagination-button-next"
          aria-label="Следующая страница"
          title="Следующая страница"
        >
          »
        </button>

        <button
          onClick={goToLastPage}
          disabled={currentPage >= totalPages}
          className="pagination-button pagination-button-last"
          aria-label="Последняя страница"
          title="Последняя страница"
        >
          »»
        </button>
      </div>

      <form className="custom-page-form" onSubmit={handleCustomPageSubmit}>
        <label htmlFor="custom-page" className="custom-page-label">
          Перейти на страницу:
        </label>
        <input
          id="custom-page"
          type="number"
          min="1"
          max={Math.min(totalPages, 500)}
          value={customPageInput}
          onChange={handleCustomPageChange}
          placeholder="№"
          className="custom-page-input"
          aria-label="Номер страницы для перехода"
        />
        <button
          type="submit"
          className="custom-page-button"
          disabled={!customPageInput}
          aria-label="Перейти на указанную страницу"
        >
          Перейти
        </button>
      </form>
    </div>
  )
}
