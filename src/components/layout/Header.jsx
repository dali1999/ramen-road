import './Header.css';
import { useAuth } from '@context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserProfileImage from '@components/common/UserProfileImage';
import LogoIcon from '@assets/ramen-road-logo.png';
import ImageWithWebp from '../common/ImageWebp';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);

  const handleLoginButtonClick = () => {
    navigate(`/login`);
  };

  const handleRegisterButtonClick = () => {
    navigate(`/register`);
  };

  const handleHeaderClick = () => {
    navigate(`/`);
  };

  const handleProfileClick = () => {
    navigate(`/mypage`);
  };

  return (
    <header className='header'>
      {/* 로고 */}
      <div className='header-logo' onClick={handleHeaderClick}>
        <img src={LogoIcon} alt='로고 아이콘' />
        <h1 onClick={handleHeaderClick}>RAMEN ROAD</h1>
      </div>

      <div className='header-bottom-row'>
        {/* 메뉴 */}
        <ul className='header-menu-list'>
          <li onClick={() => navigate('/visited')}>라멘로드</li> {/* 클릭 시 메인 페이지로 */}
          <li onClick={() => navigate('/planning')}>일정 및 추천</li>
          <li onClick={() => navigate('/members')}>멤버들</li>
          <li onClick={() => navigate('/planning')}>공지</li>
        </ul>

        {/* 내 정보, 인증 부분 */}
        {user?.member ? (
          <div className='header-auth-section'>
            <div className='header-auth-user-info' onClick={handleProfileClick}>
              <UserProfileImage user={user.member} size={36} />
            </div>
          </div>
        ) : (
          <div className='header-auth-section'>
            <div className='header-auth-button login' onClick={handleLoginButtonClick}>
              로그인
            </div>
            <div className='header-auth-button register' onClick={handleRegisterButtonClick}>
              회원가입
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
