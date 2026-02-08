import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import "./App.css"
import { Header } from "./components"
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
        </div>
      </Router>
    </ThemeProvider>
  )
}
