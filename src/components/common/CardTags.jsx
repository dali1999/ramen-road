import React, { useState, useEffect } from 'react';
import './CardTags.css';

export const ALL_TAGS = [
  { label: '쇼유 맛집', color: 'rgb(200, 104, 21)' },
  { label: '돈코츠 맛집', color: 'rgb(218, 178, 1)' },
  { label: '지로 맛집', color: 'rgb(150, 117, 8)' },
  { label: '시오 맛집', color: 'rgb(226, 200, 114)' },
  { label: '미소 맛집', color: 'rgb(209, 139, 91)' },
  { label: '츠케멘 맛집', color: 'rgb(62, 91, 152)' },

  { label: '사장 친절', color: 'rgb(100, 161, 20)' },
  { label: '사장 불친절', color: 'rgb(232, 88, 88)' },

  { label: '웨이팅 필수', color: 'rgb(190, 90, 90)' },
  { label: '숨은 맛집', color: 'rgb(90, 90, 160)' },
];

const CardTags = ({ onSelectTags, initialSelectedTags = [] }) => {
  // 선택된 태그 목록을 관리하는 상태
  const [selectedTags, setSelectedTags] = useState(initialSelectedTags);

  // 선택 상태가 변경될 때마다 부모 컴포넌트로 전달 (useEffect 활용)
  useEffect(() => {
    if (onSelectTags) {
      onSelectTags(selectedTags);
    }
  }, [selectedTags, onSelectTags]);

  const handleTagClick = (tagLabel) => {
    setSelectedTags((prevSelectedTags) => {
      if (prevSelectedTags.includes(tagLabel)) {
        // 이미 선택된 태그면 제거
        return prevSelectedTags.filter((tag) => tag !== tagLabel);
      } else {
        // 선택되지 않은 태그면 추가
        return [...prevSelectedTags, tagLabel];
      }
    });
  };

  return (
    <ul className='cardtags-list'>
      {ALL_TAGS.map((tag) => (
        <li
          className={`cardtags-item ${selectedTags.includes(tag.label) ? 'selected' : ''}`}
          key={tag.label}
          style={{
            backgroundColor: selectedTags.includes(tag.label) ? tag.color : 'white',
            color: selectedTags.includes(tag.label) ? 'white' : tag.color,
            borderColor: tag.color,
          }}
          onClick={() => handleTagClick(tag.label)}
        >
          {tag.label}
        </li>
      ))}
    </ul>
  );
};

export default CardTags;
