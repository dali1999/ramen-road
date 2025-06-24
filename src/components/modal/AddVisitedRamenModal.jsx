import React, { useCallback, useEffect, useState } from 'react';
import { useAddVisitedRamen, useMembers } from '@hooks/useRamen';
import CardTags from '@components/common/CardTags';
import { useAuth } from '@context/AuthContext';

import './AddVisitedRamenModal.css';
import UserProfileImage from '@components/common/UserProfileImage';
import ImageWithWebp from '@components/common/ImageWebp';

const AddVisitedRamenModal = ({ initialRestaurant = null, isOpen, onClose }) => {
  const { user } = useAuth();

  const { data: members, isLoading: isLoadingMembers, error: membersError } = useMembers();
  const addVisitedRamenMutation = useAddVisitedRamen();

  // --- 폼 상태 관리 ---
  const [name, setName] = useState(initialRestaurant ? initialRestaurant.name : '');
  const [location, setLocation] = useState(initialRestaurant ? initialRestaurant.location : '');
  const [visitDate, setVisitDate] = useState('');
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTags, setSelectedTags] = useState([user?.member?.name || null]);
  const resetFormStates = useCallback(() => {
    setName(initialRestaurant ? initialRestaurant.name : '');
    setLocation(initialRestaurant ? initialRestaurant.location : '');
    setVisitDate('');
    setBannerImageFile(null);
    setSelectedMembers([user?.member?.name || null]);
    setSelectedTags(initialRestaurant && initialRestaurant.tags ? [...initialRestaurant.tags] : []);
  }, [initialRestaurant, user?.member?.name]);

  useEffect(() => {
    if (isOpen) {
      resetFormStates();
    }
  }, [initialRestaurant, isOpen, resetFormStates]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !location || !visitDate || selectedMembers.length === 0) {
      alert('라멘집 이름, 위치, 방문 날짜, 멤버는 필수입니다!');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('location', location);
    formData.append('visitDate', visitDate);
    formData.append('members', JSON.stringify(selectedMembers.map((memberName) => ({ name: memberName }))));
    formData.append('tags', JSON.stringify(selectedTags));

    if (!initialRestaurant && bannerImageFile) {
      formData.append('bannerImage', bannerImageFile);
    }

    addVisitedRamenMutation.mutate(formData, {
      onSuccess: () => {
        alert(initialRestaurant ? '재방문 기록이 성공적으로 추가되었습니다!' : '새로운 라멘집이 성공적으로 개척되었습니다!');
        resetFormStates();
        onClose();
      },
    });
  };

  const handleMemberItemClick = (memberName) => {
    setSelectedMembers((prevSelectedMembers) => {
      if (prevSelectedMembers.includes(memberName)) {
        return prevSelectedMembers.filter((name) => name !== memberName);
      } else {
        return [...prevSelectedMembers, memberName];
      }
    });
  };

  const handleCloseClick = () => {
    resetFormStates();
    onClose();
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const maxDate = tomorrow.toISOString().split('T')[0];

  if (isLoadingMembers)
    return (
      <div className='modal-overlay'>
        <div className='modal-content'>멤버 목록 로딩 중...</div>
      </div>
    );
  if (membersError)
    return (
      <div className='modal-overlay'>
        <div className='modal-content' style={{ color: 'red' }}>
          멤버 목록 로드 오류: {membersError.message}
        </div>
      </div>
    );

  return (
    <div className='modal-overlay' onClick={handleCloseClick}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <h2>{!initialRestaurant ? '라멘 로드 개척' : '여기를 또 갔어?'}</h2>
        <form onSubmit={handleSubmit}>
          {!initialRestaurant ? (
            <>
              {/* 라멘집 이름 입력 필드 */}
              <div className='form-group'>
                <label htmlFor='name'>라멘집 이름:</label>
                <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              {/* 라멘집 위치 입력 필드 */}
              <div className='form-group'>
                <label htmlFor='location'>위치:</label>
                <input type='text' id='location' value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>

              {/* 라멘집 이미지 파일 업로드 필드 */}
              <div className='form-group'>
                <label htmlFor='bannerImage'>라멘집 메인 사진:</label>
                <input
                  type='file'
                  id='bannerImage'
                  name='bannerImage'
                  accept='image/*'
                  onChange={(e) => setBannerImageFile(e.target.files?.[0])}
                />
                {bannerImageFile && <p style={{ fontSize: '12px', color: '#666' }}>선택된 파일: {bannerImageFile.name}</p>}
                {!bannerImageFile && <p style={{ fontSize: '12px', color: '#999' }}>파일 미선택 시 기본 이미지가 사용됩니다.</p>}
              </div>

              {/* 태그 선택 필드*/}
              <div className='form-group'>
                <label>태그 선택:</label>
                <CardTags onSelectTags={setSelectedTags} initialSelectedTags={selectedTags} />
              </div>
            </>
          ) : (
            <>
              <div className='revisit-info-display'>
                <h3>재방문 식당: {initialRestaurant.name}</h3>
                <p>
                  <i className='fas fa-map-marker-alt'></i>
                  {initialRestaurant.location}
                </p>
                {initialRestaurant.bannerImageUrl && (
                  <ImageWithWebp src={initialRestaurant.bannerImageUrl} className='revisit-modal-img' alt={initialRestaurant.name} />
                )}
              </div>
            </>
          )}

          {/* 라멘집 방문 일자 입력 필드*/}
          <div className='form-group'>
            <label htmlFor='visitDate'>방문 날짜:</label>
            <input type='date' id='visitDate' value={visitDate} onChange={(e) => setVisitDate(e.target.value)} max={maxDate} required />
          </div>

          {/* 함께 방문한 멤버 입력 필드*/}
          <div className='form-group'>
            <label>함께 방문한 멤버:</label>
            <div className='members-checkbox-group'>
              {members?.map((member) => (
                <>
                  <div
                    key={member._id}
                    className={`member-checkbox-item ${selectedMembers.includes(member.name) ? 'selected' : ''}`}
                    onClick={() => handleMemberItemClick(member.name)}
                  >
                    <input
                      type='checkbox'
                      id={`member-${member._id}`}
                      value={member.name}
                      checked={selectedMembers.includes(member.name)}
                      readOnly
                      style={{ display: 'none' }}
                    />
                    <UserProfileImage user={member} size={34} />
                    <span htmlFor={`member-${member._id}`}>{member.name}</span>
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className='modal-actions'>
            <button type='submit' disabled={addVisitedRamenMutation.isPending}>
              {addVisitedRamenMutation.isPending ? '추가 중...' : initialRestaurant ? '재방문 기록하기' : '개척하기'}
            </button>
            <button type='button' onClick={handleCloseClick} disabled={addVisitedRamenMutation.isPending}>
              닫기
            </button>
          </div>
          {addVisitedRamenMutation.isError && (
            <p style={{ color: 'red', marginTop: '10px' }}>오류: {addVisitedRamenMutation.error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddVisitedRamenModal;
