import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  return response.data.plannedRamen;
};

// 8. 모든 방문 예정 라멘집 조회
export const getPlannedRamenRestaurants = async () => {
  const response = await api.get('/api/planned-ramen');
  return response.data;
};

// 9. 모든 방문 예정 라멘집 조회
export const getPlannedRamenRestaurantById = async (restaurantId) => {
  const response = await api.get(`/api/planned-ramen/${restaurantId}`);
  return response.data;
};

// 10. 모든 방문 예정 라멘집 조회
export const deleteVisitedRamenRestaurantById = async (restaurantId) => {
  const response = await api.delete(`/api/visited-ramen/${restaurantId}`);
  return response.data;
};

// 11. 모든 방문 예정 라멘집 조회
export const deletePlannedRamenRestaurantById = async (restaurantId) => {
  const response = await api.delete(`/api/planned-ramen/${restaurantId}`);
  return response.data;
};
