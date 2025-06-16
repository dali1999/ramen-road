import { Route, Routes } from 'react-router-dom'
import './App.css'
import RamenApp from './pages/RamenApp'
import VisitedRamenRestaurant from './pages/VisitedRamenRestaurant'

function App() {
  return (
    <Routes>
      <Route>
        <Route path='/' element={<RamenApp />} />
        <Route path='/restaurant/:id' element={<VisitedRamenRestaurant />} />
      </Route>
    </Routes>
  )
}

export default App
