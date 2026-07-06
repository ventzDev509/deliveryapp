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
function App() {
  useEffect(() => {
    // 1. Nou kreye yon detektè pou n koute sistèm telefòn nan
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 2. Fonksyon ki pral chanje koulè ba a dinamikman
    const updateThemeColor = (e: MediaQueryListEvent | MediaQueryList) => {
      // Si telefòn nan an dark mòd, n ap mete Zinc-950 (#09090b), si se light, n ap met blan (#ffffff)
      const color = e.matches ? '#09090b' : '#ffffff';

      // N ap chèche tag meta theme-color ki nan index.html la
      let metaTag = document.querySelector('meta[name="theme-color"]');

      if (metaTag) {
        metaTag.setAttribute('content', color);
      } else {
        // Si tag la pa t egziste pou kèk rezon, nou kreye l ak JS
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'theme-color');
        metaTag.setAttribute('content', color);
        document.head.appendChild(metaTag);
      }
    };

    // 3. Nou kouri fonksyon an yon premye fwa lè paj la loded
    updateThemeColor(mediaQuery);

    // 4. Nou di l rete koute si sistèm telefòn nan ta chanje pandan l sou aplikasyon an
    mediaQuery.addEventListener('change', updateThemeColor);

    // 5. Netwayaj (Cleanup) lè konpozan an unmount
    return () => mediaQuery.removeEventListener('change', updateThemeColor);
  }, []);
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