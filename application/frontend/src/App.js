import About from './components/About'
import Alekya from './components/Alekya'
import Jacob from './components/Jacob'
import Ishika from './components/Ishika'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

const App = () => {
  return (
    // <About/>
    <Router>
      <Routes>https://github.com/CSC-648-SFSU/csc648-spring23-01-team01/pull/42/conflict?name=application%252Ffrontend%252Fsrc%252FApp.js&ancestor_oid=f4abf4cc0343a1c96e41b418302042fb45a35b01&base_oid=d6a809234dd5fc79b5bec59eb9ca80dd913d638c&head_oid=75182687b2e528bfb86bd417af28dd27fa267d3e

        <Route path="/about" element={<About />} />
        <Route path="/alekya" element={<Alekya />} />
        <Route path="/jacob" element={<Jacob />} />
          <Route path="/ishika" element={<Ishika />} />
      </Routes>
    </Router>
  )
}







export default App