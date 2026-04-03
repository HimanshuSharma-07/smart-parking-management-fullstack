import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import ParkingLots from "./components/ParkingLots";
import Profile from "./components/Profile";
import MyBookings from "./components/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { GuestRoute } from "./routes/GuestRoute";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { hydrateAuth } from "./store/authSlice";
import { connectSocket, disconnectSocket, joinAdminRoom } from "./services/socket";

import UserLayout from "./pages/UserLayout";
import AdminRoute from "./routes/AdminRoute";
import { Outlet } from "react-router-dom";

import Dashboard from "./admin/pages/Dashboard";
import Bookings from "./admin/pages/Booking";
import Payments from "./admin/pages/Payments";

function App() {
  const dispatch = useAppDispatch();
  const { user, initialized } = useAppSelector((s) => s.auth);

  // Hydrate session on first mount
  useEffect(() => {
    void dispatch(hydrateAuth());
  }, [dispatch]);

  // Connect / disconnect socket whenever auth state changes (after hydration)
  useEffect(() => {
    if (!initialized) return;

    if (user) {
      const socket = connectSocket();
      // If the user is an admin, join the admin room once connected
      if (user.role === "admin") {
        if (socket.connected) {
          joinAdminRoom();
        } else {
          socket.once("connect", () => joinAdminRoom());
        }
      }
    } else {
      disconnectSocket();
    }
  }, [user, initialized]);

  return (
    <Routes>

      {/* USER SIDE */}
      <Route element={<UserLayout />}>

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />

        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        <Route
          path="/parking-lots"
          element={
            <ProtectedRoute>
              <ParkingLots />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* ADMIN SIDE */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Outlet />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="parking-lots" element={<ParkingLots />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="payments" element={<Payments />} />
        </Route>

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}

export default App;