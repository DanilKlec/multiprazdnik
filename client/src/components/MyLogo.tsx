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
          <svg viewBox="0 0 100 100" className="w-8 h-8 text-brand-on-surface transform translate-y-0.5">
            {/* Ears */}
            <path d="M 30 30 Q 20 10, 35 15 Q 40 20, 42 40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            <path d="M 70 30 Q 80 10, 65 15 Q 60 20, 58 40" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            {/* Inner ears (pink tint) */}
            <path d="M 31 29 Q 25 15, 33 18 Q 36 21, 38 35" fill="none" stroke="#ffb77a" strokeWidth="3" strokeLinecap="round" />
            <path d="M 69 29 Q 75 15, 67 18 Q 64 21, 62 35" fill="none" stroke="#ffb77a" strokeWidth="3" strokeLinecap="round" />
            
            {/* Head outline */}
            <circle cx="50" cy="55" r="28" fill="white" stroke="currentColor" strokeWidth="6" />
            
            {/* Eyes */}
            <circle cx="40" cy="50" r="4.5" fill="currentColor" />
            <circle cx="60" cy="50" r="4.5" fill="currentColor" />
            {/* Eye glint */}
            <circle cx="38.5" cy="48.5" r="1.5" fill="white" />
            <circle cx="58.5" cy="48.5" r="1.5" fill="white" />

            {/* Nose (cute pink heart/tri) */}
            <polygon points="46,57 54,57 50,61" fill="#ffb77a" stroke="currentColor" strokeWidth="1" />
            
            {/* Smile */}
            <path d="M 43 65 Q 50 71 57 65" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
            {/* Cute rosy cheeks */}
            <circle cx="30" cy="58" r="4" fill="#ffdcc2" opacity="0.8" />
            <circle cx="70" cy="58" r="4" fill="#ffdcc2" opacity="0.8" />
          </svg>
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
