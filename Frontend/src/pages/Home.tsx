import {  Route, Routes } from "react-router-dom"
import ParkingLots from "./ParkingLots"


function Home() {
  return (
    <div>
        Home
        <Routes>
            <Route path="parkinglots" element={<ParkingLots />}/>
        </Routes>
    </div>
  )
}

export default Home