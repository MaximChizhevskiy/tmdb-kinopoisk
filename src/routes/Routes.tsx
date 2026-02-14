import { Routes, Route } from "react-router-dom"
import { CategoryMoviesPage } from "../pages"
import { SearchPage } from "../pages"
import { HomePage } from "../pages"
import { MoviePage } from "../pages"
import { FiltersPage } from "../pages"
import { FavoritesPage } from "../pages"
import { NotFoundPage } from "../pages"

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movies" element={<CategoryMoviesPage />} />
      <Route path="/movie/:id" element={<MoviePage />} />
      <Route path="/filters" element={<FiltersPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
