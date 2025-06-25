import React, { useState } from 'react';
import { useCreateSchedule, usePlannedRamenRestaurants, useMembers } from '@hooks/useRamen';
import { useAuth } from '@context/AuthContext';
import './CreateScheduleModal.css';

const CreateScheduleModal = ({ isOpen, onClose }) => {
  const { data: plannedRamenList, isLoading: isLoadingPlanned, error: plannedError } = usePlannedRamenRestaurants();
  const { user } = useAuth(); // 현재 로그인한 사용자 정보 (주최자)
  const createScheduleMutation = useCreateSchedule();

  const [selectedPlannedRamenId, setSelectedPlannedRamenId] = useState('');
  const [scheduleTitle, setScheduleTitle] = useState('');
  const [scheduleDateTime, setScheduleDateTime] = useState(''); // YYYY-MM-DDTHH:mm
  const [specialNotes, setSpecialNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPlannedRamenId || !scheduleTitle || !scheduleDateTime) {
      alert('모든 필수 항목을 입력해주세요: 라멘집, 제목, 일자 및 시간');
      return;
    }

    const selectedDateTimeObj = new Date(scheduleDateTime);

    // 날짜/시간 형식 검증 (선택 사항)
    const now = new Date();
    const selectedDate = new Date(scheduleDateTime);
    if (selectedDate < now) {
      alert('과거 시간으로는 일정을 잡을 수 없습니다.');
      return;
    }

    await createScheduleMutation.mutateAsync(
      {
        plannedRamenId: selectedPlannedRamenId,
        title: scheduleTitle,
        dateTime: selectedDateTimeObj.toISOString(),
        specialNotes,
      },
      {
        onSuccess: () => {
          setSelectedPlannedRamenId('');
          setScheduleTitle('');
          setScheduleDateTime('');
          setSpecialNotes('');
          onClose();
        },
        onError: (error) => {
          console.error('일정 생성 모달 오류:', error);
        },
      },
    );
  };

  if (isLoadingPlanned)
    return (
      <div className='modal-overlay'>
        <div className='modal-content'>추천 라멘집 목록 로딩 중...</div>
      </div>
    );
  if (plannedError)
    return (
      <div className='modal-overlay'>
        <div className='modal-content' style={{ color: 'red' }}>
          추천 라멘집 로드 오류: {plannedError.message}
        </div>
      </div>
    );
  if (!user.member)
    return (
      <div className='modal-overlay'>
        <div className='modal-content' style={{ color: 'red' }}>
          일정을 생성하려면 로그인해야 합니다.
        </div>
      </div>
    );

  return (
    <div className='modal-overlay' onClick={onClose}>
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <h2>라멘로드 일정 잡기</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='plannedRamen'>어디 라멘집으로 갈까요?</label>
            <select id='plannedRamen' value={selectedPlannedRamenId} onChange={(e) => setSelectedPlannedRamenId(e.target.value)} required>
              <option value=''>추천 라멘집 선택</option>
              {plannedRamenList?.map((ramen) => (
                <option key={ramen._id} value={ramen._id}>
                  {ramen.name} ({ramen.location})
                </option>
              ))}
            </select>
          </div>

          <div className='form-group'>
            <label htmlFor='title'>일정 제목:</label>
            <input
              type='text'
              id='title'
              value={scheduleTitle}
              onChange={(e) => setScheduleTitle(e.target.value)}
              placeholder="예: '이번 주 라멘팟'"
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='dateTime'>언제 만날까요?</label>
            <input
              type='datetime-local' // 날짜와 시간 모두 선택 가능
              id='dateTime'
              value={scheduleDateTime}
              onChange={(e) => setScheduleDateTime(e.target.value)}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='specialNotes'>특이사항 (선택 사항):</label>
            <textarea
              id='specialNotes'
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              rows='3'
              placeholder="예: 'OOO역 3번 출구 앞에서 모이자', '선착순 5명!'"
            ></textarea>
          </div>

          <div className='modal-actions'>
            <button type='submit' disabled={createScheduleMutation.isPending}>
              {createScheduleMutation.isPending ? '생성 중...' : '일정 확정!'}
            </button>
            <button type='button' onClick={onClose} disabled={createScheduleMutation.isPending}>
              닫기
            </button>
          </div>
          {createScheduleMutation.isError && (
            <p style={{ color: 'red', marginTop: '10px' }}>오류: {createScheduleMutation.error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateScheduleModal;
