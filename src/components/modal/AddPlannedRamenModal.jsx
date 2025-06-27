import React, { useCallback, useEffect, useState } from 'react';
import { useAddPlannedRamen } from '@hooks/useRamen';
import { useAuth } from '@context/AuthContext';

import './AddVisitedRamenModal.css';

const AddPlannedRamenModal = ({ isOpen, onClose }) => {
  // const { data: members, isLoading: isLoadingMembers, error: membersError } = useMembers();
  const { user } = useAuth();

  const addPlannedRamenMutation = useAddPlannedRamen();

  const DEFAULT_BANNER_IMAGE =
    'https://us.123rf.com/450wm/eclaira/eclaira2302/eclaira230200005/198689430-ciotola-di-noodles-di-ramen-con-carne-di-maiale-e-uova-cibo-asiatico-illustrazione-vettoriale.jpg?ver=6';

  // --- 폼 상태 관리 ---
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState(null);
  const [recommendationComment, setRecommendationComment] = useState('');

  const resetFormStates = useCallback(() => {
    setName('');
    setLocation('');
    setBannerImageUrl(null);
    setRecommendationComment('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      resetFormStates();
    }
  }, [isOpen, resetFormStates]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location) {
      alert('라멘집 이름, 위치, 추천자는 필수입니다!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('recommendationComment', recommendationComment);
    if (bannerImageUrl) {
      formData.append('plannedBannerImage', bannerImageUrl);
    }

    addPlannedRamenMutation.mutate(formData, {
      onSuccess: () => {
        alert('새로운 방문 예정 라멘집이 성공적으로 추가되었습니다!');
        onClose();
      },
      onError: (error) => {
        alert(`방문 예정 라멘집 추가 실패: ${error.response?.data?.message || error.message}`);
      },
    });
  };

  if (!user.member)
    return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content'>라멘집을 추천하려면 로그인해야 합니다</div>
      </div>
    );

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
            <label htmlFor='plannedBannerImage'>라멘집 메인 사진:</label>
            <input
              type='file'
              id='plannedBannerImage'
              name='plannedBannerImage'
              accept='image/*'
              onChange={(e) => setBannerImageUrl(e.target.files?.[0])}
            />
            {bannerImageUrl && <p style={{ fontSize: '12px', color: '#666' }}>선택된 파일: {bannerImageUrl.name}</p>}
            {!bannerImageUrl && <p style={{ fontSize: '12px', color: '#999' }}>파일 미선택 시 기본 이미지가 사용됩니다.</p>}
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
