import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addMember,
  getMembers,
  addVisitedRamen,
  getVisitedRamenRestaurants,
  getVisitedRamenRestaurantById,
  updateMemberRatingAndReview,
  addPlannedRamen,
  getPlannedRamenRestaurants,
  getPlannedRamenRestaurantById,
  deleteVisitedRamenRestaurantById,
  deletePlannedRamenRestaurantById,
} from '../api';

// --- 멤버 관련 훅 ---
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });
};

export const useAddMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] }); // 멤버 목록 갱신
    },
    onError: (error) => {
      alert(`멤버 추가 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

// --- 방문한 라멘집 관련 훅 ---
export const useVisitedRamenRestaurants = () => {
  return useQuery({
    queryKey: ['visitedRamen'],
    queryFn: getVisitedRamenRestaurants,
  });
};

export const useVisitedRamenRestaurant = (restaurantId) => {
  return useQuery({
    queryKey: ['visitedRamen', restaurantId],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required.');
      }
      return getVisitedRamenRestaurantById(restaurantId);
    },
  });
};

export const useDeleteVisitedRamenRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVisitedRamenRestaurantById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitedRamen'] });
      alert('방문했던 라멘집이 성공적으로 삭제되었습니다!');
    },
    onError: (error) => {
      alert(`예정 라멘집 삭제 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useAddVisitedRamen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => addVisitedRamen(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitedRamen'] });
      alert('방문 라멘집 기록이 성공적으로 추가되었습니다!');
    },
    onError: (error) => {
      alert(`방문 라멘집 추가 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useUpdateMemberRatingAndReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ restaurantId, visitCount, memberName, rating, reviewText }) =>
      updateMemberRatingAndReview(restaurantId, visitCount, memberName, { rating, reviewText }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitedRamen'] });
    },
    onError: (error) => {
      alert(`별점 및 후기 업데이트 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

// --- 방문 예정 라멘집 관련 훅 ---
export const usePlannedRamenRestaurants = () => {
  return useQuery({
    queryKey: ['plannedRamen'],
    queryFn: getPlannedRamenRestaurants,
  });
};

export const useAddPlannedRamen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPlannedRamen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannedRamen'] }); // 예정 라멘집 목록 갱신
    },
    onError: (error) => {
      alert(`방문 예정 라멘집 추가 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeletePlannedRamenRestaurant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlannedRamenRestaurantById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannedRamen'] });
      alert('방문 예정 라멘집이 성공적으로 삭제되었습니다!');
    },
    onError: (error) => {
      alert(`예정 라멘집 삭제 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const usePlannedRamenRestaurant = (restaurantId) => {
  return useQuery({
    queryKey: ['plannedRamen', restaurantId],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required.');
      }
      return getPlannedRamenRestaurantById(restaurantId);
    },
  });
};
