import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteVisitedRamenRestaurant } from '@hooks/useRamen';
import UserProfileImage from '@components/common/UserProfileImage';
import StarRating from '@components/common/StarRating';
import { useAuth } from '@context/AuthContext';
import { ALL_TAGS } from '@components/common/CardTags';
import AddVisitedRamenModal from './AddVisitedRamenModal';
import './VisitedRamenCard.css';

const VisitedRamenCard = ({ restaurant }) => {
  console.log(restaurant);
  const navigate = useNavigate();
  const deleteVisitedRamenRestaurantById = useDeleteVisitedRamenRestaurant();
  const { user } = useAuth();

  const [isReVisitedModalOpen, setIsReVisitedModalOpen] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`${restaurant.name}을(를) 정말 삭제하시겠습니까?`)) {
      deleteVisitedRamenRestaurantById.mutate(restaurant._id);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/restaurant/${id}`);
  };

  const handleRevisitButtonClick = (e) => {
    e.stopPropagation();
    setIsReVisitedModalOpen(true);
  };

  const getTagColor = (tagLabel) => {
    const foundTag = ALL_TAGS.find((tag) => tag.label === tagLabel);
    return foundTag ? foundTag.color : '#666';
  };

  const canDelete = user && user.member && (user.member.role === 'admin' || user.member._id === restaurant.createdBy);

  return (
    <>
      <div className='restaurant-card' onClick={() => handleCardClick(restaurant._id)}>
        {canDelete && (
          <div className='delete-button' onClick={handleDeleteClick}>
            ❌
          </div>
        )}

        <div className='restaurant-backgroundImg-wrapper'>
          <img src={restaurant.bannerImageUrl} className='restaurant-backgroundImg' draggable='false' />
        </div>

        {/* 라멘집 이름, 주소 */}
        <div className='restaurant-card-info'>
          <h2>{restaurant.name}</h2>
          <p className='location'>
            <i className='fas fa-map-marker-alt'></i>
            {restaurant.location}
          </p>
        </div>

        {/* 라멘집 태그 */}
        <ul className='cardtags-list card'>
          {restaurant.tags.map((tagLabel, idx) => {
            const tagColor = getTagColor(tagLabel);
            return (
              <li
                className='cardtags-item'
                key={`${tagLabel}_${idx}`}
                style={{
                  backgroundColor: tagColor,
                  color: 'white',
                  borderColor: tagColor,
                }}
              >
                {tagLabel}
              </li>
            );
          })}
        </ul>

        {/* 방문 리스트 */}
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
                        left: `${idx * 20}px`,
                        top: 2,
                      }}
                    >
                      <UserProfileImage user={member} size={28} />
                    </li>
                  ))}

                  {visit.visitRatingAverage > 0 ? (
                    <div className='rating'>
                      <StarRating rating={visit.visitRatingAverage} />
                    </div>
                  ) : (
                    <div className='noRating'>별점 없음</div>
                  )}
                </ul>
              </div>
            </div>
          ))}
          <button className='revisit-button' onClick={handleRevisitButtonClick} title='재방문 추가'>
            +
          </button>
        </div>
      </div>
      <AddVisitedRamenModal initialRestaurant={restaurant} isOpen={isReVisitedModalOpen} onClose={() => setIsReVisitedModalOpen(false)} />
    </>
  );
};

export default VisitedRamenCard;
