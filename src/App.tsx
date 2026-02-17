import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { Footer, Header } from "./components"
import { ThemeProvider } from "./context"
import { AppRoutes } from "./routes/Routes"
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop.tsx"

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />
          <ScrollToTop />
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
