import "./HomePage.css"
import { NowPlayingMovies, PopularMovies, TopRatedMovies, UpcomingMovies, WelcomeSection } from "../../components"

export const HomePage = () => {
  return (
    <div className="home-page">
      <WelcomeSection />
      <PopularMovies />
      <TopRatedMovies />
      <UpcomingMovies />
      <NowPlayingMovies />
    </div>
  )
}
