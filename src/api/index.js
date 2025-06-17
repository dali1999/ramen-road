import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // 1. localStorage에서 JWT 토큰을 가져옵니다.
    // 'token'은 로그인 성공 시 `localStorage.setItem('token', data.token)`으로 저장한 키입니다.
    const token = localStorage.getItem('token');

    // 2. 토큰이 존재하면 요청 헤더에 'Authorization' 필드를 추가합니다.
    // 'Bearer '는 JWT 토큰을 전송할 때 사용되는 표준 접두사입니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// --- API 함수 정의 ---

// 1. 멤버 추가
export const addMember = async (payload) => {
  const response = await api.post('/api/members', payload);
  return response.data.member;
};

// 2. 모든 멤버 조회
export const getMembers = async () => {
  const response = await api.get('/api/members');
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

// 6. 멤버별 라멘집 별점 추가/수정
export const updateMemberRating = async (restaurantId, visitCount, memberName, payload) => {
  const response = await api.patch(`/api/visited-ramen/${restaurantId}/visits/${visitCount}/members/${memberName}/rating`, payload);
  return response.data.restaurant;
};

// 7. 방문 예정 라멘집 추가
export const addPlannedRamen = async (payload) => {
  const response = await api.post('/api/planned-ramen', payload);
  console.log(response.data);
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
