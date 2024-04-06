import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'
import './App.css'

import Home from './pages/Home'
import Modules from './pages/Modules'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/modules" element={<Modules />} />
      </Routes>
    </Router>
  )
}

export default App
