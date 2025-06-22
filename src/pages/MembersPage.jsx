import { useMembers } from '@hooks/useRamen';
import UserProfileImage from '@components/common/UserProfileImage';
import './MembersPage.css';

const MembersPage = () => {
  const { data: members, isLoading, error } = useMembers();

  if (isLoading) return <div className='loading-message'>👥 멤버 정보를 불러오는 중...</div>;
  if (error) return <div className='error-message'>😔 오류가 발생했어요: {error.message}</div>;
  if (!members || members.length === 0) return <div className='not-found-message'>등록된 멤버가 없습니다.</div>;

  return (
    <div className='members-page-container'>
      <h2 className='page-title'>맨즈들</h2>

      <div className='members-grid'>
        {members.map((member) => (
          <div key={member._id} className='member-card'>
            <UserProfileImage user={member} size={100} />
            <div className='member-wrapper'>
              <h3 className='member-name'>{member.name}</h3>
              {/* <p className='member-nickname'>@{member.nickname || '닉네임 없음'}</p> */}
            </div>
            <p className='member-email'>@{member.nickname || '닉네임 없음'}</p>
            {/* {member.role === 'admin' && <span className='member-role admin'>관리자</span>} */}
            {member.createdAt && <p className='member-joined'>가입일: {new Date(member.createdAt).toLocaleDateString('ko-KR')}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersPage;
