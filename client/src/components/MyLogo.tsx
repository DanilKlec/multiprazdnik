import React from 'react';
import myLogo from './image_a8864a.png';

export default function MyLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`} id="brand-logo">
      <div className="w-16 h-16 flex items-center justify-center relative overflow-hidden rounded-full border-2 border-amber-400 bg-white shadow-md">
        <img
          src={myLogo} 
          alt="Логотип"
          className="w-full h-full object-contain"
          // Добавили проверку, чтобы избежать лишних ошибок в консоли
          onError={(e) => {
             const target = e.target as HTMLImageElement;
             if (target.style.display !== 'none') {
               console.warn("Изображение не найдено, скрываем блок:", logoUrl);
               target.style.display = 'none';
             }
          }}
        />
      </div>

      <div className="flex flex-col font-black tracking-tight leading-[0.85] text-[#FFD700] drop-shadow-sm">
        <span className="text-3xl uppercase">МУЛЬТИ</span>
        <span className="text-3xl uppercase">ПРАЗДНИК</span>
      </div>
    </div>
  );
}