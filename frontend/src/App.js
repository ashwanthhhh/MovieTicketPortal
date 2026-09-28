import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import SeatLayout from "./pages/SeatLayout";
import Payment from "./pages/Payment";
import TicketConfirm from "./pages/TicketConfirm";
import Transfer from "./pages/Transfer";
import Voting from "./pages/Voting";
import Gamification from "./pages/Gamification";

import EventDetails from "./pages/EventDetails";
import EventBooking from "./pages/EventBooking";

import SportsDetails from "./pages/SportsDetails";
import SportsBooking from "./pages/SportsBooking";

import PlaysDetails from "./pages/PlaysDetails";
import PlaysBooking from "./pages/PlaysBooking";

import Stream from "./pages/Stream";
import AdminDashboard from "./pages/AdminDashboard";
import Events from "./pages/Events";
import Sports from "./pages/Sports";
import Plays from "./pages/Plays";
import Buzz from "./pages/Buzz";
import BuzzDetails from "./pages/BuzzDetails";
import Movies from "./pages/Movies";
import About from "./pages/About";
import AIChat from "./components/AIChat";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* ... (auth routes) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* ... (dashboard) */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* ... (other pages) */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/seats" element={<SeatLayout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/confirm" element={<TicketConfirm />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/gamification" element={<Gamification />} />
        <Route path="/about" element={<About />} />

        {/* ⭐ EVENT FLOW */}
        <Route path="/event-details" element={<EventDetails />} />
        <Route path="/event-booking" element={<EventBooking />} />

        {/* ⭐ SPORTS FLOW */}
        <Route path="/sports-details" element={<SportsDetails />} />
        <Route path="/sports-booking" element={<SportsBooking />} />

        {/* ⭐ PLAYS FLOW */}
        <Route path="/plays-details" element={<PlaysDetails />} />
        <Route path="/plays-booking" element={<PlaysBooking />} />

        {/* ⭐ SIDEBAR PAGES */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/stream" element={<Stream />} />
        <Route path="/events" element={<Events />} />
        <Route path="/sports" element={<Sports />} />
        <Route path="/plays" element={<Plays />} />
        <Route path="/buzz" element={<Buzz />} />
        <Route path="/buzz-details" element={<BuzzDetails />} />
        <Route path="/movies" element={<Movies />} />

      </Routes>
      <AIChat />
    </BrowserRouter>
  );
}

export default App;
