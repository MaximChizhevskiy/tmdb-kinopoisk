import styles from "./HomePage.module.css"
import { NowPlayingMovies, PopularMovies, TopRatedMovies, UpcomingMovies, WelcomeSection } from "../../components"

export const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <WelcomeSection />
      <PopularMovies />
      <TopRatedMovies />
      <UpcomingMovies />
      <NowPlayingMovies />
    </div>
  )
}
