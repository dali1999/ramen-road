import './RamenApp.css';
import { useState } from 'react';
import { useVisitedRamenRestaurants } from '@hooks/useRamen';
import VisitedRamenCard from '@components/VisitedRamenCard';
import AddVisitedRamenModal from '@components/modal/AddVisitedRamenModal';

const VisitedRamensPage = () => {
  const { data: visitedRamenList, isLoading: isLoadingVisited } = useVisitedRamenRestaurants();

  const [isVisitedModalOpen, setIsVisitedModalOpen] = useState(false);

  if (isLoadingVisited) {
    return <div className='loading-full-page'>라멘로드 불러오는 중...</div>;
  }
  return (
    <div className='container'>
      <div className='restaurant-wrapper'>
        <div className='restaurant-section visited'>
          <div className='restaurant-grid-title visited'>
            <div>
              <p>🍜 라멘로드</p>
              <p onClick={() => setIsVisitedModalOpen(true)}>개척하기</p>
            </div>
          </div>
          <div className='restaurant-grid visited'>
            {visitedRamenList.length !== 0 ? (
              visitedRamenList.map((restaurant, idx) => <VisitedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />)
            ) : (
              <p className='no-card-text'>아무도 개척하지 않았습니다</p>
            )}
          </div>
        </div>
      </div>

      <AddVisitedRamenModal isOpen={isVisitedModalOpen} onClose={() => setIsVisitedModalOpen(false)} />
    </div>
  );
};
export default VisitedRamensPage;
