import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css" // ← ОБЯЗАТЕЛЬНО добавить этот импорт!

import { Header } from "./components"
import { Footer } from "./components/Footer/Footer"
import "./App.css"
import { ThemeProvider } from "./context"
import { AppRoutes } from "./routes/Routes.tsx"

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />

          <main className="main-content">
            <AppRoutes />
          </main>

          <Footer />

          {/* ✅ ToastContainer ДОЛЖЕН БЫТЬ ЗДЕСЬ */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{ zIndex: 9999 }}
          />
        </div>
      </Router>
    </ThemeProvider>
  )
}
