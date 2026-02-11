// App.tsx
import { BrowserRouter as Router } from "react-router-dom"
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
        </div>
      </Router>
    </ThemeProvider>
  )
}
