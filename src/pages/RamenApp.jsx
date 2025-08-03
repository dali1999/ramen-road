import './RamenApp.css';
import { useState } from 'react';
import { usePlannedRamenRestaurants, useVisitedRamenRestaurants, useSchedules } from '@hooks/useRamen';
import VisitedRamenCard from '@components/VisitedRamenCard';
import RecommendedRamenCard from '@components/RecommendedRamenCard';
import AddVisitedRamenModal from '@components/modal/AddVisitedRamenModal';
import AddPlannedRamenModal from '@components/modal/AddPlannedRamenModal';
import CreateScheduleModal from '@components/modal/CreateScheduleModal';
import VoteCard from '@components/VoteCard';
import { useNavigate } from 'react-router-dom';
import ImageWithWebp from '../components/common/ImageWebp';

const RamenApp = () => {
  const navigate = useNavigate();
  const { data: visitedRamenList, isLoading: isLoadingVisited } = useVisitedRamenRestaurants();
  const { data: RecommendedRamenList, isLoading: isLoadingRecommended } = usePlannedRamenRestaurants();
  const { data: schedules, isLoading: isLoadingSchedules, error: schedulesError } = useSchedules();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isVisitedModalOpen, setIsVisitedModalOpen] = useState(false);
  const [isPlannedModalOpen, setIsPlannedModalOpen] = useState(false);

  const latestRamen = visitedRamenList && visitedRamenList.length > 0 ? visitedRamenList[0] : null;

  const handleBannerClick = () => {
    if (latestRamen) {
      navigate(`/restaurant/${latestRamen._id}`); // 최신 라멘집 상세 페이지로 이동
    }
  };

  if (isLoadingVisited || isLoadingRecommended || isLoadingSchedules) {
    return <div className='loading-full-page'>라멘로드 떠나는 중...</div>;
  }
  return (
    <div className='container'>
      <section className='main-banner-section' onClick={latestRamen ? handleBannerClick : undefined}>
        {/* <img src={latestRamen?.images[0]} alt='라멘로드 메인 배너' className='main-banner-image' /> */}
        <ImageWithWebp src={latestRamen?.bannerImageUrl} alt='라멘로드 메인 배너' className='main-banner-image' />
        <div className='main-banner-overlay'>
          <>
            <h1 className='banner-title'>라멘로드에 참여하세요</h1>
            <p className='banner-description'>세상의 모든 라멘을 먹을때까지</p>
          </>
        </div>
      </section>

      <div className='restaurant-wrapper'>
        {/* <div className='restaurant-section'>
          <div className='restaurant-grid-title'>
            <div>
              <p>📅 습격 일정</p>
              <p onClick={() => setIsScheduleModalOpen(true)}>일정 잡기</p>
            </div>
          </div>
          <div className='restaurant-grid planned'>
            {schedules?.map((schedule) => (
              <VoteCard key={schedule._id} schedule={schedule} />
            ))}
            {schedules?.length === 0 && <p className='no-schedules-message'>아직 등록된 라멘로드 일정이 없습니다.</p>}
          </div>
        </div> */}

        <div className='restaurant-section visited'>
          <div className='restaurant-grid-title visited'>
            <div>
              <p>🍜 라멘로드</p>
              <p onClick={() => setIsVisitedModalOpen(true)}>개척하기</p>
            </div>
          </div>
          <div className='restaurant-grid visited'>
            {visitedRamenList.length !== 0 ? (
              visitedRamenList.map((restaurant, idx) => <VisitedRamenCard restaurant={restaurant} key={`${restaurant.id}_${idx}`} />)
            ) : (
              <p className='no-card-text'>아무도 개척하지 않았습니다</p>
            )}
          </div>
        </div>

        <div className='restaurant-section planned'>
          <div className='restaurant-grid-title planned'>
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

      <CreateScheduleModal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} />
      <AddVisitedRamenModal isOpen={isVisitedModalOpen} onClose={() => setIsVisitedModalOpen(false)} />
      <AddPlannedRamenModal isOpen={isPlannedModalOpen} onClose={() => setIsPlannedModalOpen(false)} />
    </div>
  );
};
export default RamenApp;
