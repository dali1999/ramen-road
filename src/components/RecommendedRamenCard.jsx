import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MEMBER } from '../ramenData';
import './RecommendedRamenCard.css';

const RecommendedRamenCard = ({ restaurant }) => {
  console.log(restaurant);
  const navigate = useNavigate();

  const handleCardBannerClick = (id) => {
    navigate(`/recommended/${id}`);
  };

  return (
    <div className='restaurant-card'>
      <div className='restaurant-header' onClick={() => handleCardBannerClick(restaurant._id)}>
        <img src={restaurant.bannerImageUrl} className='restaurant-header-backgroundImg' draggable='false' />
        <div className='restaurant-header-content'>
          <h2>{restaurant.name}</h2>
          <p className='location'>{restaurant.location}</p>
        </div>
      </div>

      <div className='recommended-info'>
        {/* <div className='visit-info'>
          <span className='visit-count'>#{1}차 습격</span>
          <span className='visit-date'>123123</span>
        </div> */}

        <div className='recommended-member'>
          <li className='recommended-member-image-wrapper'>
            <img src={MEMBER[restaurant.recommendedBy]?.imageUrl} />
          </li>

          <div className='recommended-text'>{restaurant.recommendationComment}</div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedRamenCard;
