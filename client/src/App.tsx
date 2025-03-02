
import './App.css'
import Login from './component/Auth/LogIn';
import Register from './component/Auth/Register';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from './component/Auth/Profile';
import ViewWS from './component/Workspace/ViewWS';
import ViewProject from './component/Project/ViewProject';
import "font-awesome/css/font-awesome.min.css";
function App() {

  return (
    <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/workspace" element={<ViewWS/>}/>
      <Route path="/workspace/:workspaceId/projects" element={<ViewProject />} />

      {/*<Route path="*" element={<NotFound />} />} { Catch-all for unknown routes */}
    </Routes>
  </Router>
  )
}

export default App
