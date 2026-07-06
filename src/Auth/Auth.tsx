import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './Login'; 
import Register from './Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    /* 
      Mwen ajoute min-h-screen pou asire veso a kouvri tout wotè a,
      ak bg-transparent pou l kite background premium zinc-950 ki sou body a parèt san fay.
    */
    <div className="overflow-hidden min-h-screen bg-transparent">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <Login onToggle={() => setIsLogin(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Register onToggle={() => setIsLogin(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthPage;