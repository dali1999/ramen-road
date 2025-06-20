import React from 'react';
import './CardTags.css';

const TAGS = [
  //   { label: '지로계 맛집', color: 'rgb(150, 117, 8)' },
  { label: '쇼유 맛집', color: 'rgb(200, 104, 21)' },
  //   { label: '시오 맛집', color: 'rgb(226, 200, 114)' },
  { label: '돈코츠 맛집', color: 'rgb(218, 178, 1)' },
  { label: '사장 친절', color: 'rgb(100, 161, 20)' },
  //   { label: '사장 병신', color: 'rgb(232, 88, 88)' },
];

const CardTags = () => {
  return (
    <ul className='cardtags-list'>
      {TAGS.map((tag, idx) => (
        <li className='cardtags-item' key={`${tag}_${idx}`} style={{ backgroundColor: tag.color }}>
          {tag.label}
        </li>
      ))}
    </ul>
  );
};

export default CardTags;
