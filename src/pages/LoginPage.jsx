// src/pages/LoginPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // 스타일 시트 (추후 생성)

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoadingAuth, authError, user } = useAuth(); // useAuth 훅에서 login 함수와 상태 가져오기
  console.log(user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    login(
      { email, password },
      {
        onSuccess: () => {
          // 로그인 성공 시 메인 페이지로 이동 (RamenApp)
          navigate('/');
        },
      },
    );
  };

  // 이미 로그인되어 있다면 메인 페이지로 리다이렉트 (선택 사항)
  useEffect(() => {
    if (user && user.member && user.token) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className='auth-container'>
      <div className='auth-form'>
        <h2>로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='login-email'>이메일:</label>
            <input type='email' id='login-email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label htmlFor='login-password'>비밀번호:</label>
            <input type='password' id='login-password' value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type='submit' disabled={isLoadingAuth}>
            {isLoadingAuth ? '로그인 중...' : '로그인'}
          </button>
          {authError && <p className='error-message'>{authError.message}</p>}
        </form>
        <p className='auth-switch'>
          아직 맨즈가 아니신가요? <Link to='/register'>회원가입</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
