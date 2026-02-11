import { Routes, Route } from "react-router-dom"
import { CategoryMoviesPage } from "../pages"
import { SearchPage } from "../pages"
import { HomePage } from "../pages"
import { MoviePage } from "../pages/MoviePage/MoviePage.tsx"
import { FiltersPage } from "../pages/FiltersPage/FiltersPage.tsx"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<CategoryMoviesPage />} />
      <Route path="/movie/:id" element={<MoviePage />} />
      <Route path="/filters" element={<FiltersPage />} />
      <Route path="/search" element={<SearchPage />} />
      {/* <Route path="/favorites" element={<FavoritesPage />} />*/}
      <Route path="*" element={<div>404 - Страница не найдена</div>} />
    </Routes>
  )
}
