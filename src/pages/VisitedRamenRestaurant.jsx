import { useParams } from 'react-router-dom';
import './VisitedRamenRestaurant.css';
import { useVisitedRamenRestaurant } from '@hooks/useRamen';
import { useAuth } from '@context/AuthContext';
import VisitsGrid from '@components/domain/VisitedRamenRestaurant/VisitsGrid';

const VisitedRamenRestaurant = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: visitedRamenItem, isLoading, error } = useVisitedRamenRestaurant(id);

  if (isLoading) return <div className='loading-message'>🍜 라멘집 정보를 불러오는 중...</div>;
  if (error) return <div className='error-message'>😔 오류가 발생했어요: {error.message}</div>;
  if (!visitedRamenItem) return <div className='not-found-message'>존재하지 않거나, 아직 등록되지 않은 라멘집입니다.</div>;

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  return (
    <div className='restaurant-detail-container'>
      {/* Hero Section */}
      <section className='restaurant-hero'>
        <div className='hero-overlay'></div>
        <img src={visitedRamenItem.bannerImageUrl} alt={visitedRamenItem.name} className='hero-background-image' />
        <div className='hero-content'>
          <h1 className='restaurant-detail-name'>{visitedRamenItem.name}</h1>
          <p className='restaurant-detail-location'>{visitedRamenItem.location}</p>
          <div className='restaurant-detail-rating'>
            <span className='stars'>
              {visitedRamenItem.ratingAverage > 0 ? renderStarRating(visitedRamenItem.ratingAverage) : '아직 별점이 없어요'}
            </span>
            {visitedRamenItem.ratingAverage > 0 && <span className='rating-value'>{visitedRamenItem.ratingAverage.toFixed(1)} / 5</span>}
          </div>
        </div>
      </section>

      {/* 이미지 갤러리 섹션 */}
      <section className='image-gallery-section'>
        <h2>갤러리</h2>
        <div className='image-gallery-scroll-wrapper'>
          {[...Array(Math.min(visitedRamenItem.visits.length + 2, 5))].map((_, i) => (
            <img key={i} src={visitedRamenItem.bannerImageUrl} alt={`${visitedRamenItem.name} 이미지 ${i + 1}`} className='gallery-image' />
          ))}
        </div>
      </section>

      {/* 방문 회차 및 멤버 리뷰 섹션 */}
      <section className='visits-reviews-section'>
        <h2>방문 기록</h2>
        {visitedRamenItem.visits.length === 0 ? (
          <p className='no-visits-message'>아직 이 라멘집의 방문 기록이 없어요!</p>
        ) : (
          <VisitsGrid user={user} id={id} />
        )}
      </section>
    </div>
  );
};

export default VisitedRamenRestaurant;
