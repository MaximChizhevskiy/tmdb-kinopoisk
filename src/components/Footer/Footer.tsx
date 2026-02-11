import styles from "./Footer.module.css"

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© 2025 Kinopoisk Demo · Data courtesy of TMDB</p>
      </div>
    </footer>
  )
}
