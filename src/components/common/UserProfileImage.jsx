import React from 'react';
import './UserProfileImage.css';

const UserProfileImage = ({ user, size }) => {
  return (
    <div
      className={`member-item ${user.role === 'admin' ? 'admin-glow' : ''}`}
      style={{
        border: `${size * 0.05}px solid ${user.role === 'admin' ? 'gold' : '#7b7b7b'}`, // 어드민 테두리 색상 강조
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <img
        src={user.imageUrl}
        alt={user.name}
        className='member-avatar'
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      />
    </div>
  );
};

export default UserProfileImage;
