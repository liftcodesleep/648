import About from './components/About'
import Alekya from './components/Alekya'
import Vinay from './components/Vinay'
import Jacob from './components/Jacob'
import Ishika from './components/Ishika'  
import Nick from './components/Nick'
import SignupForm from './components/SignUpForm'
import LoginForm from './components/LoginForm'
import Search from './components/Search'

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
        <Route path="/nick" element={<Nick />} />
          <Route path="/ishika" element={<Ishika />} />
          <Route path="/vinay" element={<Vinay />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Search />} />
      </Routes>
    </Router>
  )

}







export default App