import { useNavigate } from 'react-router-dom';
import { useDeletePlannedRamenRestaurant } from '@hooks/useRamen';
import UserProfileImage from '@components/common/UserProfileImage';
import { useAuth } from '@context/AuthContext';
import './RecommendedRamenCard.css';

const RecommendedRamenCard = ({ restaurant }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const deletePlannedRamenMutation = useDeletePlannedRamenRestaurant();
  const recommender = restaurant.recommendedBy;

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm(`${restaurant.name}을(를) 정말 삭제하시겠습니까?`)) {
      deletePlannedRamenMutation.mutate(restaurant._id);
    }
  };

  const handleCardClick = (id) => {
    navigate(`/recommended/${id}`);
  };

  const canDelete = user && user.member && (user.member.role === 'admin' || user.member._id === restaurant.createdBy);

  return (
    <div className='recommended-restaurant-card' onClick={() => handleCardClick(restaurant._id)}>
      {canDelete && (
        <div className='delete-button' onClick={handleDeleteClick}>
          ...
        </div>
      )}
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
            <li className='recommended-member-avatar-wrapper'>
              <UserProfileImage user={recommender} size={46} />
            </li>

            <div className='recommended-text-wrapper'>
              <div className='recommended-member-name'>
                <p>추천인:</p>
                <p>{recommender.name}</p>
              </div>
              <div className='recommended-text'>"{restaurant.recommendationComment}"</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendedRamenCard;
