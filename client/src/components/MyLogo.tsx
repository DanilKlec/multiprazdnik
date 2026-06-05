import React from 'react';

// Добавляем возможность передать путь к фото через пропсы
export default function MyLogo({ className = "", imageSrc = "./favicon.png" }: { className?: string, imageSrc?: string }) {
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="brand-logo">
      
      {/* Контейнер для фото с ограничением размера */}
      <div className="w-16 h-16 flex items-center justify-center relative overflow-hidden rounded-full border-2 border-amber-400 bg-white shadow-md">
        <img
          src={imageSrc}
          alt="Логотип Мультипраздник"
          className="w-full h-full object-cover"
          onError={(e) => {
             const target = e.target as HTMLImageElement;
             target.style.display = 'none';
             target.parentElement!.style.backgroundColor = '#f3f4f6';
          }}
        />
      </div>

      {/* Текстовая часть бренда */}
      <div className="flex flex-col font-black tracking-tight leading-[0.85] text-[#FFD700] drop-shadow-sm">
        <span className="text-3xl uppercase">МУЛЬТИ</span>
        <span className="text-3xl uppercase">ПРАЗДНИК</span>
      </div>
    </div>
  );
}