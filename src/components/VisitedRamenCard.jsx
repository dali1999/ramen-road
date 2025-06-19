import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MEMBER } from '../ramenData';
import './VisitedRamenCard.css';
import { useDeleteVisitedRamenRestaurant } from '../hooks/useRamen';
import CardTags from './CardTags';
import UserProfileImage from './common/UserProfileImage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const VisitedRamenCard = ({ restaurant }) => {
  console.log(restaurant);
  const navigate = useNavigate();
  const deleteVisitedRamenRestaurantById = useDeleteVisitedRamenRestaurant();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`${restaurant.name}을(를) 정말 삭제하시겠습니까?`)) {
      deleteVisitedRamenRestaurantById.mutate(restaurant._id);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  return (
    <div className='restaurant-card' onClick={() => handleCardClick(restaurant._id)}>
      <div className='delete-button' onClick={handleDeleteClick}>
        ...
      </div>

      <div className='restaurant-backgroundImg-wrapper'>
        <img src={restaurant.bannerImageUrl} className='restaurant-backgroundImg' draggable='false' />
      </div>

      <div className='restaurant-card-info'>
        <h2>{restaurant.name}</h2>
        <p className='location'>
          <i className='fas fa-map-marker-alt'></i>
          {restaurant.location}
        </p>
      </div>

      <CardTags />

      <div className='visits'>
        {restaurant.visits.map((visit) => (
          <div key={visit.visit_count} className='visit-card'>
            <div className='visit-info'>
              <span className='visit-count'>#{visit.visit_count}차 습격</span>
              <span className='visit-date'>{visit.visit_date}</span>
            </div>

            <div className='members'>
              <ul>
                {visit.members.map((member, idx) => (
                  <li
                    key={member.name}
                    style={{
                      zIndex: idx,
                      left: `${idx * 22}px`,
                    }}
                  >
                    <UserProfileImage user={member} size={36} />
                  </li>
                ))}

                {restaurant.ratingAverage > 0 ? (
                  <div className='rating'>{restaurant.ratingAverage}</div>
                ) : (
                  <div className='noRating'>별점 없음</div>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitedRamenCard;
