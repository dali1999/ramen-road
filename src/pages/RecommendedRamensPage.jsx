import './RecommendedRamensPage.css';
import { useState } from 'react';
import { usePlannedRamenRestaurants, useSchedules } from '@hooks/useRamen';
import RecommendedRamenCard from '@components/RecommendedRamenCard';
import AddPlannedRamenModal from '@components/modal/AddPlannedRamenModal';
import VoteCard from '@components/VoteCard';
import CreateScheduleModal from '../components/modal/CreateScheduleModal';

const RecommendedRamensPage = () => {
  const { data: RecommendedRamenList, isLoading: isLoadingRecommended } = usePlannedRamenRestaurants();
  const { data: schedules, isLoading: isLoadingSchedules, error: schedulesError } = useSchedules();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPlannedModalOpen, setIsPlannedModalOpen] = useState(false);

  if (isLoadingRecommended || isLoadingSchedules) {
    return <div className='loading-full-page'>추천 라멘집과 일정 불러오는 중...</div>;
  }

  return (
    <div className='container'>
      <div className='restaurant-wrapper'>
        <div className='restaurant-section'>
          <div className='restaurant-grid-title'>
            <div>
              <p>📅 토벌 일정</p>
              <p onClick={() => setIsScheduleModalOpen(true)}>일정 잡기</p>
            </div>
          </div>
          <div className='restaurant-grid planned'>
            {schedules?.map((schedule) => (
              <VoteCard key={schedule._id} schedule={schedule} />
            ))}
            {schedules?.length === 0 && <p className='no-schedules-message'>아직 등록된 라멘로드 일정이 없습니다.</p>}
          </div>
        </div>

        <div className='restaurant-section'>
          <div className='restaurant-grid-title'>
            <div>
              <p>👍🏻 추천 라멘집</p>
              <p onClick={() => setIsPlannedModalOpen(true)}>추천하기</p>
            </div>
          </div>
          <div className='restaurant-grid planned'>
            {RecommendedRamenList.length !== 0 ? (
              RecommendedRamenList?.map((restaurant, idx) => (
                <RecommendedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />
              ))
            ) : (
              <p className='no-card-text'>아무도 추천하지 않았습니다</p>
            )}
          </div>
        </div>
      </div>

      <AddPlannedRamenModal isOpen={isPlannedModalOpen} onClose={() => setIsPlannedModalOpen(false)} />
      <CreateScheduleModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
    </div>
  );
};

export default RecommendedRamensPage;
