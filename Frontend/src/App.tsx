import { Route, Routes } from "react-router-dom";
import Navbar from "./Header/Navbar";
import Home from "./pages/Home";



export default function SmartParkDashboard() {


  return (
    <div
    
      className="min-h-screen bg-slate-50 text-slate-800"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Navbar />
      
        <Routes>
          <Route path="/" element={<Home />}/>
        </Routes>
    
      
      
    </div>
  );
}
