import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import styles from "./SkeletonMovieCard.module.css"

export const SkeletonMovieCard = () => {
  return (
    <div className={styles.skeletonMovieCard}>
      <div className={styles.skeletonPoster}>
        <Skeleton height={300} />
      </div>
      <div className={styles.skeletonContent}>
        <Skeleton count={2} />
        <div className={styles.skeletonFooter}>
          <Skeleton circle width={32} height={32} />
          <Skeleton width={60} />
        </div>
      </div>
    </div>
  )
}
