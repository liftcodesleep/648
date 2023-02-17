import About from './components/About'
import Alekya from './components/Alekya'
import Jacob from './components/Jacob'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    // <About/>
    <Router>
      <Routes>

        <Route path="/about" element={<About />} />
        <Route path="/alekya" element={<Alekya />} />
        <Route path="/jacob" element={<Jacob />} />

      </Routes>
    </Router>
  )
}







export default App