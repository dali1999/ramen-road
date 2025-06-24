// src/pages/ProfilePage.js

import { useAuth } from '@context/AuthContext';
import { useMyProfile, useDeleteMember, useUpdateMyProfile } from '@hooks/useRamen';
import { useNavigate } from 'react-router-dom';
import UserProfileImage from '@components/common/UserProfileImage';
import { useEffect, useState } from 'react';
import ImageWithWebp from '@components/common/ImageWebp';
import './MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { data: myProfile, isLoading, error, refetch } = useMyProfile();
  const deleteMemberMutation = useDeleteMember();
  const updateMyProfileMutation = useUpdateMyProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImageFile, setProfileImageFile] = useState(null);

  useEffect(() => {
    if (myProfile?.myInfo) {
      setName(myProfile.myInfo.name || '');
      setNickname(myProfile.myInfo.nickname || '');
    }
  }, [myProfile]);

  const handleDeleteAccount = () => {
    if (!user.member) {
      alert('로그인 정보가 없습니다.');
      return;
    }
    if (window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      deleteMemberMutation.mutate(user.member._id, {
        onSuccess: () => {
          navigate('/register');
        },
      });
    }
  };

  const handleLogoutButtonClick = () => {
    logout();
    navigate('/login');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    let hasChanges = false;
    if (name !== myProfile.myInfo.name) {
      formData.append('name', name);
      hasChanges = true;
    }
    if (nickname !== myProfile.myInfo.nickname) {
      formData.append('nickname', nickname);
      hasChanges = true;
    }
    if (profileImageFile) {
      formData.append('profileImage', profileImageFile);
      hasChanges = true;
    }
    if (!hasChanges) {
      alert('변경할 내용이 없습니다.');
      setIsEditing(false);
      return;
    }

    try {
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }
      await updateMyProfileMutation.mutateAsync(formData);
      setIsEditing(false);
      setProfileImageFile(null);
      refetch();
    } catch (err) {
      console.error('회원 정보 수정 실패:', err);
    }
  };

  if (!user.member) return <div className='profile-loading-message'>로그인이 필요합니다.</div>;
  if (isLoading) return <div className='profile-loading-message'>내 정보를 불러오는 중...</div>;
  if (error) return <div className='profile-error-message'>내 정보 로드 오류: {error.message}</div>;
  if (!myProfile) return <div className='profile-not-found-message'>내 정보를 찾을 수 없습니다.</div>;

  const { myInfo, stats, myVisitedRamen, myRecommendedRamen } = myProfile;

  return (
    <div className='profile-container'>
      <section className='profile-header-section'>
        <div className='profile-image'>
          <UserProfileImage user={myInfo} size={100} />
        </div>
        {isEditing ? (
          <form onSubmit={handleUpdateSubmit} className='profile-edit-form'>
            <div className='form-group'>
              <label htmlFor='edit-name'>이름:</label>
              <input type='text' id='edit-name' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='form-group'>
              <label htmlFor='edit-nickname'>닉네임:</label>
              <input type='text' id='edit-nickname' value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
            <div className='form-group'>
              <label htmlFor='edit-profile-image'>새 프로필 이미지:</label>
              <input type='file' id='edit-profile-image' accept='image/*' onChange={(e) => setProfileImageFile(e.target.files?.[0])} />
              {profileImageFile && <p style={{ fontSize: '12px', color: '#666' }}>선택된 파일: {profileImageFile.name}</p>}
            </div>
            <div className='profile-actions'>
              <button type='submit' disabled={updateMyProfileMutation.isPending}>
                {updateMyProfileMutation.isPending ? '저장 중...' : '정보 저장'}
              </button>
              <button
                type='button'
                onClick={() => {
                  setIsEditing(false);
                  setProfileImageFile(null);
                  setName(myProfile.myInfo.name);
                  setNickname(myProfile.myInfo.nickname);
                }}
                disabled={updateMyProfileMutation.isPending}
              >
                취소
              </button>
            </div>
            {updateMyProfileMutation.isError && <p className='error-message'>{updateMyProfileMutation.error.message}</p>}
          </form>
        ) : (
          <>
            <h2 className='profile-name'>
              {myInfo.name}
              {myInfo.nickname && `(${myInfo.nickname})`}
            </h2>
            <p className='profile-email'>{myInfo.email}</p>

            <div className='profile-actions'>
              <button onClick={() => setIsEditing(true)} className='edit-profile-button'>
                정보 수정
              </button>
              <button onClick={handleLogoutButtonClick} className='delete-account-button'>
                로그아웃
              </button>
            </div>
          </>
        )}
      </section>

      <section className='profile-stats-section'>
        <h3>나의 활동 요약</h3>
        <div className='stats-grid'>
          <div className='stat-item'>
            <span className='stat-value'>{stats.totalParticipatedVisits}</span>
            <span className='stat-label'>총 라멘집 방문 횟수</span>
          </div>
          <div className='stat-item'>
            <span className='stat-value'>{stats.totalRecommendedRamen}</span>
            <span className='stat-label'>총 추천 라멘집</span>
          </div>
        </div>
      </section>

      <section className='profile-visited-ramen-section'>
        <h3>내가 방문한 라멘집들</h3>
        {myVisitedRamen.length === 0 ? (
          <p className='no-data-message'>아직 방문한 라멘집이 없어요.</p>
        ) : (
          <div className='ramen-list-grid'>
            {myVisitedRamen.map((restaurant) => (
              <div key={restaurant._id} className='ramen-item-card' onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
                <ImageWithWebp src={restaurant.bannerImageUrl} className='ramen-item-img' alt={restaurant.name} />

                <div className='ramen-item-info'>
                  <h4>{restaurant.name}</h4>
                  <p>{restaurant.location}</p>
                  <p className='ramen-item-overall-rating'>평균 별점: {restaurant.overallRatingAverage.toFixed(1)}</p>
                  <div className='my-visits-summary'>
                    <h5>나의 방문 기록 ({restaurant.myVisits.length}회)</h5>
                    <ul>
                      {console.log(restaurant)}
                      {restaurant.myVisits.map((myVisit) => (
                        <li key={myVisit.visit_count}>
                          #{myVisit.visit_count}차 방문 ({new Date(myVisit.visit_date).toLocaleDateString('ko-KR')})
                          <br />
                          별점: {myVisit.myRating !== null ? `${myVisit.myRating}점` : '미등록'}
                          <br />
                          후기: {myVisit.myReviewText || '후기 없음'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className='profile-recommended-ramen-section'>
        <h3>내가 추천한 라멘집들</h3>
        {myRecommendedRamen.length === 0 ? (
          <p className='no-data-message'>아직 추천한 라멘집이 없어요.</p>
        ) : (
          <div className='ramen-list-grid'>
            {myRecommendedRamen.map((ramen) => (
              <div key={ramen._id} className='ramen-item-card'>
                <ImageWithWebp src={ramen.bannerImageUrl} className='ramen-item-img' alt={ramen.name} />
                <div className='ramen-item-info'>
                  <h4>{ramen.name}</h4>
                  <p>{ramen.location}</p>
                  <p className='ramen-item-comment'>내 멘트: "{ramen.recommendationComment || '멘트 없음'}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <button onClick={handleDeleteAccount} disabled={deleteMemberMutation.isPending} className='delete-account-button'>
        {deleteMemberMutation.isPending ? '삭제 중...' : '계정 삭제'}
      </button>
    </div>
  );
};

export default MyPage;
