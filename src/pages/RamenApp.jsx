import { MEMBER, RAMEN_DATA } from '../ramenData';
import './RamenApp.css';
import { usePlannedRamenRestaurants, useVisitedRamenRestaurants } from '../hooks/useRamen';
import VisitedRamenCard from '../components/VisitedRamenCard';
import RecommendedRamenCard from '../components/RecommendedRamenCard';
import { useState } from 'react';
import AddVisitedRamenModal from '../components/AddVisitedRamenModal';
import AddPlannedRamenModal from '../components/AddPlannedRamenModal';

const RamenApp = () => {
  const { data: visitedRamenList, isLoading: isLoadingVisited } = useVisitedRamenRestaurants();
  const { data: RecommendedRamenList, isLoading: isLoadingRecommended } = usePlannedRamenRestaurants();

  const [isVisitedModalOpen, setIsVisitedModalOpen] = useState(false);
  const [isPlannedModalOpen, setIsPlannedModalOpen] = useState(false);

  if (isLoadingVisited || isLoadingRecommended) {
    return <div className='loading-full-page'>데이터를 불러오는 중입니다...</div>;
  }
  return (
    <div className='container'>
      <header className='header'>
        <h1>RAMEN ROAD</h1>
        <p>한국의 모든 라멘을 먹어보자</p>
      </header>

      <div className='restaurant-wrapper'>
        <div>
          <div className='restaurant-grid-title visited'>
            <h2 onClick={() => setIsVisitedModalOpen(true)}>라멘로드 +</h2>
          </div>
          <div className='restaurant-grid visited'>
            {visitedRamenList?.map((restaurant, idx) => (
              <VisitedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
            ))}
          </div>
        </div>

        <div>
          <div className='restaurant-grid-title planned'>
            <h2 onClick={() => setIsPlannedModalOpen(true)}>추천 라멘집 </h2>
          </div>
          <div className='restaurant-grid planned'>
            {RecommendedRamenList?.map((restaurant, idx) => (
              <RecommendedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
            ))}
          </div>
        </div>
      </div>

      <AddVisitedRamenModal isOpen={isVisitedModalOpen} onClose={() => setIsVisitedModalOpen(false)} />
      <AddPlannedRamenModal isOpen={isPlannedModalOpen} onClose={() => setIsPlannedModalOpen(false)} />
    </div>
  );
};
export default RamenApp;
