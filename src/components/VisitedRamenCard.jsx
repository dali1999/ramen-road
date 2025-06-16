import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MEMBER } from '../ramenData';
import './VisitedRamenCard.css';

const VisitedRamenCard = ({ restaurant }) => {
  const navigate = useNavigate();

  const handleCardBannerClick = (id) => {
    navigate(`/restaurant/${id}`);
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
                  <li key={member.name} className='member-item' style={{ zIndex: idx, left: `${idx * 22}px` }}>
                    <img src={MEMBER[member.name]?.imageUrl} alt={member.name} className='member-avatar' />
                  </li>
                ))}

                <div className='rating'>
                  {'★'.repeat(4)}
                  {'☆'.repeat(5 - 4)}
                </div>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitedRamenCard;
