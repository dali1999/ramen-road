import { useState } from 'react';
import { MEMBER, RAMEN_DATA } from '../ramenData';
import './RamenApp.css';

import { usePlannedRamenRestaurants, useVisitedRamenRestaurants } from '../hooks/useRamen';
import VisitedRamenCard from '../components/VisitedRamenCard';
import RecommendedRamenCard from '../components/RecommendedRamenCard';

const RamenApp = () => {
  const { data: visitedRamenList } = useVisitedRamenRestaurants();
  const { data: RecommendedRamenList } = usePlannedRamenRestaurants();
  console.log(RecommendedRamenList);

  return (
    <div className='container'>
      <header className='header'>
        <h1>RAMEN ROAD</h1>
        <p>한국의 모든 라멘을 먹어보자</p>
      </header>

      <div className='restaurant-wrapper'>
        <div>
          <div className='restaurant-grid-title visited'>
            <h2>라멘로드</h2>
          </div>
          <div className='restaurant-grid visited'>
            {visitedRamenList?.map((restaurant, idx) => (
              <>
                <VisitedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
                <VisitedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
                <VisitedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
                <VisitedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
              </>
            ))}
          </div>
        </div>

        <div>
          <div className='restaurant-grid-title planned'>
            <h2>추천 라멘집</h2>
          </div>
          <div className='restaurant-grid planned'>
            {RecommendedRamenList?.map((restaurant, idx) => (
              <RecommendedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default RamenApp;
