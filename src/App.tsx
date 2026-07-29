import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from './Auth/Auth'; // Paj Login/Register ou an
import EmailVerification from './Auth/EmailVerification';
import "./App.css"
import "./index.css"
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
// import { useEffect } from 'react';
import AdminValidations from './dashboard/Admin/MainAdmin';
// import TrackingDeliveryMap from './LiveTrackingMap/LiveTrackingMap';

import Home from './Home/Home';
function App() {
  
  // useEffect(() => {
  //   const updateThemeAndColors = () => {
  //     // 1. Tcheke si n an dark mòd (swa via klas 'dark' sou html la, oswa via sistèm telefòn nan)
  //     const isDark =
  //       document.documentElement.classList.contains('dark') ||
  //       window.matchMedia('(prefers-color-scheme: dark)').matches;

  //     // Chwazi koulè yo (Egzanp: #09090b pou dark, #ffffff pou light)
  //     const bgColor = isDark ? '#09090b' : '#ffffff';

  //     // 2. Fòse background body a ak html la pran bon koulè a pou evite zòn gri/blan nan telefòn nan
  //     document.documentElement.style.backgroundColor = bgColor;
  //     document.body.style.backgroundColor = bgColor;

  //     // 3. Mete ajou meta theme-color pou ba navigasyon anlè/anba telefòn nan
  //     let metaTag = document.querySelector('meta[name="theme-color"]');
  //     if (metaTag) {
  //       metaTag.setAttribute('content', bgColor);
  //     } else {
  //       metaTag = document.createElement('meta');
  //       metaTag.setAttribute('name', 'theme-color');
  //       metaTag.setAttribute('content', bgColor);
  //       document.head.appendChild(metaTag);
  //     }
  //   };

  //   // Kouri l depi app a chaje
  //   updateThemeAndColors();

  //   // Koute chanjman sou sistèm telefòn nan
  //   const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  //   mediaQuery.addEventListener('change', updateThemeAndColors);

  //   // Koute chanjman si aplikasyon an chanje tèm nan dinamikman (klas 'dark' sou html)
  //   const observer = new MutationObserver((mutations) => {
  //     mutations.forEach((mutation) => {
  //       if (mutation.attributeName === 'class') {
  //         updateThemeAndColors();
  //       }
  //     });
  //   });

  //   observer.observe(document.documentElement, {
  //     attributes: true,
  //     attributeFilter: ['class'],
  //   });

  //   // Netwayaj lè app a unmount
  //   return () => {
  //     mediaQuery.removeEventListener('change', updateThemeAndColors);
  //     observer.disconnect();
  //   };
  // }, []);
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