
import './App.css'
import Login from './component/Auth/LogIn';
import Register from './component/Auth/Register';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './component/Auth/Profile';
function App() {

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      {/*<Route path="*" element={<NotFound />} />} { Catch-all for unknown routes */}
    </Routes>
  </Router>
  )
}

export default App
