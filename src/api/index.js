import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response, // 성공적인 응답은 그대로 전달
  async (error) => {
    const originalRequest = error.config;

    // 토큰이 없거나, 만료되었거나, 유효하지 않거나, 권한이 없음을 의미합니다.
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; // 무한 루프 방지

      // 강제 로그아웃 로직을 실행합니다.
      localStorage.removeItem('token');
      localStorage.removeItem('member');

      alert('세션이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.');
      window.location.href = '/login';

      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// --- API 함수 정의 ---

// 1. 멤버 추가
export const addMember = async (payload) => {
  const response = await api.post('/api/members', payload);
  return response.data.member;
};

// 2.1 모든 멤버 조회
export const getMembers = async () => {
  const response = await api.get('/api/members');
  return response.data;
};

// 2.2 내 정보 조회
export const getMyProfile = async () => {
  const response = await api.get('/api/members/me');
  return response.data;
};

// 2.3 내 정보 수정
export const updateMyProfile = async (payload) => {
  const response = await api.patch('/api/members/me', payload);
  return response.data;
};

// 3. 방문한 라멘집 추가
export const addVisitedRamen = async (payload) => {
  const response = await api.post('/api/visited-ramen', payload);
  return response.data.restaurant;
};

// 4. 모든 방문 라멘집 조회
export const getVisitedRamenRestaurants = async () => {
  const response = await api.get('/api/visited-ramen');
  return response.data;
};

// 5. 특정 라멘집 상세 조회
export const getVisitedRamenRestaurantById = async (restaurantId) => {
  const response = await api.get(`/api/visited-ramen/${restaurantId}`);
  return response.data;
};

// 6. 멤버별 라멘집 별점 및 후기 추가/수정
export const updateMemberRatingAndReview = async (restaurantId, visitCount, memberName, payload) => {
  const response = await api.patch(`/api/visited-ramen/${restaurantId}/visits/${visitCount}/members/${memberName}/rating`, payload);
  return response.data.restaurant;
};

// 7. 방문 예정 라멘집 추가
export const addPlannedRamen = async (payload) => {
  const response = await api.post('/api/planned-ramen', payload);
  return response.data;
};

// 8. 모든 방문 예정 라멘집 조회
export const getPlannedRamenRestaurants = async () => {
  const response = await api.get('/api/planned-ramen');
  return response.data;
};

// 9. 방문 예정 라멘집 조회 (id)
export const getPlannedRamenRestaurantById = async (restaurantId) => {
  const response = await api.get(`/api/planned-ramen/${restaurantId}`);
  return response.data;
};

// 10. 라멘집 삭제 (id)
export const deleteVisitedRamenRestaurantById = async (restaurantId) => {
  const response = await api.delete(`/api/visited-ramen/${restaurantId}`);
  return response.data;
};

// 11. 방문 예정 라멘집 삭제 (id)
export const deletePlannedRamenRestaurantById = async (restaurantId) => {
  const response = await api.delete(`/api/planned-ramen/${restaurantId}`);
  return response.data;
};

// 12. 멤버 삭제 (id)
export const deleteMemberById = async (memberId) => {
  const response = await api.delete(`/api/members/${memberId}`);
  return response.data;
};

// ✨ 추가: 라멘집 이미지 업데이트 API 함수 ✨
// payload는 FormData가 될 것입니다.
export const updateRamenImages = async (restaurantId, payload) => {
  const response = await api.patch(`/api/visited-ramen/${restaurantId}/images`, payload);
  return response.data;
};

// ✨ 추가: 라멘집 이미지 조회 API 함수 ✨
export const getRamenImages = async (restaurantId) => {
  const response = await api.get(`/api/visited-ramen/${restaurantId}/images`);
  return response.data;
};
