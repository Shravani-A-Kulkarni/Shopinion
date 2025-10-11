import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ratings from "./pages/Ratings";
import OwnerStores from "./pages/OwnerStores";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import StoreReviewsDashboard from "./pages/StoreReviewsDashboard";

function App() {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ratings/:storeId" element={<Ratings />} />
          <Route path="/owner/stores" element={<OwnerStores />} />
          <Route path="/admin/reviews" element={<StoreReviewsDashboard />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/Forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
