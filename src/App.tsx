import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Header } from "./components"
import { Footer } from "./components/Footer/Footer"
import { LinearProgress } from "./components/LinearProgress/LinearProgress" // Добавить
import "./App.css"
import { ThemeProvider } from "./context"
import { AppRoutes } from "./routes/Routes"
import { useGlobalLoading } from "./hooks/useGlobalLoading" // Добавить

export const App = () => {
  const isGlobalLoading = useGlobalLoading() // Добавить

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />
          {isGlobalLoading && <LinearProgress />} {/* Добавить */}
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  )
}
