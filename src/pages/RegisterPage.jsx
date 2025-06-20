import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import './LoginPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoadingAuth, authError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('nickname', nickname);

    if (imageFile) {
      formData.append('profileImage', imageFile);
    }

    register(formData, {
      onSuccess: () => {
        alert('맨즈가 되셨습니다! 로그인해 주세요. 🥳');
        navigate('/login');
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
        alert(`회원가입 실패: ${errorMessage}`);
        console.error('회원가입 실패:', error.response?.data || error.message);
      },
    });
  };

  return (
    <div className='auth-container'>
      <div className='auth-form'>
        <h2>회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='register-name'>이름</label>
            <input type='text' id='register-name' value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label htmlFor='register-email'>이메일</label>
            <input type='email' id='register-email' value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label htmlFor='register-password'>비밀번호</label>
            <input
              type='password'
              id='register-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='register-nickname'>닉네임 (선택 사항)</label>
            <input type='text' id='register-nickname' value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>

          {/* 이미지 파일 업로드 필드 */}
          <div className='form-group'>
            <label htmlFor='profileImage'>프로필 이미지</label>
            <input type='file' id='profileImage' name='profileImage' accept='image/*' onChange={(e) => setImageFile(e.target.files?.[0])} />
            {imageFile && <p style={{ fontSize: '12px', color: '#666' }}>선택된 파일: {imageFile.name}</p>}
          </div>

          <button type='submit' disabled={isLoadingAuth}>
            {isLoadingAuth ? '가입 중...' : '회원가입'}
          </button>
          {authError && <p className='error-message'>{authError.message}</p>}
        </form>
        <p className='auth-switch'>
          이미 계정이 있으신가요? <Link to='/login'>로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
