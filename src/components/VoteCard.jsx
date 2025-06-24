import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileImage from '../components/common/UserProfileImage'; // 경로 수정
import { useAuth } from '../context/AuthContext';
import { useJoinSchedule, useLeaveSchedule } from '../hooks/useRamen'; // ✨ 추가: 참여/나가기 훅 ✨

import './RecommendedRamenCard.css'; // 라멘 카드 공통 스타일
import './VoteCard.css'; // ✨ VoteCard 전용 스타일 ✨

// VoteCard는 이제 schedule 객체를 직접 받습니다.
const VoteCard = ({ schedule }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 현재 로그인한 유저 정보
  const joinScheduleMutation = useJoinSchedule(); // 일정 참여 뮤테이션 훅
  const leaveScheduleMutation = useLeaveSchedule(); // 일정 나가기 뮤테이션 훅

  if (!schedule || !schedule.plannedRamenId || !schedule.organizer) {
    return <div className='vote-card-error'>일정 정보를 불러올 수 없습니다.</div>;
  }

  // schedule 객체에서 정보 추출
  const plannedRamen = schedule.plannedRamenId; // populate된 라멘집 정보
  const organizer = schedule.organizer; // populate된 주최자 정보
  const participants = schedule.participants || []; // 참여자 목록

  // 현재 유저가 참여자인지 확인
  const isUserParticipant = user.member && participants.some((p) => p.member._id === user.member._id);
  const isUserOrganizer = user.member && schedule.organizer._id === user.member._id;

  const handleCardClick = (id) => {
    // 상세 페이지가 있다면 해당 라우트로 이동
    // navigate(`/schedules/${id}`); // 예시: 일정 상세 페이지 라우트
    console.log('일정 카드 클릭:', id);
  };

  const handleJoinClick = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (!user.member) {
      alert('로그인해야 일정에 참여할 수 있습니다.');
      navigate('/login');
      return;
    }
    await joinScheduleMutation.mutateAsync(schedule._id);
  };

  const handleLeaveClick = async (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    if (!user.member) {
      alert('로그인해야 일정에서 나갈 수 있습니다.');
      return;
    }
    if (window.confirm('정말로 이 일정에서 나가시겠습니까?')) {
      await leaveScheduleMutation.mutateAsync(schedule._id);
    }
  };

  return (
    <div className='vote-card' onClick={() => handleCardClick(schedule._id)}>
      {' '}
      {/* ✨ 클래스 이름 변경 ✨ */}
      {/* 권한에 따른 삭제 버튼 (선택 사항, 관리자 또는 주최자만 삭제 가능하도록 할 수 있음) */}
      {/* {canDelete && <div className='delete-button'>권한</div>} */}
      <div className='vote-card-header'>
        <h3>{schedule.title}</h3>
        <p className='schedule-datetime'>
          {new Date(schedule.dateTime).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
      <div className='vote-card-content'>
        <div className='ramen-info-summary'>
          <img src={plannedRamen.bannerImageUrl} alt={plannedRamen.name} className='ramen-thumb' />
          <div className='ramen-details'>
            <h4>{plannedRamen.name}</h4>
            <p className='location'>{plannedRamen.location}</p>
          </div>
        </div>
        <p className='organizer-info'>
          주최: <UserProfileImage user={organizer} size={24} /> {organizer.name}
        </p>
        {schedule.specialNotes && <p className='special-notes'>특이사항: {schedule.specialNotes}</p>}

        <div className='participants-section'>
          <p className='participants-count'>참여자: {participants.length}명</p>
          <div className='participants-avatars'>
            {participants.map((p, index) => (
              <div key={p.member._id} className='participant-avatar-wrapper' style={{ zIndex: participants.length - index }}>
                <UserProfileImage user={p.member} size={30} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='vote-card-actions'>
        {user.member &&
          !isUserParticipant && ( // 로그인했고 참여자가 아닌 경우
            <button onClick={handleJoinClick} disabled={joinScheduleMutation.isPending}>
              {joinScheduleMutation.isPending ? '참여 중...' : '참여하기'}
            </button>
          )}
        {user.member &&
          isUserParticipant && ( // 로그인했고 참여자인 경우
            <button onClick={handleLeaveClick} disabled={leaveScheduleMutation.isPending} className='leave-button'>
              {leaveScheduleMutation.isPending ? '나가는 중...' : '나가기'}
            </button>
          )}
        {!user.member && (
          <span className='login-prompt'>
            <Link to='/login'>로그인</Link>하여 참여하세요!
          </span>
        )}
      </div>
      {(joinScheduleMutation.isError || leaveScheduleMutation.isError) && (
        <p className='error-message'>오류: {(joinScheduleMutation.error || leaveScheduleMutation.error).message}</p>
      )}
    </div>
  );
};

export default VoteCard;
