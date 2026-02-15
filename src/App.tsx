import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Header } from "./components"
import { Footer } from "./components/Footer/Footer"
import { LinearProgress } from "./components/LinearProgress/LinearProgress"
import "./App.css"
import { ThemeProvider } from "./context"
import { AppRoutes } from "./routes/Routes"
import { useGlobalLoading } from "./hooks/useGlobalLoading"

export const App = () => {
  const isGlobalLoading = useGlobalLoading()
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />
          {isGlobalLoading && <LinearProgress />}
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
