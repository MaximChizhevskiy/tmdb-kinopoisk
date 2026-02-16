import { type ChangeEvent, useState } from "react"
import styles from "./Pagination.module.css"
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
    <div className={styles.pagination}>
      {showItemsCount && totalItems && (
        <div className={styles.paginationItemsCount}>Всего найдено: {totalItems.toLocaleString()}</div>
      )}

      <div className={styles.paginationControls}>
        <button
          onClick={goToFirstPage}
          disabled={currentPage === 1}
          className={`${styles.paginationButton} ${styles.paginationButtonFirst}`}
          aria-label="Первая страница"
          title="Первая страница"
        >
          ««
        </button>

        <button
          onClick={goToPrevPage}
          disabled={currentPage === 1}
          className={`${styles.paginationButton} ${styles.paginationButtonPrev}`}
          aria-label="Предыдущая страница"
          title="Предыдущая страница"
        >
          «
        </button>

        <span className={styles.pageInfo}>
          Страница <strong>{currentPage}</strong> из <strong>{totalPages}</strong>
        </span>

        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className={`${styles.paginationButton} ${styles.paginationButtonNext}`}
          aria-label="Следующая страница"
          title="Следующая страница"
        >
          »
        </button>

        <button
          onClick={goToLastPage}
          disabled={currentPage >= totalPages}
          className={`${styles.paginationButton} ${styles.paginationButtonLast}`}
          aria-label="Последняя страница"
          title="Последняя страница"
        >
          »»
        </button>
      </div>

      <form className={styles.customPageForm} onSubmit={handleCustomPageSubmit}>
        <label htmlFor="custom-page" className={styles.customPageLabel}>
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
          className={styles.customPageInput}
          aria-label="Номер страницы для перехода"
        />
        <button
          type="submit"
          className={styles.customPageButton}
          disabled={!customPageInput}
          aria-label="Перейти на указанную страницу"
        >
          Перейти
        </button>
      </form>
    </div>
  )
}
