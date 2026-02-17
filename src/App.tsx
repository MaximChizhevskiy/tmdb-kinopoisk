import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Footer, Header } from "./components"
import { ThemeProvider } from "./context"
import { AppRoutes } from "./routes/Routes"
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop.tsx"
import style from "./App.module.css"

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className={style.app}>
          <Header />
          <ScrollToTop />
          <main className={style.main}>
            <AppRoutes />
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </Router>
    </ThemeProvider>
  )
}
