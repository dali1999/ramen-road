import { useParams } from 'react-router-dom';
import './RecommendedRamenInfoPage.css';
import { usePlannedRamenRestaurant } from '@hooks/useRamen';
import ImageWithWebp from '@components/common/ImageWebp';

const RecommendedRamenInfoPage = () => {
  const { id } = useParams();

  const { data: visitedRamenItem, isLoading, error } = usePlannedRamenRestaurant(id);

  if (isLoading) return <div className='loading-message'>라멘집 정보를 불러오는 중...</div>;
  if (error) return <div className='error-message'>오류 발생: {error.message}</div>;
  if (!visitedRamenItem) return <div className='not-found-message'>존재하지 않거나, 아직 등록되지 않은 라멘집입니다.</div>;

  return (
    <div className='visited-restaurant-container'>
      <div className='visited-restaurant-info'>
        <div className='visited-restaurant-info-text'>
          <p className='visited-restaurant-info-name'>{visitedRamenItem.name}</p>
          <p className='visited-restaurant-info-rating'>{visitedRamenItem.ratingAverage}</p>
        </div>
        <div className='visited-restaurant-info-images'>
          <ImageWithWebp src={visitedRamenItem.bannerImageUrl} className='visited-restaurant-main-image' alt={visitedRamenItem.name} />
        </div>
      </div>
    </div>
  );
};

export default RecommendedRamenInfoPage;
