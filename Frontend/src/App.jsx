import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Component
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Pages For Customer
import Home from "./pages/Customer/Home";
import Booking from "./pages/Customer/Booking";
import Payment from "./pages/Customer/Payment";
import Invoice from "./pages/Customer/Invoice";
import MyBooking from "./pages/Customer/MyBooking";
import MyFeedback from "./pages/Customer/MyFeedback";
import MyReview from "./pages/Customer/MyReview";

// Pages For Admin
import ManageRoom from "./pages/Admin/ManageRoom";
import ManageUser from "./pages/Admin/ManageUser";
import ManageBooking from "./pages/Admin/ManageBooking";
import ManageDiscount from "./pages/Admin/ManageDiscount";
import ManageFeedback from "./pages/Admin/ManageFeedback";
import ManageReview from "./pages/Admin/ManageReview";

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
        <Route path="/my_booking" element={<MyBooking />} />
        <Route path="/my_feedback" element={<MyFeedback />} />
        <Route path="/my_review" element={<MyReview />} />

        <Route path="/admin/room" element={<ManageRoom />} />
        <Route path="/admin/user" element={<ManageUser />} />
        <Route path="/admin/booking" element={<ManageBooking />} />
        <Route path="/admin/discount" element={<ManageDiscount />} />
        <Route path="/admin/feedback" element={<ManageFeedback />} />
        <Route path="/admin/review" element={<ManageReview />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App