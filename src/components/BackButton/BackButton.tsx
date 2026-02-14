import { useNavigate } from "react-router-dom"
import "./BackButton.css"

interface BackButtonProps {
  fallbackPath?: string // Путь по умолчанию, если нет истории
  className?: string
  label?: string
  showIcon?: boolean
}

export const BackButton = ({
  fallbackPath = "/",
  className = "",
  label = "Назад",
  showIcon = true,
}: BackButtonProps) => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    // Пытаемся вернуться на предыдущую страницу
    if (window.history.length > 2) {
      navigate(-1) // Возврат на предыдущую страницу в истории
    } else {
      navigate(fallbackPath) // Если истории нет, идём на fallback
    }
  }

  return (
    <button className={`back-button ${className}`} onClick={handleGoBack} aria-label="Вернуться назад" title={label}>
      {showIcon && <span className="back-icon">←</span>}
      {label && <span className="back-label">{label}</span>}
    </button>
  )
}
