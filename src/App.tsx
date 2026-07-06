import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Auth/Auth'; // Paj Login/Register ou an
import EmailVerification from './Auth/EmailVerification';
import "./App.css"
import VerificationSuccess from './Auth/VerificationSuccess';
import ForgotPassword from './Auth/ForgotPassword';
import ResetPassword from './Auth/ResetPassword';
import RequestEmailConfimation from './Auth/RequestEmailConfirmation';
import MainLayout from './dashboard/main';
import MainOrder from './dashboard/pages/Order/MainOrders';
import MainMenu from './dashboard/pages/menuRestaurant/MainMenuRestaurant';
import MainRestaurantSetting from './dashboard/pages/RestaurantSetting/MainRSettings';
import MainDriver from './dashboard/pages/DriverPage/MainDriver';
import BecomeSellerPage from './Auth/BecomeSellerPage';
function App() {
  return (
    <Router>
      <Routes>

        {/* Authentification path  */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/request-email-confirmation" element={<RequestEmailConfimation />} />
        <Route path="/verify-success" element={<VerificationSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/become-seller" element={<BecomeSellerPage />} />


        {/* Dashboard path  */}
        <Route path="/dashboard" element={<MainLayout />} />
        <Route path="/orders" element={<MainOrder />} />
        <Route path="/restaurants" element={<MainMenu />} />
        <Route path="/settings" element={<MainRestaurantSetting />} />
        <Route path="/driver" element={<MainDriver />} />

      </Routes>
    </Router>
  );
}

export default App;