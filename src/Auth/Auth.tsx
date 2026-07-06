import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './Login'; 
import Register from './Register';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="overflow-hidden">
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