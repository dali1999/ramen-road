import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './VisitedRamenRestaurant.css';
import { useUpdateMemberRating, useVisitedRamenRestaurant } from '../hooks/useRamen';
import UserProfileImage from '../components/common/UserProfileImage';
import { useAuth } from '../context/AuthContext';

const VisitedRamenRestaurant = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: visitedRamenItem, isLoading, error, refetch } = useVisitedRamenRestaurant(id);
  const updateRatingMutation = useUpdateMemberRating();

  // 별점/후기 입력 상태 (임시로, 실제로는 각 멤버별로 상태 관리 필요)
  const [editingRating, setEditingRating] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');

  if (isLoading) return <div className='loading-message'>🍜 라멘집 정보를 불러오는 중...</div>;
  if (error) return <div className='error-message'>😔 오류가 발생했어요: {error.message}</div>;
  if (!visitedRamenItem) return <div className='not-found-message'>존재하지 않거나, 아직 등록되지 않은 라멘집입니다.</div>;

  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </>
    );
  };

  // 별점/후기 제출 핸들러
  const handleRatingSubmit = async (visitCount, memberName) => {
    if (newRating === 0 || newRating < 0 || newRating > 5) {
      alert('0.5점부터 5점까지의 유효한 별점을 입력해주세요.');
      return;
    }

    console.log('restaurantId: ', visitedRamenItem._id);
    console.log('visitCount: ', visitCount);
    console.log('memberName: ', memberName);
    console.log('rating: ', newRating);

    try {
      await updateRatingMutation.mutateAsync({
        restaurantId: visitedRamenItem._id,
        visitCount: visitCount,
        memberName: memberName,
        rating: newRating,
      });

      alert('별점 및 후기가 성공적으로 저장되었습니다!');
      setEditingRating(null); // 편집 모드 종료
      setNewRating(0); // 상태 초기화
      setNewReviewText(''); // 후기 텍스트 초기화

      refetch();
    } catch (err) {
      console.error('별점/후기 제출 실패:', err);
    }
  };

  return (
    <div className='restaurant-detail-container'>
      {/* Hero Section */}
      <section className='restaurant-hero'>
        <div className='hero-overlay'></div>
        <img src={visitedRamenItem.bannerImageUrl} alt={visitedRamenItem.name} className='hero-background-image' />
        <div className='hero-content'>
          <h1 className='restaurant-detail-name'>{visitedRamenItem.name}</h1>
          <p className='restaurant-detail-location'>{visitedRamenItem.location}</p>
          <div className='restaurant-detail-rating'>
            <span className='stars'>
              {visitedRamenItem.ratingAverage > 0 ? renderStarRating(visitedRamenItem.ratingAverage) : '아직 별점이 없어요'}
            </span>
            {visitedRamenItem.ratingAverage > 0 && <span className='rating-value'>{visitedRamenItem.ratingAverage.toFixed(1)} / 5</span>}
          </div>
        </div>
      </section>

      {/* 이미지 갤러리 섹션 */}
      <section className='image-gallery-section'>
        <h2>갤러리</h2>
        <div className='image-gallery-scroll-wrapper'>
          {[...Array(Math.min(visitedRamenItem.visits.length + 2, 5))].map((_, i) => (
            <img key={i} src={visitedRamenItem.bannerImageUrl} alt={`${visitedRamenItem.name} 이미지 ${i + 1}`} className='gallery-image' />
          ))}
        </div>
      </section>

      {/* 방문 회차 및 멤버 리뷰 섹션 */}
      <section className='visits-reviews-section'>
        <h2>방문 기록</h2>
        {visitedRamenItem.visits.length === 0 ? (
          <p className='no-visits-message'>아직 이 라멘집의 방문 기록이 없어요!</p>
        ) : (
          <div className='visits-grid'>
            {visitedRamenItem.visits.map((visit) => (
              <div key={visit.visit_count} className='visit-card'>
                <div className='visit-header'>
                  <h3>#{visit.visit_count}차 습격</h3>
                  <span className='visit-date-display'>
                    {new Date(visit.visit_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className='members-review-list'>
                  {visit.members.map((member) => {
                    // 현재 로그인한 유저가 이 방문 기록의 멤버인지 확인
                    const isCurrentUser = user.member && user.member.name === member.name;
                    return (
                      <div key={member.name} className='member-review-item'>
                        <div className='member-info'>
                          <UserProfileImage user={member} size={36} />
                          <span className='member-name'>{member.name}</span>
                        </div>
                        <div className='member-review-content'>
                          {/* 본인 방문 기록이고, 아직 편집 모드가 아니라면 */}
                          {isCurrentUser && editingRating?.visitCount !== visit.visit_count && (
                            <button
                              className='edit-review-button'
                              onClick={() => {
                                setEditingRating({ visitCount: visit.visit_count, memberName: member.name });
                                setNewRating(member.rating || 0); // 기존 별점 불러오기
                                setNewReviewText('여기에 후기를 작성하세요'); // 기존 후기 불러오기 (현재 후기 필드가 없으므로 임시 텍스트)
                              }}
                              disabled={updateRatingMutation.isPending}
                            >
                              {member.rating !== null ? '별점/후기 수정' : '별점/후기 남기기'}
                            </button>
                          )}

                          {/* 편집 모드일 때만 입력 필드 표시 */}
                          {isCurrentUser && editingRating?.visitCount === visit.visit_count && editingRating?.memberName === member.name ? (
                            <div className='review-input-area'>
                              <input
                                type='number'
                                step='0.5'
                                min='0'
                                max='5'
                                value={newRating}
                                onChange={(e) => setNewRating(parseFloat(e.target.value))}
                                className='rating-input'
                              />
                              <textarea
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                                placeholder='당신의 라멘 후기를 남겨주세요...'
                                className='review-textarea'
                              ></textarea>
                              <div className='review-actions'>
                                <button
                                  onClick={() => handleRatingSubmit(visit.visit_count, member.name)}
                                  disabled={updateRatingMutation.isPending}
                                >
                                  {updateRatingMutation.isPending ? '저장 중...' : '저장'}
                                </button>
                                <button onClick={() => setEditingRating(null)} disabled={updateRatingMutation.isPending}>
                                  취소
                                </button>
                              </div>
                              {updateRatingMutation.isError && (
                                <p className='error-message'>저장 오류: {updateRatingMutation.error.message}</p>
                              )}
                            </div>
                          ) : (
                            // 편집 모드가 아니거나 본인 방문 기록이 아닐 때 기존 정보 표시
                            <>
                              <p className='member-review-text'>
                                {/* 실제 리뷰 텍스트가 있다면 여기에 바인딩 (현재 DB에 없으므로 임시) */}
                                {member.name}의 한 줄 평: {member.reviewText || '아직 후기가 없어요.'}
                                {/* 현재 'reviewText' 필드가 DB에 없으므로, 위처럼 임시로 처리하거나,
                                    MemberSchema의 VisitMemberSchema에 reviewText 필드를 추가해야 합니다. */}
                              </p>
                              <span className={`member-rating ${member.rating === null ? 'no-rating' : ''}`}>
                                {member.rating !== null ? renderStarRating(member.rating) : '별점 미등록'}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VisitedRamenRestaurant;
