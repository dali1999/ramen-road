import React, { useState } from 'react';
import { useAddVisitedRamen, useMembers } from '@hooks/useRamen';
import './AddVisitedRamenModal.css';

const AddVisitedRamenModal = ({ isOpen, onClose }) => {
  const { data: members, isLoading: isLoadingMembers, error: membersError } = useMembers();
  const addVisitedRamenMutation = useAddVisitedRamen();

  const DEFAULT_BANNER_IMAGE =
    'https://us.123rf.com/450wm/eclaira/eclaira2302/eclaira230200005/198689430-ciotola-di-noodles-di-ramen-con-carne-di-maiale-e-uova-cibo-asiatico-illustrazione-vettoriale.jpg?ver=6';

  // --- 폼 상태 관리 ---
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]); // 선택된 멤버들의 이름

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !location || !visitDate || selectedMembers.length === 0) {
      alert('라멘집 이름, 위치, 방문 날짜, 멤버는 필수입니다!');
      return;
    }
    const membersPayload = selectedMembers.map((memberName) => ({ name: memberName }));
    const finalBannerImageUrl = bannerImageUrl.trim() === '' ? DEFAULT_BANNER_IMAGE : bannerImageUrl;
    addVisitedRamenMutation.mutate(
      {
        name,
        bannerImageUrl: finalBannerImageUrl,
        location,
        visitDate,
        members: membersPayload,
      },
      {
        onSuccess: () => {
          alert('새로운 라멘집 방문 기록이 성공적으로 추가되었습니다!');
          setName('');
          setLocation('');
          setVisitDate('');
          setBannerImageUrl('');
          setSelectedMembers([]);
          onClose(); // 모달 닫기
        },
        onError: (error) => {
          alert(`라멘집 추가 실패: ${error.response?.data?.message || error.message}`);
        },
      },
    );
  };

  const handleMemberCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedMembers((prevSelectedMembers) => {
      if (checked) {
        // 체크되면 배열에 추가
        return [...prevSelectedMembers, value];
      } else {
        // 체크 해제되면 배열에서 제거
        return prevSelectedMembers.filter((member) => member !== value);
      }
    });
  };

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
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <h2>라멘 로드 개척</h2>
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
            <label htmlFor='visitDate'>방문 날짜:</label>
            <input type='date' id='visitDate' value={visitDate} onChange={(e) => setVisitDate(e.target.value)} required />
          </div>

          <div className='form-group'>
            <label>함께 방문한 멤버:</label>
            <div className='members-checkbox-group'>
              {members?.map((member) => (
                <div key={member._id} className='member-checkbox-item'>
                  <input
                    type='checkbox'
                    id={`member-${member._id}`}
                    value={member.name} // 멤버 이름이 value로 들어갑니다.
                    checked={selectedMembers.includes(member.name)} // 선택 여부
                    onChange={handleMemberCheckboxChange}
                  />
                  <label htmlFor={`member-${member._id}`}>{member.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className='modal-actions'>
            <button type='submit' disabled={addVisitedRamenMutation.isPending}>
              {addVisitedRamenMutation.isPending ? '추가 중...' : '개척하기'}
            </button>
            <button type='button' onClick={onClose} disabled={addVisitedRamenMutation.isPending}>
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
