import React, { useState } from 'react';
import { useUpdateMemberRatingAndReview, useVisitedRamenRestaurant } from '@hooks/useRamen';
import UserProfileImage from '@components/common/UserProfileImage';
import StarRating from '@components/common/StarRating';

import './VisitsGrid.css';

const VisitsGrid = ({ user, id }) => {
  const { data: visitedRamenItem, refetch } = useVisitedRamenRestaurant(id);
  // console.log(visitedRamenItem.visits[0].members[0].memberId);
  const updateRatingAndReviewMutation = useUpdateMemberRatingAndReview();

  // 별점/후기 제출 핸들러
  const [editingRating, setEditingRating] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [newReviewText, setNewReviewText] = useState('');

  const handleRatingSubmit = async (visitCount, memberName) => {
    if (newRating === 0 || newRating < 0 || newRating > 5) {
      alert('0.5점부터 5점까지의 유효한 별점을 입력해주세요.');
      return;
    }

    try {
      await updateRatingAndReviewMutation.mutateAsync({
        restaurantId: visitedRamenItem._id,
        visitCount: visitCount,
        memberName: memberName,
        rating: newRating,
        reviewText: newReviewText,
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
    <div className='visits-grid'>
      {visitedRamenItem.visits.map((visit) => (
        <div key={visit.visit_count} className='visit-item'>
          <div className='visit-header'>
            <h3>#{visit.visit_count}차 습격 후기</h3>
            <span className='visit-date-display'>
              {new Date(visit.visit_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className='members-review-list'>
            {visit.members.map((member) => {
              // 현재 로그인한 유저가 이 방문 기록의 멤버인지 확인
              const isCurrentUser = user && user.member && user.member.name === member.memberId.name;

              return (
                <div key={member.memberId.name} className='member-review-item'>
                  <div className='member-info'>
                    <UserProfileImage user={member.memberId} size={36} />
                  </div>
                  <div className='member-review-content'>
                    <span className='member-name'>{member.memberId.name}</span>

                    {/* !편집 모드 && 본인 방문 기록 */}
                    {isCurrentUser && editingRating?.visitCount !== visit.visit_count && (
                      <button
                        className='edit-review-button'
                        onClick={() => {
                          setEditingRating({ visitCount: visit.visit_count, memberName: member.memberId.name });
                          setNewRating(member.rating || 0); // 기존 별점 불러오기
                          setNewReviewText(member.reviewText); // 기존 후기 불러오기 (현재 후기 필드가 없으므로 임시 텍스트)
                        }}
                        disabled={updateRatingAndReviewMutation.isPending}
                      >
                        {member.rating !== null ? '수정' : '별점/후기 남기기'}
                      </button>
                    )}

                    {/* 편집 모드 */}
                    {isCurrentUser &&
                    editingRating?.visitCount === visit.visit_count &&
                    editingRating?.memberName === member.memberId.name ? (
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
                          placeholder='라멘 맛있었음?'
                          className='review-textarea'
                        ></textarea>
                        <div className='review-actions'>
                          <button
                            onClick={() => handleRatingSubmit(visit.visit_count, member.memberId.name)}
                            disabled={updateRatingAndReviewMutation.isPending}
                          >
                            {updateRatingAndReviewMutation.isPending ? '저장 중...' : '저장'}
                          </button>
                          <button onClick={() => setEditingRating(null)} disabled={updateRatingAndReviewMutation.isPending}>
                            취소
                          </button>
                        </div>
                        {updateRatingAndReviewMutation.isError && (
                          <p className='error-message'>저장 오류: {updateRatingAndReviewMutation.error.message}</p>
                        )}
                      </div>
                    ) : (
                      // !편집 모드가 || !본인 방문 기록 => 기존 정보 표시
                      <>
                        {member.reviewText ? (
                          <p className='member-review-text'>{member.reviewText}</p>
                        ) : (
                          <p className='member-review-text none'>후기가 없습니다</p>
                        )}

                        <div className={`member-rating ${member.rating === null ? 'no-rating' : ''}`}>
                          {member.rating !== null ? <StarRating rating={member.rating} /> : '별점 없음'}
                        </div>
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
  );
};

export default VisitsGrid;
