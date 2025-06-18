import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RecommendedRamenCard.css';
import { useDeletePlannedRamenRestaurant } from '../hooks/useRamen';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const RecommendedRamenCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const deletePlannedRamenMutation = useDeletePlannedRamenRestaurant();
  const recommender = restaurant.recommendedBy;

  const handleDeleteClick = () => {
    if (window.confirm(`${restaurant.name}을(를) 정말 삭제하시겠습니까?`)) {
      deletePlannedRamenMutation.mutate(restaurant._id);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/recommended/${id}`);
  };

  return (
    <div className='recommended-restaurant-card' onClick={() => handleCardClick(restaurant._id)}>
      <div className='delete-button' onClick={handleDeleteClick}>
        ...
      </div>
      <div className='recommended-restaurant-backgroundImg-wrapper'>
        <img src={restaurant.bannerImageUrl} className='recommended-restaurant-backgroundImg' draggable='false' />
      </div>

      <div className='recommended-restaurant-card-info-wrapper'>
        <div className='restaurant-card-info recommended'>
          <h2>{restaurant.name}</h2>
          <p className='location'>
            <i className='fas fa-map-marker-alt'></i>
            {restaurant.location}
          </p>
        </div>

        <div className='recommended-info'>
          <div className='recommended-member'>
            <li className='recommended-member-image-wrapper'>
              <img src={`${API_BASE_URL}${recommender.imageUrl}`} alt='추천인 이미지' />
            </li>

            <div className='recommended-text-wrapper'>
              <div className='recommended-member-name'>
                <p>추천인:</p>
                <p>{recommender.name}</p>
              </div>
              <div className='recommended-text'>
                "{restaurant.recommendationComment} 너무 맛있어요 너무 맛있어요너무 맛있어요너무 맛있어요너무 맛있어요너무 맛있어요너무
                맛있어요너무 맛있어요너무 맛있어요너무 맛있어요"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedRamenCard;
