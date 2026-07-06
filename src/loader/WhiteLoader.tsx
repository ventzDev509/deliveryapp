import { motion } from 'framer-motion';

const WhiteLoader = ({ size = 24 }: { size?: number }) => {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{
                repeat: Infinity,
                duration: 1,
                ease: "linear"
            }}
            style={{
                width: size,
                height: size,
                border: `${size / 8}px solid rgba(255, 255, 255, 0.3)`,
                borderTop: `${size / 8}px solid #ffffff`,
                borderRadius: "50%",
            }}
        />
    );
};

export default WhiteLoader;