import { Routes , Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Profile from "./pages/profile/Profile"


function App() {
  return (
    <Routes>
      <Route path = "/" element ={<Login/>} />
      <Route path = "/register" element ={<Register/>} />
      <Route path = "/dashboard" element ={<Dashboard/>} />
      <Route path = "/profile" element ={<Profile/>} />
    </Routes>
  );
}

export default App;