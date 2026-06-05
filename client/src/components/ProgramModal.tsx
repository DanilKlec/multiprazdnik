import { motion, AnimatePresence } from 'motion/react';
import { Program, Character } from '../types';
import { IconResolver } from './MagicIcons';

interface ProgramModalProps {
  program: Program | null;
  onClose: () => void;
  onBook: (programTitle: string) => void;
  availableHeroes: Character[];
}

export default function ProgramModal({ program, onClose, onBook, availableHeroes }: ProgramModalProps) {
  if (!program) return null;

  // Render styling classes based on theme
  const getThemeClasses = (theme: string) => {
    switch (theme) {
      case 'primary':
        return {
          bg: 'bg-brand-primary/5',
          text: 'text-brand-primary',
          iconContainer: 'bg-brand-primary-container/20 text-brand-primary-container',
          border: 'border-brand-primary-container/30',
          accent: 'bg-brand-primary-container text-brand-on-primary-container'
        };
      case 'secondary':
        return {
          bg: 'bg-brand-secondary/5',
          text: 'text-brand-secondary',
          iconContainer: 'bg-brand-secondary-container/20 text-brand-on-secondary-container',
          border: 'border-brand-secondary-container/30',
          accent: 'bg-brand-secondary-container text-brand-on-secondary-container'
        };
      case 'tertiary':
        return {
          bg: 'bg-brand-tertiary/5',
          text: 'text-brand-tertiary',
          iconContainer: 'bg-brand-tertiary-container/20 text-brand-on-tertiary-container',
          border: 'border-brand-tertiary-container/30',
          accent: 'bg-brand-tertiary-container text-brand-on-tertiary-container'
        };
      case 'rose':
        return {
          bg: 'bg-rose-50',
          text: 'text-rose-600',
          iconContainer: 'bg-rose-100 text-rose-700',
          border: 'border-rose-200',
          accent: 'bg-rose-500 text-white'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          iconContainer: 'bg-amber-100 text-amber-900',
          border: 'border-amber-200',
          accent: 'bg-amber-500 text-white'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          iconContainer: 'bg-blue-100 text-blue-700',
          border: 'border-blue-200',
          accent: 'bg-blue-500 text-white'
        };
      default:
        return {
          bg: 'bg-slate-50',
          text: 'text-slate-800',
          iconContainer: 'bg-slate-100 text-slate-800',
          border: 'border-slate-200',
          accent: 'bg-slate-600 text-white'
        };
    }
  };

  const currentTheme = getThemeClasses(program.colorTheme);

  // Subsections or bullet details for extra magical feel
  const getSubFeatures = (id: string) => {
    switch (id) {
      case 'science':
        return ['Безопасные химические реакции', 'Сухой лед и азотный туман', 'Пенные башни', 'Светящиеся растворы', 'Каждому ребенку - диплом ученого!'];
      case 'bubbles':
        return ['Пузыри гиганты от 1 до 5 метров', 'Огненные и дымовые пузыри', 'Погружение ребенка в полный рост в пузырь', 'Шоу на световом столе', 'Мастер-класс для всех желающих'];
      case 'drums':
        return ['Настоящие этнические барабаны', 'Разучивание драйвовых ритмов', 'Музыкальные состязания', 'Шумовой оркестр гостей', 'Интерактив с родителями'];
      case 'serpentine':
        return ['До 20 кг мягкого цветного серпантина', 'Специальная воздушная пушка', 'Фотосессия в горах серпантина', 'Дискотека с любимыми треками', 'Уборка сияющих лент включена!'];
      case 'studio':
        return ['Аренда полностью закрытого пространства', 'Игровая лаундж-зона', 'Профессиональный звук и свет', 'Отдельный чайный стол для родителей', 'Фотозона с праздничным декором'];
      case 'animators':
        return ['Профессиональные костюмы премиум-класса', 'Музыкальное сопровождение праздника', 'Яркий игровой реквизит', 'Мини-аквагрим или блеск-тату в подарок', 'Торжественный вынос торта'];
      default:
        return ['Индивидуальный сценарий под возраст', 'Подарки всем гостям', 'Аниматоры с санитарными книжками'];
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id={`program-modal-${program.id}`}>
        {/* Backdrop overlay */}
        <motion.div 
          className="absolute inset-0 bg-brand-on-surface/50 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal body container */}
        <motion.div 
          className="relative bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border-4 border-white z-10 flex flex-col md:max-h-[90vh]"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
        >
          {/* Top colored accent border/bar */}
          <div className={`h-3 w-full ${currentTheme.accent}`} />

          {/* Close button icon */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-brand-container-low hover:bg-brand-container-high text-brand-on-surface transition-colors cursor-pointer z-20"
            id="close-modal-btn"
          >
            <IconResolver name="X" size={20} />
          </button>

          {/* Modal content viewport */}
          <div className="p-6 md:p-8 overflow-y-auto">
            {/* Header portion */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-xl ${currentTheme.iconContainer}`}>
                <IconResolver name={program.iconName} size={32} />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-extrabold text-brand-primary-container">информация об услугах</span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-brand-on-surface leading-tight font-sans">
                  {program.title}
                </h3>
              </div>
            </div>

            {/* Program details content */}
            <div className="space-y-6">
              {/* Introduction bubble */}
              <div className={`p-4 rounded-xl border border-dashed ${currentTheme.bg} ${currentTheme.border}`}>
                <p className="text-brand-on-surface-variant font-semibold text-lg italic leading-relaxed">
                  «{program.intro}»
                </p>
              </div>

              {/* Comprehensive Description text */}
              <div>
                <h4 className="text-sm uppercase tracking-wider font-extrabold text-brand-outline mb-2">Описание программы:</h4>
                <p className="text-brand-on-surface text-base md:text-lg leading-relaxed whitespace-pre-line text-justify">
                  {program.description}
                </p>
              </div>

              {/* Magical elements included bullet list */}
              <div>
                <h4 className="text-sm uppercase tracking-wider font-extrabold text-brand-outline mb-3 flex items-center gap-2">
                  <IconResolver name="Sparkles" className="text-brand-primary-container" size={16} />
                  Что входит в программу шоу:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {getSubFeatures(program.id).map((feat, index) => (
                    <div key={index} className="flex items-start gap-2 text-brand-on-surface text-sm font-semibold">
                      <span className="text-brand-primary-container mt-0.5">★</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested matching characters/heroes in studio */}
              <div>
                <h4 className="text-sm uppercase tracking-wider font-extrabold text-brand-outline mb-3">Рекомендуемые герои для шоу:</h4>
                <div className="flex flex-wrap gap-2">
                  {availableHeroes.slice(0, 4).map((hero) => (
                    <span 
                      key={hero.id} 
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-brand-container-low text-brand-on-surface-variant flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 bg-brand-primary-container rounded-full" />
                      {hero.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action Footer bar */}
          <div className="p-4 md:p-6 bg-brand-container-low border-t border-brand-container flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-brand-outline flex items-center gap-1.5">
              <IconResolver name="Heart" size={14} className="text-rose-500 fill-rose-500 animate-pulse" />
              Волшебство гарантировано
            </span>
            <div className="flex gap-2.5 w-full sm:w-auto">
              <button 
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl font-bold text-brand-on-surface hover:bg-brand-container-high transition-all text-sm cursor-pointer"
              >
                Закрыть
              </button>
              <button 
                onClick={() => {
                  onBook(program.title);
                  onClose();
                }}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl font-extrabold text-white bg-brand-primary-container hover:bg-brand-primary hover:shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                id="book-inside-modal-btn"
              >
                Выбрать эту программу
                <IconResolver name="ArrowRight" size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
