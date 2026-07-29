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
import { useEffect } from 'react';
import AdminValidations from './dashboard/Admin/MainAdmin';
// import TrackingDeliveryMap from './LiveTrackingMap/LiveTrackingMap';

import Home from './Home/Home';
function App() {
  
  useEffect(() => {
    const updateThemeColor = () => {
      // Nou tcheke si tag <html> la gen klas "dark" OUBEN si sistèm telefòn nan an dark mòd
      const isDark =
        document.documentElement.classList.contains('dark') ||
        window.matchMedia('(prefers-color-scheme: dark)').matches;

      const color = isDark ? '#09090b' : '#ffffff';

      let metaTag = document.querySelector('meta[name="theme-color"]');
      if (metaTag) {
        metaTag.setAttribute('content', color);
      } else {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'theme-color');
        metaTag.setAttribute('content', color);
        document.head.appendChild(metaTag);
      }
    };

    // Kouri l depi w antre
    updateThemeColor();

    // Si se sèlman sou sistèm nan ou te vle l rete koute:
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateThemeColor);

    return () => mediaQuery.removeEventListener('change', updateThemeColor);
  }, []);
  return (
    <Router>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />
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

        {/* Admin */}
        <Route path="/admin-validation" element={<AdminValidations />} />

      </Routes>
    </Router>
  );
}

export default App;