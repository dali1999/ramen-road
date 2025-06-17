import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendedRamenCard.css';
import { useDeletePlannedRamenRestaurant } from '../hooks/useRamen';

const API_BASE_URL = 'http://localhost:3000';

const RecommendedRamenCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const deletePlannedRamenMutation = useDeletePlannedRamenRestaurant();
  const recommender = restaurant.recommendedBy;

  const handleDeleteClick = () => {
    if (window.confirm(`${restaurant.name}을(를) 정말 삭제하시겠습니까?`)) {
      deletePlannedRamenMutation.mutate(restaurant._id);
    }
  };

  const handleCardBannerClick = (id) => {
    navigate(`/recommended/${id}`);
  };

  return (
    <div className='restaurant-card'>
      <div className='delete-button' onClick={handleDeleteClick}>
        ...
      </div>
      <div className='restaurant-header' onClick={() => handleCardBannerClick(restaurant._id)}>
        <img src={restaurant.bannerImageUrl} className='restaurant-header-backgroundImg' draggable='false' />
        <div className='restaurant-header-content'>
          <h2>{restaurant.name}</h2>
          <p className='location'>{restaurant.location}</p>
        </div>
      </div>

      <div className='recommended-info'>
        <div className='recommended-member'>
          <li className='recommended-member-image-wrapper'>
            <img src={`${API_BASE_URL}${recommender.imageUrl}`} alt='추천인 이미지' />
          </li>

          <div className='recommended-text-wrapper'>
            <div className='recommended-member-name'>{recommender.name}의 추천</div>
            <div className='recommended-text'>{restaurant.recommendationComment}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedRamenCard;
