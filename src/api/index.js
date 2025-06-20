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

// 6. 멤버별 라멘집 별점 및 후기 추가/수정
export const updateMemberRatingAndReview = async (restaurantId, visitCount, memberName, payload) => {
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
