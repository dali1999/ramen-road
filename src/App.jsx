import { Route, Routes } from 'react-router-dom';
import './App.css';
import RamenApp from './pages/RamenApp';
import VisitedRamenRestaurant from './pages/VisitedRamenRestaurant';
import RecommendedRamenRestaurant from './pages/RecommendedRamenRestaurant';

function App() {
  return (
    <Routes>
      <Route>
        <Route path='/' element={<RamenApp />} />
        <Route path='/restaurant/:id' element={<VisitedRamenRestaurant />} />
        <Route path='/recommended/:id' element={<RecommendedRamenRestaurant />} />
      </Route>
    </Routes>
  );
}

export default App;
