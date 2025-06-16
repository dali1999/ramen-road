import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  addMember,
  getMembers,
  addVisitedRamen,
  getVisitedRamenRestaurants,
  getVisitedRamenRestaurantById,
  updateMemberRating,
  addPlannedRamen,
  getPlannedRamenRestaurants,
} from '../api'

// --- 멤버 관련 훅 ---
export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: getMembers,
  })
}

export const useAddMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] }) // 멤버 목록 갱신
      alert('멤버가 성공적으로 추가되었습니다!')
    },
    onError: (error) => {
      alert(`멤버 추가 실패: ${error.response?.data?.message || error.message}`)
    },
  })
}

// --- 방문한 라멘집 관련 훅 ---
export const useVisitedRamenRestaurants = () => {
  return useQuery({
    queryKey: ['visitedRamen'],
    queryFn: getVisitedRamenRestaurants,
  })
}

export const useVisitedRamenRestaurant = (restaurantId) => {
  return useQuery({
    queryKey: ['visitedRamen', restaurantId],
    queryFn: () => {
      if (!restaurantId) {
        throw new Error('Restaurant ID is required.')
      }
      return getVisitedRamenRestaurantById(restaurantId)
    },
  })
}

export const useAddVisitedRamen = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addVisitedRamen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitedRamen'] }) // 방문 라멘집 목록 갱신
      alert('방문 라멘집 기록이 성공적으로 추가되었습니다!')
    },
    onError: (error) => {
      alert(`방문 라멘집 추가 실패: ${error.response?.data?.message || error.message}`)
    },
  })
}

export const useUpdateMemberRating = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ restaurantId, visitCount, memberName, rating }) => updateMemberRating(restaurantId, visitCount, memberName, { rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitedRamen'] }) // 방문 라멘집 목록 갱신 (별점 변경 반영)
      alert('별점이 성공적으로 업데이트되었습니다!')
    },
    onError: (error) => {
      alert(`별점 업데이트 실패: ${error.response?.data?.message || error.message}`)
    },
  })
}

// --- 방문 예정 라멘집 관련 훅 ---
export const usePlannedRamenRestaurants = () => {
  return useQuery({
    queryKey: ['plannedRamen'],
    queryFn: getPlannedRamenRestaurants,
  })
}

export const useAddPlannedRamen = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addPlannedRamen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannedRamen'] }) // 예정 라멘집 목록 갱신
      alert('방문 예정 라멘집이 성공적으로 추가되었습니다!')
    },
    onError: (error) => {
      alert(`방문 예정 라멘집 추가 실패: ${error.response?.data?.message || error.message}`)
    },
  })
}
