import { motion } from 'motion/react';

export default function MyLogo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer" id="brand-logo">
      {/* Interactive magical vector bunny logo */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Colorful floating balloons in the background */}
        <motion.div 
          className="absolute -top-1 -right-1 flex gap-1 z-10"
          animate={{
            y: [0, -4, 0],
            rotate: [0, 3, -3, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Orange balloon */}
          <div className="w-3.5 h-4.5 bg-brand-primary-container rounded-full opacity-90 transform rotate-12 relative shadow-xs">
            <span className="absolute bottom-0 left-1.5 w-0.5 h-1 bg-brand-on-primary-container/20 rounded-sm"></span>
          </div>
          {/* Blue/purple balloon */}
          <div className="w-3 h-4 bg-blue-400 rounded-full opacity-90 transform -rotate-12 relative shadow-xs">
            <span className="absolute bottom-0 left-1 w-0.5 h-1 bg-white/20 rounded-sm"></span>
          </div>
        </motion.div>

        {/* Hand-drawn style bunny avatar */}
        <motion.div 
          className="w-10 h-10 bg-white rounded-full border-2 border-brand-outline/30 flex items-center justify-center overflow-visible shadow-sm relative z-20 group-hover:scale-105 transition-transform duration-300"
          whileHover={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5 }}
        >
          {/* Draw friendly cute bunny face with ears */}
          <img
    src="https://i.ibb.co/pBSkpPxL/image.png"
    alt="Мультипраздник"
    className="w-full h-full object-cover"
  />
        </motion.div>
      </div>

      {/* Brand typographic letters in Nunito Sans */}
      <div className="flex flex-col select-none">
        <span className={`text-xl font-extrabold tracking-tight leading-none ${dark ? 'text-white' : 'text-brand-on-surface'}`}>
          мульти
        </span>
        <span className="text-xs font-bold tracking-widest text-brand-primary-container leading-none uppercase">
          праздник
        </span>
      </div>
    </div>
  );
}
