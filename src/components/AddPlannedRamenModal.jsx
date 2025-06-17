import React, { useState } from 'react';
import { useAddPlannedRamen, useMembers } from '../hooks/useRamen';
import './AddVisitedRamenModal.css';

const AddPlannedRamenModal = ({ isOpen, onClose }) => {
  // const { data: members, isLoading: isLoadingMembers, error: membersError } = useMembers();
  const addPlannedRamenMutation = useAddPlannedRamen();

  const DEFAULT_BANNER_IMAGE =
    'https://us.123rf.com/450wm/eclaira/eclaira2302/eclaira230200005/198689430-ciotola-di-noodles-di-ramen-con-carne-di-maiale-e-uova-cibo-asiatico-illustrazione-vettoriale.jpg?ver=6';

  // --- 폼 상태 관리 ---
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [recommendationComment, setRecommendationComment] = useState(''); // 선택된 멤버들의 이름

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) {
      alert('라멘집 이름과 위치는 필수입니다!');
      return;
    }
    const finalBannerImageUrl = bannerImageUrl.trim() === '' ? DEFAULT_BANNER_IMAGE : bannerImageUrl;
    addPlannedRamenMutation.mutate(
      {
        name,
        bannerImageUrl: finalBannerImageUrl,
        location,
        recommendationComment,
      },
      {
        onSuccess: () => {
          alert('새로운 라멘집 방문 기록이 성공적으로 추가되었습니다!');
          setName('');
          setLocation('');
          setBannerImageUrl('');
          setRecommendationComment('');
          onClose(); // 모달 닫기
        },
        onError: (error) => {
          alert(`라멘집 추가 실패: ${error.response?.data?.message || error.message}`);
        },
      },
    );
  };

  // if (isLoadingMembers)
  //   return (
  //     <div className='modal-overlay'>
  //       <div className='modal-content'>멤버 목록 로딩 중...</div>
  //     </div>
  //   );
  // if (membersError)
  //   return (
  //     <div className='modal-overlay'>
  //       <div className='modal-content' style={{ color: 'red' }}>
  //         멤버 목록 로드 오류: {membersError.message}
  //       </div>
  //     </div>
  //   );

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <h2>다음 토벌지역</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>라멘집 이름:</label>
            <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className='form-group'>
            <label htmlFor='location'>위치:</label>
            <input type='text' id='location' value={location} onChange={(e) => setLocation(e.target.value)} required />
          </div>

          <div className='form-group'>
            <label htmlFor='image'>이미지 주소:</label>
            <input
              type='text'
              id='image'
              value={bannerImageUrl}
              onChange={(e) => setBannerImageUrl(e.target.value)}
              placeholder='이미지가 없을 시 기본 이미지가 들어갑니다'
            />
          </div>

          <div className='form-group'>
            <label htmlFor='recommendationComment'>추천하는 이유:</label>
            <input
              type='text'
              id='recommendationComment'
              value={recommendationComment}
              onChange={(e) => setRecommendationComment(e.target.value)}
              required
            />
          </div>

          <div className='modal-actions'>
            <button type='submit' disabled={addPlannedRamenMutation.isPending}>
              {addPlannedRamenMutation.isPending ? '추가 중...' : '추천하기'}
            </button>
            <button type='button' onClick={onClose} disabled={addPlannedRamenMutation.isPending}>
              닫기
            </button>
          </div>
          {addPlannedRamenMutation.isError && (
            <p style={{ color: 'red', marginTop: '10px' }}>오류: {addPlannedRamenMutation.error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddPlannedRamenModal;
