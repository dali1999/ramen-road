import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserProfileImage from '@components/common/UserProfileImage';
import { useAuth } from '@context/AuthContext';
import { useJoinSchedule, useLeaveSchedule } from '@hooks/useRamen';

import './RecommendedRamenCard.css';
import './VoteCard.css';
import ImageWithWebp from '@components/common/ImageWebp';

const VoteCard = ({ schedule }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 현재 로그인한 유저 정보
  const joinScheduleMutation = useJoinSchedule(); // 일정 참여 뮤테이션 훅
  const leaveScheduleMutation = useLeaveSchedule(); // 일정 나가기 뮤테이션 훅

  if (!schedule || !schedule.plannedRamenId || !schedule.organizer) {
    return <div className='vote-card-error'>일정 정보를 불러올 수 없습니다.</div>;
  }

  const plannedRamen = schedule.plannedRamenId;
  const organizer = schedule.organizer;
  const participants = schedule.participants || [];

  // 현재 유저가 참여자인지 확인
  const isUserParticipant = user.member && participants?.some((p) => p.member && p.member._id === user.member._id);

  const handleCardClick = (id) => {
    console.log('일정 카드 클릭:', id);
  };

  const handleJoinClick = async (e) => {
    e.stopPropagation();
    if (!user.member) {
      alert('로그인해야 일정에 참여할 수 있습니다.');
      navigate('/login');
      return;
    }
    await joinScheduleMutation.mutateAsync(schedule._id);
  };

  const handleLeaveClick = async (e) => {
    e.stopPropagation();
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
      {/* {canDelete && <div className='delete-button'>권한</div>} */}
      <div className='vote-card-header'>
        <h3>{schedule.title}</h3>
        <div className='schedule-datetime'>
          <span>📅</span>
          <span>
            {new Date(schedule.dateTime).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
      <div className='vote-card-content'>
        <div className='ramen-info-summary'>
          <ImageWithWebp src={plannedRamen.bannerImageUrl} className='ramen-thumb' alt={plannedRamen.name} />

          <div className='ramen-details'>
            <h4>{plannedRamen.name}</h4>
            <p className='location'>{plannedRamen.location}</p>
          </div>
        </div>
        <span className='organizer-info'>
          주최: <UserProfileImage user={organizer} size={36} /> {organizer.name}
        </span>
        {schedule.specialNotes && <p className='special-notes'>{schedule.specialNotes}</p>}

        <div className='participants-section'>
          <div className='participants-count'>
            참여자<span>{participants.length}</span>명
          </div>
          <div className='participants-avatars'>
            {participants?.map((p, index) => (
              <div key={p?.member?._id} className='participant-avatar-wrapper' style={{ zIndex: participants.length + index }}>
                <UserProfileImage user={p.member} size={44} />
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
        {!user?.member && (
          <span className='login-prompt'>
            <Link to='/login'>로그인</Link>하여 참여
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
