import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext.jsx';
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
import { useEffect } from 'react';
import VisitedRamensPage from './pages/VisitedRamensPage.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
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
                  <Route path='/visited' element={<VisitedRamensPage />} />
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
