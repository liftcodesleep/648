import About from './components/About'
import Alekya from './components/Alekya'
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

const App = () => {
    return (
        // <About/>
        <Router>
        <Routes>
          
          <Route path="/about" element={<About />} />
          <Route path="/alekya" element={<Alekya/>} />
         
        </Routes>
      </Router>
    )
}

    
  
  
     
   
  
export default App