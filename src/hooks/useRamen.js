import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getMembers,
  getMyProfile,
  updateMyProfile,
  addVisitedRamen,
  getVisitedRamenRestaurants,
  getVisitedRamenRestaurantById,
  updateVisitedRamen,
  updateMemberRatingAndReview,
  addPlannedRamen,
  getPlannedRamenRestaurants,
  getPlannedRamenRestaurantById,
  deleteVisitedRamenRestaurantById,
  deletePlannedRamenRestaurantById,
  deleteMemberById,
  updateRamenImages,
  getRamenImages,
  //일정
  createSchedule,
  getSchedules,
  joinSchedule,
  leaveSchedule,
} from '../api';
import { useAuth } from '@context/AuthContext';

// --- 멤버 관련 훅 ---
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  });
};

export const useMyProfile = () => {
  const { user } = useAuth();
  const queryEnabled = !!user?.member;

  return useQuery({
    queryKey: ['myProfile', user?.member?._id], // 유저 ID가 변경되면 쿼리 다시 실행
    queryFn: getMyProfile,
    enabled: queryEnabled, // 로그인 상태일 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 캐시 유효 (너무 자주 호출될 필요 없음)
    cacheTime: 1000 * 60 * 10,
  });
};

export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuth();

  return useMutation({
    mutationFn: (payload) => updateMyProfile(payload),
    onSuccess: (data) => {
      alert(data.message || '회원 정보가 성공적으로 업데이트되었습니다!');
      localStorage.setItem('member', JSON.stringify(data.member));
      setUser((prevUser) => ({
        ...prevUser,
        member: data.member,
      }));
      queryClient.invalidateQueries({ queryKey: ['myProfile', user?.member?._id] });
      queryClient.invalidateQueries({ queryKey: ['members', 'visitedRamen', 'plannedRamen'] });
    },
    onError: (error) => {
      alert(`회원 정보 업데이트 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  return useMutation({
    mutationFn: deleteMemberById,
    onSuccess: (_, deletedMemberId) => {
      alert('계정이 성공적으로 삭제되었습니다!');
      const loggedInMember = JSON.parse(localStorage.getItem('member') || 'null');
      if (loggedInMember && loggedInMember._id === deletedMemberId) {
        logout();
      }
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
    onError: (error) => {
      alert(`계정 삭제 실패: ${error.response?.data?.message || error.message}`);
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

export const useUpdateVisitedRamen = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ restaurantId, payload }) => updateVisitedRamen(restaurantId, payload),
    onSuccess: (data, variables) => {
      alert(data.message || '라멘집 정보가 성공적으로 업데이트되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['visitedRamen'] }); // 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['visitedRamen', variables.restaurantId] }); // 상세 정보 갱신
      queryClient.invalidateQueries({ queryKey: ['ramenImages', variables.restaurantId] }); // 이미지 목록 갱신
      queryClient.invalidateQueries({ queryKey: ['myProfile', user?.member?._id] }); // 내 프로필 갱신 (생성자라면)
    },
    onError: (error) => {
      alert(`라멘집 정보 업데이트 실패: ${error.response?.data?.message || error.message}`);
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

export const useRamenImages = (restaurantId) => {
  return useQuery({
    queryKey: ['ramenImages', restaurantId],
    queryFn: () => getRamenImages(restaurantId),
    enabled: !!restaurantId, // restaurantId가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateRamenImages = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ restaurantId, payload }) => updateRamenImages(restaurantId, payload),
    onSuccess: (data, variables) => {
      alert(data.message || '라멘집 이미지가 성공적으로 업데이트되었습니다!');
      queryClient.invalidateQueries({ queryKey: ['visitedRamen'] });
      queryClient.invalidateQueries({ queryKey: ['visitedRamen', variables.restaurantId] });
      queryClient.invalidateQueries({ queryKey: ['ramenImages', variables.restaurantId] });
    },
    onError: (error) => {
      alert(`이미지 업데이트 실패: ${error.response?.data?.message || error.message}`);
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
    mutationFn: (payload) => addPlannedRamen(payload),
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

// ✨ 새로운 훅: 일정 생성 ✨
export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] }); // 일정 목록 갱신
      alert('라멘로드 일정이 성공적으로 생성되었습니다!');
    },
    onError: (error) => {
      alert(`일정 생성 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

// ✨ 새로운 훅: 모든 일정 조회 ✨
export const useSchedules = () => {
  return useQuery({
    queryKey: ['schedules'],
    queryFn: getSchedules,
  });
};

// ✨ 새로운 훅: 일정 참여 ✨
export const useJoinSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: joinSchedule,
    onSuccess: (updatedSchedule) => {
      queryClient.setQueryData(['schedules', updatedSchedule._id], updatedSchedule);
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      alert('일정에 참여했습니다!');
    },
    onError: (error) => {
      alert(`일정 참여 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};

// ✨ 새로운 훅: 일정 나가기 ✨
export const useLeaveSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // scheduleId를 인자로 받음
    mutationFn: leaveSchedule,
    onSuccess: (updatedSchedule) => {
      queryClient.setQueryData(['schedules', updatedSchedule._id], updatedSchedule);
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      alert('일정에서 나갔습니다.');
    },
    onError: (error) => {
      alert(`일정 나가기 실패: ${error.response?.data?.message || error.message}`);
    },
  });
};
