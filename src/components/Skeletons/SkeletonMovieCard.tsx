import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import "./SkeletonMovieCard.css"

export const SkeletonMovieCard = () => {
  return (
    <div className="skeleton-movie-card">
      <div className="skeleton-poster">
        <Skeleton height={300} />
      </div>
      <div className="skeleton-content">
        <Skeleton count={2} />
        <div className="skeleton-footer">
          <Skeleton circle width={32} height={32} />
          <Skeleton width={60} />
        </div>
      </div>
    </div>
  )
}
