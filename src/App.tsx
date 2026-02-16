import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Header } from "./components"
import { Footer } from "./components"
import { LinearProgress } from "./components"
import styles from "./App.module.css"
import { ThemeProvider } from "./context"
import { AppRoutes } from "./routes/Routes"
import { useGlobalLoading } from "./hooks"

export const App = () => {
  const isGlobalLoading = useGlobalLoading()
  return (
    <ThemeProvider>
      <Router>
        <div className={styles.app}>
          <Header />
          {isGlobalLoading && <LinearProgress />}
          <main className={styles.mainContent}>
            <AppRoutes />
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  )
}
