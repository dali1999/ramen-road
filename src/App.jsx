import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import RamenApp from './pages/RamenApp';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage.jsx';
import MyPage from './pages/MyPage.jsx';
import VisitedRamenInfoPage from './pages/VisitedRamenInfoPage.jsx';
import RecommendedRamenInfoPage from './pages/RecommendedRamenInfoPage';

// 메뉴 페이지
import MembersPage from './pages/MembersPage.jsx';
import RecommendedRamensPage from './pages/RecommendedRamensPage.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 쿼리 실패 시 자동으로 3번 재시도
      retry: 1,
      // 데이터가 stale 상태로 간주되기 전까지의 시간 (기본 0ms, 여기선 5분)
      // 이 시간 동안은 캐시된 데이터를 사용하며, 백그라운드에서 다시 가져오지 않습니다.
      staleTime: 1000 * 60 * 5, // 5 minutes
      // 캐시된 데이터가 삭제되기 전까지의 시간 (기본 5분)
      // 이 시간 후에는 GC(Garbage Collection) 대상이 되어 메모리에서 제거됩니다.
      cacheTime: 1000 * 60 * 10, // 10 minutes
      // 윈도우 포커스 시 자동으로 쿼리 재실행 여부
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className='app'>
            <Header />
            <main className='content'>
              <Routes>
                <Route>
                  <Route path='/' element={<RamenApp />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/register' element={<RegisterPage />} />
                  <Route path='/mypage' element={<MyPage />} />
                  <Route path='/restaurant/:id' element={<VisitedRamenInfoPage />} />
                  <Route path='/recommended/:id' element={<RecommendedRamenInfoPage />} />

                  {/* 메뉴 */}
                  <Route path='/planning' element={<RecommendedRamensPage />} />
                  <Route path='/members' element={<MembersPage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
