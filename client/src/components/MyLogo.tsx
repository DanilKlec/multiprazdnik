import { motion } from 'motion/react';

export default function MyLogo() {
  return (
    <motion.img
      src="https://i.ibb.co/pBSkpPxL/image.png"
      alt="Мультипраздник"
      className="w-12 h-12 object-contain cursor-pointer"
      whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
      transition={{ duration: 0.4 }}
    />
  );
}