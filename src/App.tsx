import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';

function App() {
    return (
        <Router>
            <div className="app">
                <header className="app-header">
                    <h1>🎬 TMDB-Kinopoisk</h1>
                </header>
                <main>
                    <Routes>
                        <Route path="/" element={
                            <div className="home">
                                <h2>Добро пожаловать!</h2>
                                <p>Приложение для поиска фильмов с использованием TMDB API</p>
                                <div className="features">
                                    <div>✅ Поиск фильмов</div>
                                    <div>✅ Детальная информация</div>
                                    <div>✅ Рейтинги и отзывы</div>
                                    <div>🚧 В разработке...</div>
                                </div>
                            </div>
                        }/>
                        <Route path="*" element={<div>404 - Страница не найдена</div>}/>
                    </Routes>
                </main>
                <footer>
                    <p>Использует <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">TMDB API</a>
                    </p>
                </footer>
            </div>
        </Router>
    );
}

export default App;