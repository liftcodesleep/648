import About from './components/About'
import Alekya from './components/Alekya'
import Vinay from './components/Vinay'
import Jacob from './components/Jacob'
import Ishika from './components/Ishika'  
import Nick from './components/Nick'
import SignupForm from './components/SignUpForm'
import LoginForm from './components/LoginForm'
import Search from './components/Search/search'
import UserProfile from './components/UserProfile/profile'
import EditProfile from './components/EditProfile/edit'

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


const App = () => {

    

  return (
    // <About/>
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/alekya" element={<Alekya />} />
        <Route path="/jacob" element={<Jacob />} />
        <Route path="/nick" element={<Nick />} />
          <Route path="/ishika" element={<Ishika />} />
          <Route path="/vinay" element={<Vinay />} />
         
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Search />} />
          <Route path="/user-profile" element={<UserProfile/>} />
          <Route path="/edit-profile" element={<EditProfile/>} />
          <Route path='/uploadimage' element={<Post/>}/>
      </Routes>
    </Router>
  )

}







export default App