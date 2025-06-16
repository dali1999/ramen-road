import { useParams } from 'react-router-dom';
import './RecommendedRamenRestaurant.css';
import { MEMBER, RAMEN_DATA } from '../ramenData';
import { usePlannedRamenRestaurant } from '../hooks/useRamen';

const RecommendedRamenRestaurant = () => {
  const { id } = useParams();

  const { data: visitedRamenItem, isLoading, error } = usePlannedRamenRestaurant(id);
  console.log(visitedRamenItem);

  if (isLoading) return <div className='loading-message'>라멘집 정보를 불러오는 중...</div>;
  if (error) return <div className='error-message'>오류 발생: {error.message}</div>;
  if (!visitedRamenItem) return <div className='not-found-message'>존재하지 않거나, 아직 등록되지 않은 라멘집입니다.</div>;

  return (
    <div className='visited-restaurant-container'>
      <div className='visited-restaurant-info'>
        <div className='visited-restaurant-info-text'>
          <p className='visited-restaurant-info-name'>{visitedRamenItem.name}</p>
          <p className='visited-restaurant-info-rating'>{visitedRamenItem.ratingAverage}</p>
        </div>
        <div className='visited-restaurant-info-images'>
          <img className='visited-restaurant-main-image' src={visitedRamenItem.bannerImageUrl} alt={visitedRamenItem.name} />
          <img className='visited-restaurant-main-image' src={visitedRamenItem.bannerImageUrl} alt={visitedRamenItem.name} />
          <img className='visited-restaurant-main-image' src={visitedRamenItem.bannerImageUrl} alt={visitedRamenItem.name} />
        </div>
      </div>

      {/* 방문회차별 멤버 및 리뷰 */}
      {/* <ul className='visited-count-list'>
        {visitedRamenItem.visits.map((visit, idx) => (
          <li key={`${idx}_${visit.visit_date}`} className='visited-count-item'>
            <div className='visited-count-item-title'>#{visit.visit_count}차 습격</div>
            <ul className='visited-count-member-list'>
              {visit.members.map((member, idx) => (
                <li className='visited-count-member-item' key={`${idx}_${member.name}`}>
                  <img src={MEMBER[member.name]?.imageUrl} alt={member.name} className='visited-count-member-item-avatar' />
                  <div className='visited-count-member-item-review'>
                    <div>
                      <span className='visited-count-member-item-review-name'>{member.name}</span>
                      <p className='visited-count-member-item-review-text'>
                        류진미만잡 류진미만잡 류진미만잡 류진미만잡 류진미만잡 류진미만잡 류진미만잡
                      </p>
                    </div>
                    {member.rating ? (
                      <span className='visited-count-member-item-review-rating'>
                        {'★'.repeat(member.rating)}
                        {'☆'.repeat(5 - member.rating)}
                      </span>
                    ) : (
                      <span className='visited-count-member-item-review-rating none'>노별점</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default RecommendedRamenRestaurant;
