import React from 'react';
import './UserProfileImage.css';
import ImageWithWebp from '@components/common/ImageWebp';

const UserProfileImage = ({ user, size }) => {
  return (
    <div
      className={`member-item ${user.role === 'admin' ? 'admin-glow' : ''}`}
      style={{
        border: `${size * 0.03}px solid ${user.role === 'admin' ? 'gold' : '#e2795f'}`, // 어드민 테두리 색상 강조
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <ImageWithWebp
        src={user.imageUrl}
        className='member-avatar'
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        alt={user.name}
      />
    </div>
  );
};

export default UserProfileImage;
