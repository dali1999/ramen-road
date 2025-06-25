import './ImageViewer.css';
import ImageWithWebp from '@components/common/ImageWebp';

const ImageViewer = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return (
    <div className='image-modal-overlay' onClick={onClose}>
      {/* <div className='image-modal-content' onClick={(e) => e.stopPropagation()}></div> */}
      <ImageWithWebp src={imageUrl} className='image-modal-content' alt={imageUrl} />
    </div>
  );
};

export default ImageViewer;
