import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register, login } from '../api/auth';
import { useEffect, useState } from 'react';

// --- 멤버 관련 훅 ---
export const useAuth = () => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedMember = localStorage.getItem('member');
    if (storedToken && storedMember) {
      try {
        const parsedMember = JSON.parse(storedMember);
        setUser({ member: parsedMember, token: storedToken });
      } catch (e) {
        console.error('Failed to parse stored member data:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('member');
      }
    }
  }, []);

  // --- 회원가입 뮤테이션 훅 ---
  const registerMutation = useMutation({
    mutationFn: (payload) => register(payload),
    onSuccess: (data) => {
      alert(data.message || '회원가입 성공!');
    },
    onError: (error) => {
      alert(`회원가입 실패: ${error.response?.data?.message || error.message}`);
    },
  });

  // --- 로그인 뮤테이션 훅 ---
  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);
      // 로그인 성공 시 JWT 토큰과 사용자 정보를 localStorage에 저장
      localStorage.setItem('token', data.token);
      localStorage.setItem('member', JSON.stringify(data.member));
      setUser({ member: data.member, token: data.token }); // React 상태 업데이트
      alert(data.message || '로그인 성공!');
      // 로그인 성공 후 캐시된 모든 쿼리 무효화 (예: 인증 필요한 데이터)
      queryClient.invalidateQueries(); // 모든 쿼리 무효화
    },
    onError: (error) => {
      alert(`로그인 실패: ${error.response?.data?.message || error.message}`);
    },
  });

  // --- 로그아웃 함수 ---
  const logout = () => {
    localStorage.removeItem('token'); // localStorage에서 토큰 삭제
    localStorage.removeItem('member'); // localStorage에서 사용자 정보 삭제
    setUser({ member: null, token: null }); // React 상태 초기화
    queryClient.clear(); // React Query 캐시 비우기
    alert('로그아웃 되었습니다.');
  };

  return {
    user, // 현재 로그인한 사용자 정보 (member, token)
    register: registerMutation.mutate, // 회원가입 함수
    login: loginMutation.mutate, // 로그인 함수
    logout, // 로그아웃 함수
    isLoadingAuth: registerMutation.isPending || loginMutation.isPending, // 인증 관련 로딩 상태
    authError: registerMutation.error || loginMutation.error, // 인증 관련 에러
  };
};
