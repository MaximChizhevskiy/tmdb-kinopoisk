import { useNavigate } from "react-router-dom"
import styles from "./BackButton.module.css"

interface BackButtonProps {
  fallbackPath?: string
  className?: string
  label?: string
  showIcon?: boolean
  size?: "normal" | "large" | "small" | "ghost"
}

export const BackButton = ({
  fallbackPath = "/",
  className = "",
  label = "Назад",
  showIcon = true,
  size = "normal",
}: BackButtonProps) => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1)
    } else {
      navigate(fallbackPath)
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case "large":
        return styles.backButtonLarge
      case "small":
        return styles.backButtonSmall
      case "ghost":
        return styles.backButtonGhost
      default:
        return ""
    }
  }

  return (
    <button
      className={`${styles.backButton} ${getSizeClass()} ${className}`}
      onClick={handleGoBack}
      aria-label="Вернуться назад"
      title={label}
    >
      {showIcon && <span className={styles.backIcon}>←</span>}
      {label && <span className={styles.backLabel}>{label}</span>}
    </button>
  )
}
