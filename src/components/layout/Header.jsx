import React from 'react';
import './Header.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLoginButtonClick = () => {
    navigate(`/login`);
  };

  const handleRegisterButtonClick = () => {
    navigate(`/register`);
  };

  return (
    <header className='header'>
      <h1>RAMEN ROAD</h1>
      {/* <p>한국의 모든 라멘을 먹어보자</p> */}

      {user?.member ? (
        <div className='auth-button logout' onClick={logout}>
          {user.member.name}님 로그아웃
        </div>
      ) : (
        <>
          <div className='auth-button login' onClick={handleLoginButtonClick}>
            로그인
          </div>
          <div className='auth-button register' onClick={handleRegisterButtonClick}>
            회원가입
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
