import 경수 from './assets/member/경수.png'
import 동일 from './assets/member/동일.png'
import 상혁 from './assets/member/상혁.jpg'
import 승종 from './assets/member/승종.jpg'
import 윤중 from './assets/member/윤중.png'
import 지영 from './assets/member/지영.jpg'

export const RAMEN_DATA = {
  restaurants: [
    {
      id: 1,
      name: '류진 라멘',
      bannerImageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOiCTu7b8WNXqejOc68h9Ux90J8hKlrmYO7A&s',
      location: '서울특별시 마포구 월드컵로17길 64',
      ratingAverage: 4.6,
      visits: [
        {
          visit_count: 1,
          visit_date: '2024-10-15',
          members: [
            { name: '상혁', rating: 4 },
            { name: '경수', rating: 5 },
            { name: '동일', rating: 3 },
          ],
        },
        {
          visit_count: 2,
          visit_date: '2025-03-20',
          members: [
            { name: '상혁', rating: 4 },
            { name: '동일', rating: 4 },
            { name: '윤중', rating: 4 },
            { name: '승종', rating: 4 },
            { name: '지영', rating: 4 },
          ],
        },
      ],
    },
    // {
    //   id: 2,
    //   name: "라멘 트럭",
    //   location: "서울특별시 마포구 연남동 567-8",
    //   visits: [
    //     {
    //       visit_count: 1,
    //       visit_date: "2024-12-01",
    //       members: [
    //         { name: "경수", rating: 5 },
    //         { name: "윤중", rating: 4 },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   id: 3,
    //   name: "시로이 라멘",
    //   location: "부산광역시 해운대구 우동 901-2",
    //   visits: [
    //     {
    //       visit_count: 1,
    //       visit_date: "2025-01-10",
    //       members: [
    //         { name: "상혁", rating: 3 },
    //         { name: "경수", rating: 4 },
    //         { name: "윤중", rating: 5 },
    //         { name: "동일", rating: 3 },
    //       ],
    //     },
    //     {
    //       visit_count: 2,
    //       visit_date: "2025-06-01",
    //       members: [
    //         { name: "윤중", rating: 5 },
    //         { name: "동일", rating: 4 },
    //       ],
    //     },
    //   ],
    // },
  ],
}

export const MEMBER = {
  상혁: {
    name: '상혁',
    nickname: '라멘 매니아',
    imageUrl: 상혁,
  },
  경수: {
    name: '경수',
    nickname: '국물 장인',
    imageUrl: 경수,
  },
  동일: {
    name: '동일',
    nickname: '맵찔이',
    imageUrl: 동일,
  },
  윤중: {
    name: '윤중',
    nickname: '',
    imageUrl: 윤중,
  },
  지영: {
    name: '지영',
    nickname: '',
    imageUrl: 지영,
  },
  승종: {
    name: '승종',
    nickname: '',
    imageUrl: 승종,
  },
}
