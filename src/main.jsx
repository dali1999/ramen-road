import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 쿼리 실패 시 자동으로 3번 재시도
      retry: 3,
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
})

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </BrowserRouter>,
)
