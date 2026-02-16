import styles from "./ErrorMessage.module.css"

interface ErrorMessageProps {
  message?: string
  onRetry?: () => void
  errorType?: "network" | "auth" | "notFound" | "server" | "rateLimit" | "validation" | "unknown"
}

export const ErrorMessage = ({ message, onRetry, errorType = "unknown" }: ErrorMessageProps) => {
  const getIcon = () => {
    switch (errorType) {
      case "network":
        return "🌐"
      case "auth":
        return "🔑"
      case "notFound":
        return "🔍"
      case "server":
        return "🔧"
      case "rateLimit":
        return "⏳"
      case "validation":
        return "⚠️"
      default:
        return "❌"
    }
  }

  const getTitle = () => {
    switch (errorType) {
      case "network":
        return "Ошибка сети"
      case "auth":
        return "Ошибка авторизации"
      case "notFound":
        return "Ничего не найдено"
      case "server":
        return "Ошибка сервера"
      case "rateLimit":
        return "Слишком много запросов"
      case "validation":
        return "Ошибка в параметрах запроса"
      default:
        return "Произошла ошибка"
    }
  }

  const getDefaultMessage = () => {
    switch (errorType) {
      case "network":
        return "Проверьте подключение к интернету и попробуйте снова"
      case "auth":
        return "Недействительный ключ API. Пожалуйста, проверьте настройки"
      case "notFound":
        return "Запрашиваемый ресурс не найден"
      case "server":
        return "Сервер временно недоступен. Попробуйте позже"
      case "rateLimit":
        return "Превышен лимит запросов. Подождите немного"
      case "validation":
        return "Неверные параметры запроса"
      default:
        return "Попробуйте обновить страницу или повторить попытку"
    }
  }

  const getErrorTypeClass = () => {
    switch (errorType) {
      case "network":
        return styles.errorMessageNetwork
      case "auth":
        return styles.errorMessageAuth
      case "notFound":
        return styles.errorMessageNotFound
      case "server":
        return styles.errorMessageServer
      case "rateLimit":
        return styles.errorMessageRateLimit
      case "validation":
        return styles.errorMessageValidation
      default:
        return ""
    }
  }

  return (
    <div className={`${styles.errorMessage} ${getErrorTypeClass()}`}>
      <div className={styles.errorIcon}>{getIcon()}</div>
      <h3 className={styles.errorTitle}>{getTitle()}</h3>
      <p className={styles.errorText}>{message || getDefaultMessage()}</p>
      {onRetry && (
        <button className={styles.errorRetry} onClick={onRetry}>
          Попробовать снова
        </button>
      )}
    </div>
  )
}
