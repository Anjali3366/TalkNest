import "./App.css";
import { Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/auth/HomePage/HomePage";
import { Login } from "./pages/auth/Login/Login";
import { Signup } from "./pages/auth/SignUp/Signup";
import { SideBar } from "./Component/Sidebar";
function App() {
  return (
    <>
      <SideBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
