import { useParams } from 'react-router-dom';
import './VisitedRamenInfoPage.css';
import { useVisitedRamenRestaurant, useRamenImages } from '@hooks/useRamen';
import { useAuth } from '@context/AuthContext';
import VisitsGrid from '@components/domain/RamenInfoPage/VisitsGrid';
import StarRating from '@components/common/StarRating';
import ImageGallery from '@components/domain/RamenInfoPage/ImageGallery';
import ImageWithWebp from '../components/common/ImageWebp';

const VisitedRamenInfoPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: visitedRamenItem, isLoading, error } = useVisitedRamenRestaurant(id);
  const { data: ramenImagesData } = useRamenImages(id);

  if (isLoading) return <div className='loading-message'>🍜 라멘집 정보를 불러오는 중...</div>;
  if (error) return <div className='error-message'>😔 오류가 발생했어요: {error.message}</div>;
  if (!visitedRamenItem) return <div className='not-found-message'>존재하지 않거나, 아직 등록되지 않은 라멘집입니다.</div>;

  const ramenImages = ramenImagesData?.images || [];
  // 배너 이미지는 기본적으로 갤러리에 추가
  const imagesToDisplay = [...ramenImages, visitedRamenItem.bannerImageUrl];

  return (
    <div className='restaurant-detail-container'>
      {/* Hero Section */}
      <section className='restaurant-hero'>
        <div className='hero-overlay'></div>
        <ImageWithWebp src={visitedRamenItem.bannerImageUrl} className='hero-background-image' alt={visitedRamenItem.name} />

        <div className='hero-content'>
          <h1 className='restaurant-detail-name'>{visitedRamenItem.name}</h1>
          <p className='restaurant-detail-location'>{visitedRamenItem.location}</p>
          <div className='restaurant-detail-rating'>
            <span className='stars'>
              {visitedRamenItem.ratingAverage > 0 ? <StarRating rating={visitedRamenItem.ratingAverage} /> : '아직 별점이 없어요'}
            </span>
            {visitedRamenItem.ratingAverage > 0 && <span className='rating-value'>{visitedRamenItem.ratingAverage.toFixed(1)}</span>}
          </div>
        </div>
      </section>

      {/* 이미지 갤러리 섹션 */}
      <section className='image-gallery-section'>
        <ImageGallery images={imagesToDisplay} />
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

export default VisitedRamenInfoPage;
