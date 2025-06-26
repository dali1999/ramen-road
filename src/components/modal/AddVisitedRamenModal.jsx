import React, { useCallback, useEffect, useState } from 'react';
import { useAddVisitedRamen, useMembers, useUpdateVisitedRamen } from '@hooks/useRamen';
import CardTags from '@components/common/CardTags';
import { useAuth } from '@context/AuthContext';

import './AddVisitedRamenModal.css';
import UserProfileImage from '@components/common/UserProfileImage';
import ImageWithWebp from '@components/common/ImageWebp';

const AddVisitedRamenModal = ({ initialRestaurant = null, isOpen, onClose, isEditMode = false }) => {
  const { user } = useAuth();
  const { data: members, isLoading: isLoadingMembers, error: membersError } = useMembers();
  const addVisitedRamenMutation = useAddVisitedRamen();
  const updateVisitedRamenMutation = useUpdateVisitedRamen();
  console.log(initialRestaurant?.images);

  // --- 폼 상태 관리 ---
  const [name, setName] = useState(initialRestaurant ? initialRestaurant.name : '');
  const [location, setLocation] = useState(initialRestaurant ? initialRestaurant.location : '');
  const [visitDate, setVisitDate] = useState('');
  const [bannerImageFile, setBannerImageFile] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedTags, setSelectedTags] = useState([user?.member?.name || null]);

  const [currentDisplayedImages, setCurrentDisplayedImages] = useState([]);

  const resetFormStates = useCallback(() => {
    setName(initialRestaurant ? initialRestaurant.name : '');
    setLocation(initialRestaurant ? initialRestaurant.location : '');
    setVisitDate('');
    setBannerImageFile(null);
    setSelectedMembers([user?.member?.name || null].filter(Boolean));
    setSelectedTags(initialRestaurant && initialRestaurant.tags ? [...initialRestaurant.tags] : []);
    setCurrentDisplayedImages(initialRestaurant && initialRestaurant.images ? [...initialRestaurant.images] : []);
  }, [initialRestaurant, user?.member?.name]);

  useEffect(() => {
    if (isOpen) {
      resetFormStates();
    }
  }, [initialRestaurant, isOpen, resetFormStates]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      handleEditSubmit();
    } else {
      handleAddOrRevisitSubmit();
    }
  };

  const handleAddOrRevisitSubmit = () => {
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

  // ✨ 추가: 수정 모드 제출 핸들러 (PATCH /api/visited-ramen/:id) ✨
  const handleEditSubmit = () => {
    const formData = new FormData();
    let hasChanges = false;

    if (name !== initialRestaurant.name) {
      formData.append('name', name);
      hasChanges = true;
    }
    if (location !== initialRestaurant.location) {
      formData.append('location', location);
      hasChanges = true;
    }

    if (JSON.stringify(selectedTags) !== JSON.stringify(initialRestaurant.tags)) {
      formData.append('tags', JSON.stringify(selectedTags));
      hasChanges = true;
    }
    // ✨ 이미지 파일 변경 (단일 파일) ✨
    if (bannerImageFile) {
      // 새 파일이 선택된 경우
      formData.append('bannerImage', bannerImageFile); // ✨ 백엔드의 Multer 필드 이름 (upload.single) ✨
      hasChanges = true;
    }

    // ✨ 기존 이미지 URL 목록을 함께 보냅니다. ✨
    // 백엔드에서 어떤 이미지를 유지하고 어떤 이미지를 삭제할지 판단하기 위함입니다.
    formData.append('keptImages', JSON.stringify(currentDisplayedImages));

    if (!hasChanges) {
      alert('변경할 내용이 없습니다.');
      onClose();
      return;
    }

    updateVisitedRamenMutation.mutate(
      // ✨ useUpdateVisitedRamen 훅 사용 ✨
      {
        restaurantId: initialRestaurant._id,
        payload: formData,
      },
      {
        onSuccess: () => {
          alert('라멘집 정보가 성공적으로 업데이트되었습니다!');
          onClose();
        },
        onError: (error) => {
          alert(`라멘집 정보 업데이트 실패: ${error.response?.data?.message || error.message}`);
        },
      },
    );
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

  if (!user.member)
    return (
      <div className='modal-overlay' onClick={onClose}>
        <div className='modal-content'>방문 라멘집을 추가하려면 로그인해야 합니다</div>
      </div>
    );

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
        <h2>
          {isEditMode
            ? `[${initialRestaurant?.name}] 정보 수정`
            : initialRestaurant
              ? `[${initialRestaurant?.name}] 재방문 기록`
              : '라멘 로드 개척'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* 이름, 위치 필드는 생성/수정 모드에 따라 다르게 렌더링 */}
          {isEditMode || !initialRestaurant ? ( // 수정 모드이거나 첫 방문(initialRestaurant 없음)일 때
            <>
              <div className='form-group'>
                <label htmlFor='name'>라멘집 이름:</label>
                <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className='form-group'>
                <label htmlFor='location'>위치:</label>
                <input type='text' id='location' value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              {/* 이미지 파일 업로드 필드 (생성 또는 수정 시) */}
              <div className='form-group'>
                <label htmlFor='bannerImage'>라멘집 메인 사진 (선택 사항):</label>
                <input
                  type='file'
                  id='bannerImage'
                  name={isEditMode ? 'bannerImage' : 'images'} // ✨ 변경: isEditMode에 따라 name 속성 변경 ✨
                  accept='image/*'
                  multiple={isEditMode ? false : false} // ✨ 변경: 수정 모드에서는 단일 파일만 허용 (upload.single에 맞춰) ✨
                  onChange={(e) => setBannerImageFile(e.target.files?.[0])} // ✨ 변경: 단일 파일만 받음 ✨
                />
                {/* 현재/선택된 파일 정보 표시 */}
                {bannerImageFile && <p style={{ fontSize: '12px', color: '#666' }}>선택된 파일: {bannerImageFile.name}</p>}

                {!bannerImageFile && (!initialRestaurant || (initialRestaurant.images && initialRestaurant.images.length === 0)) && (
                  <p style={{ fontSize: '12px', color: '#999' }}>파일 미선택 시 기본 이미지가 사용됩니다.</p>
                )}
              </div>
            </>
          ) : (
            // 재방문일 때는 식당 정보 표시 (입력 불가)
            <div className='revisit-info-display'>
              <h3>재방문 식당: {initialRestaurant.name}</h3>
              <p>위치: {initialRestaurant.location}</p>
              {initialRestaurant.images && initialRestaurant.images.length > 0 && (
                <ImageWithWebp src={initialRestaurant.images[0]} alt={initialRestaurant.name} className='revisit-modal-img' />
              )}
            </div>
          )}

          {/* 태그 선택 필드 (항상 표시) */}

          <div className='form-group'>
            <label>태그 선택:</label>
            <CardTags onSelectTags={setSelectedTags} initialSelectedTags={selectedTags} />
          </div>

          {/* 방문 날짜와 멤버는 수정 모드에서는 사용하지 않음 */}
          {!isEditMode && (
            <>
              <div className='form-group'>
                <label htmlFor='visitDate'>방문 날짜:</label>
                <input type='date' id='visitDate' value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required max={maxDate} />
              </div>

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
                        <UserProfileImage user={member} size={30} />
                        <span htmlFor={`member-${member._id}`}>{member.name}</span>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className='modal-actions'>
            <button type='submit' disabled={updateVisitedRamenMutation.isPending || addVisitedRamenMutation.isPending}>
              {isEditMode
                ? updateVisitedRamenMutation.isPending
                  ? '저장 중...'
                  : '정보 저장'
                : addVisitedRamenMutation.isPending
                  ? '추가 중...'
                  : initialRestaurant
                    ? '재방문 기록하기'
                    : '개척하기'}
            </button>
            <button
              type='button'
              onClick={handleCloseClick}
              disabled={updateVisitedRamenMutation.isPending || addVisitedRamenMutation.isPending}
            >
              닫기
            </button>
          </div>
          {(updateVisitedRamenMutation.isError || addVisitedRamenMutation.isError) && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              오류: {updateVisitedRamenMutation.error?.message || addVisitedRamenMutation.error?.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddVisitedRamenModal;
