import './RamenApp.css';
import { usePlannedRamenRestaurants, useVisitedRamenRestaurants } from '@hooks/useRamen';
import VisitedRamenCard from '@components/VisitedRamenCard';
import RecommendedRamenCard from '@components/RecommendedRamenCard';
import { useState } from 'react';
import AddVisitedRamenModal from '@components/modal/AddVisitedRamenModal';
import AddPlannedRamenModal from '@components/modal/AddPlannedRamenModal';

const RamenApp = () => {
  const { data: visitedRamenList, isLoading: isLoadingVisited } = useVisitedRamenRestaurants();
  const { data: RecommendedRamenList, isLoading: isLoadingRecommended } = usePlannedRamenRestaurants();
  console.log(visitedRamenList);

  const [isVisitedModalOpen, setIsVisitedModalOpen] = useState(false);
  const [isPlannedModalOpen, setIsPlannedModalOpen] = useState(false);

  if (isLoadingVisited || isLoadingRecommended) {
    return <div className='loading-full-page'>라멘집을 불러오는 중입니다...</div>;
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

        <div className='restaurant-section planned'>
          <div className='restaurant-grid-title planned'>
            <div>
              <p>👍🏻 추천 라멘집</p>
              <p onClick={() => setIsPlannedModalOpen(true)}>추천하기</p>
            </div>
          </div>
          <div className='restaurant-grid planned'>
            {RecommendedRamenList.length !== 0 ? (
              RecommendedRamenList?.map((restaurant, idx) => (
                <RecommendedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
              ))
            ) : (
              <p className='no-card-text'>아무도 추천하지 않았습니다</p>
            )}
          </div>
        </div>
      </div>

      <AddVisitedRamenModal isOpen={isVisitedModalOpen} onClose={() => setIsVisitedModalOpen(false)} />
      <AddPlannedRamenModal isOpen={isPlannedModalOpen} onClose={() => setIsPlannedModalOpen(false)} />
    </div>
  );
};
export default RamenApp;
