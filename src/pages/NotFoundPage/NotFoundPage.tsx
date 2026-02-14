import { useNavigate } from "react-router-dom"
import "./NotFoundPage.css"

export const NotFoundPage = () => {
  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1) // Назад в историю
  }

  const goHome = () => {
    navigate("/") // На главную
  }

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-animation">
          <div className="not-found-number">4</div>
          <div className="not-found-circle">0</div>
          <div className="not-found-number">4</div>
        </div>

        <h1 className="not-found-title">Страница не найдена</h1>

        <p className="not-found-text">
          Возможно, она была удалена или никогда не существовала.
          <br />
          Проверьте правильность введённого адреса или вернитесь на главную.
        </p>

        <div className="not-found-actions">
          <button onClick={goBack} className="not-found-button not-found-button--secondary">
            ← Назад
          </button>
          <button onClick={goHome} className="not-found-button not-found-button--primary">
            На главную
          </button>
        </div>

        <div className="not-found-help">
          <h3>Полезные ссылки:</h3>
          <div className="help-links">
            <a href="/movies?category=popular">Популярные фильмы</a>
            <a href="/search">Поиск</a>
            <a href="/filters">Фильтры</a>
            <a href="/favorites">Избранное</a>
          </div>
        </div>
      </div>
    </div>
  )
}
