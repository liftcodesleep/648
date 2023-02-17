import About from './components/About'
import Alekya from './components/Alekya'
import Vinay from './components/Vinay'

import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

const App = () => {
    return (
        // <About/>
        <Router>
        <Routes>
          
          <Route path="/about" element={<About />} />
          <Route path="/alekya" element={<Alekya/>} />
          <Route path="/vinay" element ={<Vinay/>} />
          
        </Routes>
      </Router>
    )
}

    
  
  
     
   
  
export default App