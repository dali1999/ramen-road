import { useState } from 'react';
import { useUpdateRamenImages } from '@hooks/useRamen';
import { useAuth } from '@context/AuthContext';
import './ImageGallery.css';
import { useParams } from 'react-router-dom';
import ImageWithWebp from '@components/common/ImageWebp';
import ImageViewer from '../../common/ImageViewer';

const ImageGallery = ({ images }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const updateRamenImagesMutation = useUpdateRamenImages();

  const [isImageUploadMode, setIsImageUploadMode] = useState(false);
  const [selectedNewImages, setSelectedNewImages] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  //  이미지 업로드 제출 핸들러
  const handleImageUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedNewImages.length === 0) {
      alert('업로드할 이미지를 선택해주세요.');
      return;
    }

    const formData = new FormData();
    selectedNewImages.forEach((file) => {
      formData.append('images', file); // 백엔드 Multer 필드 이름과 일치
    });

    try {
      await updateRamenImagesMutation.mutateAsync({
        restaurantId: id,
        payload: formData,
      });
      setIsImageUploadMode(false); // 업로드 모드 종료
      setSelectedNewImages([]); // 파일 선택 초기화
    } catch (err) {
      console.error('라멘집 이미지 업로드 실패:', err);
    }
  };

  // 이미지 모두 삭제 핸들러
  const handleClearImages = async () => {
    if (window.confirm('모든 라멘집 사진을 삭제하시겠습니까?')) {
      const formData = new FormData();
      formData.append('clearAllImages', 'true');

      try {
        await updateRamenImagesMutation.mutateAsync({
          restaurantId: id,
          payload: formData,
        });
        alert('모든 라멘집 사진이 삭제되었습니다.');
      } catch (err) {
        console.error('모든 이미지 삭제 실패:', err);
      }
    }
  };

  const handleImageClick = (idx) => {
    setIsViewerOpen(true);
    setSelectedImageIndex(idx);
  };

  const canEditImages = user.member;

  return (
    <>
      <h2>갤러리</h2>
      <div className='image-gallery-controls'>
        {canEditImages && (
          <>
            <button
              onClick={() => setIsImageUploadMode(!isImageUploadMode)}
              className={`gallery-control-button ${isImageUploadMode ? 'active-upload-mode' : ''}`}
            >
              {isImageUploadMode ? '취소' : '+'}
            </button>
            {/* {imagesToDisplay.length > 0 && (
              <button
                onClick={handleClearImages}
                disabled={updateRamenImagesMutation.isPending}
                className='gallery-control-button clear-button'
              >
                모든 사진 삭제
              </button>
            )} */}
          </>
        )}
      </div>
      {isImageUploadMode && (
        <form onSubmit={handleImageUploadSubmit} className='image-upload-form'>
          <input
            type='file'
            multiple // 다중 파일 선택 가능
            accept='image/*'
            onChange={(e) => setSelectedNewImages(Array.from(e.target.files))}
          />
          <button type='submit' disabled={updateRamenImagesMutation.isPending || selectedNewImages.length === 0}>
            {updateRamenImagesMutation.isPending ? '업로드 중...' : '선택 사진 업로드'}
          </button>
          {updateRamenImagesMutation.isError && <p className='error-message'>업로드 실패: {updateRamenImagesMutation.error.message}</p>}
        </form>
      )}

      <div className='image-gallery-scroll-wrapper'>
        {images.length > 0 ? (
          images.map((imgUrl, i) => (
            <li onClick={() => handleImageClick(i)} key={`${imgUrl}_${i}`}>
              <ImageWithWebp key={i} src={imgUrl} width={100} className='gallery-image' alt={imgUrl} />
            </li>
          ))
        ) : (
          <p className='no-images-message'>등록된 이미지가 없습니다.</p>
        )}
      </div>
      <ImageViewer isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)} imageUrl={images[selectedImageIndex]} />
    </>
  );
};

export default ImageGallery;
