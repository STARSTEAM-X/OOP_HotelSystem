import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Invoice from "./pages/Invoice";

import ViewBooking from "./pages/ViewBooking";
import ManageRoom from "./pages/ManageRoom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";

// CSS
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/booking/:booking_id" element={<Booking />} />
        <Route path="/payment/:booking_id" element={<Payment />} />
        <Route path="/invoice/:booking_id" element={<Invoice />} />

        <Route path="/viewbooking" element={<ViewBooking />} />
        <Route path="/manageroom" element={<ManageRoom />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App