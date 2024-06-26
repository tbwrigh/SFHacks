import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import './App.css'
import Navbar from './components/navbar'
import Home from './pages/Home'
import About from './pages/About'
import Courses from './pages/Courses'
import CourseCreateEditForm from './pages/CourseCreateEdit';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/edit/*" element={<CourseCreateEditForm />} />
        <Route path="/404" element={<NotFoundPage />} />
      </Routes>
    </Router>
  )
}

export default App
