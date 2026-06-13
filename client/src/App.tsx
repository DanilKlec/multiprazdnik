import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PROGRAMS_DATA,
  CHARACTERS_DATA,
  Program,
  Character
} from './types';
import ParticlesBg from './components/ParticlesBg';
import { IconResolver } from './components/MagicIcons';
import MyLogo from './components/MyLogo';
import ProgramModal from './components/ProgramModal';
import BookingWizard from './components/BookingWizard';
import ReviewSection from './components/ReviewSection';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Booking Wizard states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [defaultProgram, setDefaultProgram] = useState('');
  const [defaultCharacter, setDefaultCharacter] = useState('');

  // Service detailed modal states
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Hero filter navigation switcher for "Наши Герои" 
  const [activeHeroTab, setActiveHeroTab] = useState<'girls' | 'boys' | 'teens' | 'universal'>('girls');

  // Sticky header transition controller
  const [isScrolled, setIsScrolled] = useState(false);

  // Custom contact submission states (Quick callback form)
  const [showCallbackSuccess, setShowCallbackSuccess] = useState(false);
  const [clientPhone, setClientPhone] = useState('');

  // Confetti / Floating heart elements simulation tracker on clicking hero characters
  const [floatingEmitters, setFloatingEmitters] = useState<{ id: number; emoji: string; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper trigger to open wizard with targeted pre-selections
  const handleOpenBooking = (programTitle = '', charName = '') => {
    setDefaultProgram(programTitle);
    setDefaultCharacter(charName);
    setIsBookingOpen(true);
  };

  // Click animation emitter on characters
  const triggerFloatingEmoji = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>, customEmoji = '✨') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const count = 6;
    const emojis = [customEmoji, '🌟', '🎈', '❤️', '🦋', '🎉'];

    const newItems = Array.from({ length: count }).map((_, idx) => ({
      id: Date.now() + Math.random() + idx,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      x: e.clientX,
      y: e.clientY + window.scrollY // Position absolute on page
    }));

    setFloatingEmitters((prev) => [...prev, ...newItems]);

    // Cleanup after 1.5s
    setTimeout(() => {
      setFloatingEmitters((prev) => prev.filter((item) => !newItems.find((n) => n.id === item.id)));
    }, 1500);
  };

  // Quick helper form callback
  const submitCallback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPhone.trim()) return;
    setShowCallbackSuccess(true);
    setTimeout(() => {
      setClientPhone('');
      setShowCallbackSuccess(false);
    }, 4500);
  };

  // Hero image lists for auto scrolling carousel
  const heroSliderImages = [
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=700&auto=format&fit=crop', // Kids fun
    'https://images.unsplash.com/photo-1481162854517-d9e353af153d?q=80&w=700&auto=format&fit=crop', // Balloons
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=700&auto=format&fit=crop', // Sparklers
  ];
  const [heroImageIdx, setHeroImageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIdx((prev) => (prev + 1) % heroSliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSliderImages.length]);

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans" id="multiprazdnik-application-root">
      {/* 2D Canvas ambient particles & gradients */}
      <ParticlesBg />

      {/* Floating Sparkles animations click feedback */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <AnimatePresence>
          {floatingEmitters.map((f) => (
            <motion.div
              key={f.id}
              className="absolute text-xl font-bold pointer-events-none select-none"
              style={{ left: f.x - 10, top: f.y - 12 }}
              initial={{ scale: 0.5, y: 0, opacity: 1, x: 0 }}
              animate={{
                scale: [0.5, 1.4, 0.8],
                y: -100 - Math.random() * 50,
                x: (Math.random() - 0.5) * 80,
                opacity: 0
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              {f.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* HEADER BAR */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
          ? 'bg-white/90 backdrop-blur-md py-3 shadow-md border-b border-brand-container'
          : 'bg-transparent py-5'
          }`}
        id="app-header-navigation"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          {/* Typographic animated logo */}
          <a href="#hero" className="no-underline">
            <MyLogo />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[15px] font-bold text-brand-on-surface-variant">
            <a href="#about" className="hover:text-brand-primary transition-colors cursor-pointer relative py-1 group">
              О нас
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
            </a>
            <a href="#programs" className="hover:text-brand-primary transition-colors cursor-pointer relative py-1 group">
              Услуги
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
            </a>
            <a href="#heroes" className="hover:text-brand-primary transition-colors cursor-pointer relative py-1 group">
              Герои
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
            </a>
            <a href="#reviews" className="hover:text-brand-primary transition-colors cursor-pointer relative py-1 group">
              Отзывы
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
            </a>
            <a href="#contacts" className="hover:text-brand-primary transition-colors cursor-pointer relative py-1 group">
              Контакты
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all group-hover:w-full" />
            </a>
          </nav>

          {/* Action Callouts */}
          <div className="flex items-center gap-3">
            {/* Real phone link */}
            <a
              href="tel:+37377768649"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full font-bold text-xs md:text-sm text-white bg-brand-primary-container hover:bg-brand-primary text-center tracking-wide transition-all scale-100 active:scale-95 shadow-sm"
              id="header-phone-quicklink"
            >
              <IconResolver name="Phone" size={14} className="animate-wiggle" />
              <span>+373 77768649</span>
            </a>

            {/* Magic Quick Book button */}
            <button
              onClick={() => handleOpenBooking()}
              className="hidden sm:inline-block px-5 py-2.5 rounded-full font-bold text-xs text-brand-on-secondary-on bg-brand-secondary-container hover:bg-brand-secondary-container/80 transition-all hover:shadow-xs cursor-pointer active:scale-95"
              id="magic-book-trigger-btn"
            >
              Подарить чудо ✨
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        id="hero"
        className="relative pt-28 md:pt-36 pb-16 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-7xl mx-auto px-4 md:px-8 items-center"
      >
        {/* Left column info */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left z-10">
          <motion.div
            className="inline-flex items-center gap-1 bg-[#ffb77a]/20 border border-[#ffb77a]/50 text-brand-primary font-extrabold text-xs px-3.5 py-1.5 rounded-full"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span>✨</span> Вошебство в каждом моменте
          </motion.div>

          <motion.h1
            className="text-4xl md:text-[52px] font-black text-brand-on-surface leading-[1.1] tracking-tight font-sans"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Мультипраздник — <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#ff9f43]">создаем</span> маленькие сказки с большой <span className="text-rose-500 relative">любовью! <span className="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400 rounded-md" /></span>
          </motion.h1>

          <motion.p
            className="text-brand-on-surface-variant text-base md:text-lg font-semibold max-w-xl leading-relaxed mx-auto lg:mx-0 text-justify"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Оживляем любимых героев, проводим яркие шоу и дарим настоящую радость в Тирасполе и на выезде. Каждый праздник для нас — это неповторимая история детских улыбок!
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3.5 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => handleOpenBooking()}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-white bg-brand-primary-container hover:bg-brand-primary hover:shadow-lg transition-all text-base cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
              id="hero-choose-celebration-btn"
            >
              Выбрать праздник
            </button>
            <a
              href="#programs"
              className="w-full sm:w-auto text-center px-8 py-4 rounded-2xl font-black text-brand-on-surface bg-white hover:bg-brand-container-low transition-all border-2 border-brand-container text-base hover:shadow-xs active:scale-95"
              id="hero-see-services-btn"
            >
              Смотреть услуги
            </a>
          </motion.div>
        </div>

        {/* Right column visually engaging mockup card & banner */}
        <div className="lg:col-span-5 relative z-10 flex justify-center">
          <motion.div
            className="relative w-full max-w-[400px] h-[450px] md:h-[480px] bg-white rounded-3xl p-3 shadow-xl border-4 border-white overflow-hidden group"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
          >
            {/* Auto Image Carousel */}
            <div className="absolute inset-0 z-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={heroImageIdx}
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${heroSliderImages[heroImageIdx]})` }}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25" />
            </div>

            {/* Sisters label inside hero banner */}
            <div className="absolute top-5 left-5 z-25 bg-white/95 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-brand-on-surface uppercase tracking-wider">Открыта запись на Июнь!</span>
            </div>

            {/* Bottom Floating magic bubble */}
            <div className="absolute bottom-5 left-5 right-5 z-20 bg-white/90 backdrop-blur-xs p-4 rounded-2xl shadow-lg border-2 border-yellow-250 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-brand-secondary-container/20 flex items-center justify-center text-xl shadow-xs">
                👑
              </div>
              <div className="text-left">
                <h4 className="font-extrabold text-brand-on-surface text-base">
                  1000+ Счастливых детей
                </h4>
                <p className="text-xs text-brand-on-surface-variant font-bold leading-none mt-1">
                  Незабываемое веселье в Приднестровье!
                </p>
              </div>
            </div>

            {/* Playful visual sprinkle overlays */}
            <div className="absolute top-3 right-3 text-2xl filter drop-shadow z-20">🎈</div>
            <div className="absolute bottom-24 right-5 text-3xl filter drop-shadow z-20">🎁</div>
          </motion.div>
        </div>
      </section>

      {/* SISTER STUDIO ABOUT SECTION */}
      <section id="about" className="py-20 bg-brand-container-low/75 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left illustration content */}
          <div className="lg:col-span-5 relative flex justify-center order-last lg:order-first">
            <div className="relative w-full max-w-[380px] aspect-square rounded-3xl bg-white border-8 border-brand-container-high/40 shadow-xl overflow-hidden p-6 flex flex-col justify-center items-center text-center space-y-4">
              <div className="w-20 h-20 bg-brand-primary-container/20 rounded-full flex items-center justify-center text-4xl shadow-inner">
                👩🏼‍🤝‍👩🏻
              </div>
              <div>
                <h4 className="font-black text-lg text-brand-on-surface">Инна и Марьяна</h4>
                <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mt-1">Основательницы студии</p>
              </div>
              <p className="text-sm font-semibold text-brand-on-surface-variant leading-relaxed">
                «Мы вложили в каждый сценарий, костюм и деталь самое главное — искреннюю сестринскую поддержку, любовь к детским улыбкам и тепло домашнего очага.»
              </p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-rose-500">❤️</span>
                ))}
              </div>
            </div>
            {/* Playful layout overlays */}
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#b3adff] rounded-xl transform -rotate-12 opacity-80 z-0" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-[#ff9f43] rounded-full transform rotate-45 opacity-60 z-0" />
          </div>

          {/* Right story text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-xs uppercase tracking-wider font-extrabold text-brand-primary">ОСОБЕННАЯ ИСТОРИЯ</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-on-surface tracking-tight font-sans">
              О нас — Творческая Семья «Мультипраздник»
            </h2>
            <div className="space-y-4 text-brand-on-surface-variant font-medium text-base md:text-lg leading-relaxed text-justify">
              <p>
                <strong>«Мультипраздник»</strong> — это не просто стандартная студия детских праздников. Это большая, по-настоящему дружная и теплая семья, созданная двумя родными сестрами — <strong>Инной и Марьяной</strong>.
              </p>
              <p>
                В основу создания нашей студии мы заложили самое главное — безусловную любовь к детям, искренние улыбки и обоюдное желание дарить настоящую заботу. Наша профессиональная команда заботится о каждой мелочи: мы шьем сертифицированные костюмы, покупаем яркий реквизит и пишем индивидуальные сюжетные линии.
              </p>
              <p>
                Сегодня «Мультипраздник» в Тирасполе — это пространство для волшебных открытий, где оживают персонажи, гремят барабаны и лопаются гигантские пузыри радости. Мы делаем ребят по-настоящему счастливыми!
              </p>
            </div>

            {/* Highlighting trust stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 text-center">
              <div className="bg-white p-3.5 rounded-2xl shadow-xs">
                <p className="text-2xl font-black text-brand-primary leading-none">100%</p>
                <p className="text-[10px] text-brand-outline font-extrabold uppercase mt-1">Безопасно</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-xs">
                <p className="text-2xl font-black text-brand-primary leading-none">20+</p>
                <p className="text-[10px] text-brand-outline font-extrabold uppercase mt-1">Персонажей</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl shadow-xs">
                <p className="text-2xl font-black text-brand-primary leading-none">6+</p>
                <p className="text-[10px] text-brand-outline font-extrabold uppercase mt-1">Видов шоу</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS SHOWS SECTION */}
      <section id="programs" className="py-20 max-w-7xl mx-auto px-4 md:px-8 text-center space-y-12">
        <div>
          <span className="text-xs uppercase tracking-widest font-black text-brand-primary">ВОЛШЕБНЫЕ ПРОГРАММЫ</span>
          <h2 className="text-3xl md:text-4xl font-black text-brand-on-surface mt-1 leading-tight font-sans">
            Наши программы
          </h2>
          <p className="text-brand-on-surface-variant font-semibold text-sm md:text-base mt-2">
            Уникальные шоу и развлечения для любого возраста с возможностью выезда к вам!
          </p>
        </div>

        {/* Dynamic cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROGRAMS_DATA.map((prog, index) => {
            const isPrimaryTheme = prog.colorTheme === 'primary';
            const isSecondaryTheme = prog.colorTheme === 'secondary';
            const isTertiaryTheme = prog.colorTheme === 'tertiary';

            // Get background classes
            let iconColor = 'bg-brand-primary-container text-brand-on-primary-container';
            if (isSecondaryTheme) iconColor = 'bg-brand-secondary-container text-brand-on-secondary-container';
            if (isTertiaryTheme) iconColor = 'bg-brand-tertiary-container text-brand-on-tertiary-container';
            if (prog.id === 'serpentine') iconColor = 'bg-rose-100 text-rose-600';
            if (prog.id === 'studio') iconColor = 'bg-amber-100 text-amber-700';
            if (prog.id === 'animators') iconColor = 'bg-blue-105 text-blue-600';

            return (
              <motion.div
                key={prog.id}
                className="bg-white rounded-2xl p-6 border-2 border-[#eef5f7] shadow-sm hover:shadow-xl hover:-translate-y-2.5 transition-all duration-300 flex flex-col justify-between text-left group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                id={`program-card-${prog.id}`}
              >
                <div className="space-y-4">
                  {/* Top Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${iconColor} transition-transform duration-300 group-hover:scale-110`}>
                    <IconResolver name={prog.iconName} size={22} />
                  </div>

                  {/* Program Title */}
                  <h3 className="text-lg font-black text-brand-on-surface group-hover:text-brand-primary transition-colors">
                    {prog.title}
                  </h3>

                  {/* Intro text */}
                  <p className="text-brand-on-surface-variant font-semibold text-xs leading-relaxed line-clamp-3">
                    {prog.intro}
                  </p>
                </div>

                {/* Interactive button that opens modal dialog */}
                <div className="pt-6 mt-4 border-t border-brand-container/50 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedProgram(prog)}
                    className="text-xs font-black text-brand-primary hover:text-brand-primary-hover flex items-center gap-1 cursor-pointer"
                    id={`open-detail-btn-${prog.id}`}
                  >
                    <span>Подробнее</span>
                    <IconResolver name="ArrowRight" size={13} className="transform group-hover:translate-x-1.5 transition-transform" />
                  </button>

                  <button
                    onClick={() => handleOpenBooking(prog.title)}
                    className="text-[10px] font-black uppercase tracking-wider bg-brand-container-low px-2.5 py-1.5 rounded-lg text-brand-on-surface-variant hover:bg-brand-primary-container/15 hover:text-brand-primary transition-all cursor-pointer"
                    id={`quick-book-btn-${prog.id}`}
                  >
                    Заказать
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CHARACTERS HEROES FILTER SYSTEM SECTION */}
      <section id="heroes" className="py-20 bg-brand-container-low/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center space-y-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-black text-brand-primary">ГЕРОИ АНИМАТОРЫ</span>
            <h2 className="text-3xl md:text-4xl font-black text-brand-on-surface mt-1 leading-tight font-sans">
              Наши Герои
            </h2>
            <p className="text-brand-on-surface-variant font-semibold text-sm md:text-base mt-2">
              Выберите любимого персонажа для праздника вашего ребенка
            </p>
          </div>

          {/* Categorized switcher row */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            <button
              onClick={() => setActiveHeroTab('girls')}
              className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm cursor-pointer transition-all ${activeHeroTab === 'girls'
                ? 'bg-brand-primary text-white shadow-md scale-103'
                : 'bg-white text-brand-on-surface-variant border border-brand-container-medium hover:bg-brand-container-low'
                }`}
              id="hero-tab-girls"
            >
              👩‍🦰 Девочки
            </button>
            <button
              onClick={() => setActiveHeroTab('boys')}
              className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm cursor-pointer transition-all ${activeHeroTab === 'boys'
                ? 'bg-brand-primary text-white shadow-md scale-103'
                : 'bg-white text-brand-on-surface-variant border border-brand-container-medium hover:bg-brand-container-low'
                }`}
              id="hero-tab-boys"
            >
              👦 Мальчики
            </button>
            <button
              onClick={() => setActiveHeroTab('teens')}
              className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm cursor-pointer transition-all ${activeHeroTab === 'teens'
                ? 'bg-brand-primary text-white shadow-md scale-103'
                : 'bg-white text-brand-on-surface-variant border border-brand-container-medium hover:bg-brand-container-low'
                }`}
              id="hero-tab-teens"
            >
              ⚡ Подростки
            </button>
            <button
              onClick={() => setActiveHeroTab('universal')}
              className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm cursor-pointer transition-all ${activeHeroTab === 'universal'
                ? 'bg-brand-primary text-white shadow-md scale-103'
                : 'bg-white text-brand-on-surface-variant border border-brand-container-medium hover:bg-brand-container-low'
                }`}
              id="hero-tab-universal"
            >
              🎭 Универсальные
            </button>
          </div>

          {/* Filtered characters list grid with layout animation */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-4"
            layout
          >
            <AnimatePresence mode="popLayout">
              {CHARACTERS_DATA.filter((c) => c.category === activeHeroTab).map((char) => (
                <motion.div
                  key={char.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-brand-container hover:shadow-xl transition-all duration-400 group flex flex-col justify-between"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.35 }}
                  layout
                  onClick={(e) => triggerFloatingEmoji(e, '🎉')}
                  id={`character-card-${char.id}`}
                >
                  {/* Character Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-brand-container-low cursor-pointer">
                    <img
                      src={char.imageUrl}
                      alt={char.name}
                      className="w-full h-full object-cover object-[50%_0%] group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-[10px] font-black text-white/90">Кликните, чтобы добавить улыбку!</p>
                    </div>
                  </div>

                  {/* Character Meta */}
                  <div className="p-4 space-y-2.5 text-left flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      {/* Tags */}
                      <div className="flex gap-1">
                        {char.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md text-[9px] font-black bg-brand-primary-container/10 text-brand-primary uppercase">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Name */}
                      <h4 className="text-base font-black text-brand-on-surface leading-tight">
                        {char.name}
                      </h4>

                      {/* Secondary description from manual */}
                      <p className="text-brand-on-surface-variant text-xs leading-relaxed font-semibold line-clamp-3">
                        {char.description}
                      </p>
                    </div>

                    {/* Book now helper triggers */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBooking('', char.name);
                      }}
                      className="w-full py-2 rounded-xl text-center bg-brand-container-low hover:bg-brand-primary-container text-brand-on-surface-variant hover:text-brand-on-primary-container font-extrabold text-xs transition-colors cursor-pointer"
                    >
                      Пригласить {char.name.split(' (')[0]}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Suggestive caption link */}
          <div>
            <p className="text-xs font-bold text-brand-outline">
              * Если вы не нашли желаемого персонажа — свяжитесь с нами! Мы изготовим или арендуем любой наряд.
            </p>
          </div>
        </div>
      </section>

      {/* SPECIAL PROMOTION CALL TO ACTION BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="relative rounded-3xl p-8 md:p-12 overflow-hidden shadow-xl text-left bg-gradient-to-r from-brand-secondary-container via-brand-primary-container to-[#ffb77a]/60 border-4 border-white flex flex-col md:flex-row justify-between items-center gap-8"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          id="special-promotional-banner"
        >
          {/* Content info */}
          <div className="space-y-4 max-w-2xl text-brand-on-primary-container relative z-10">
            <span className="inline-flex bg-white/95 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase">СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ</span>
            <h3 className="text-2xl md:text-3xl font-black leading-tight text-brand-on-primary-container font-sans">
              Сезон выпускных официально открыт! Успейте забронировать лучшую дату!
            </h3>
            <p className="text-sm md:text-base font-bold text-brand-on-primary-container/90">
              Позаботьтесь о выпускном вечере для детского сада или начальной школы заранее. Мы приготовили эксклюзивные комплексные комбо-программы с шоу мыльных пузырей и серпантиновой дискотекой!
            </p>
          </div>

          {/* Trigger button */}
          <button
            onClick={() => handleOpenBooking('Выпускной в студии / выездной')}
            className="shrink-0 w-full md:w-auto px-8 py-4 bg-white hover:bg-brand-container-low text-brand-primary rounded-2xl font-black text-sm transition-all shadow-md active:scale-95 cursor-pointer relative z-10"
            id="promo-action-link-btn"
          >
            Узнать подробности & Бронировать
          </button>

          {/* Backdrop cartoon particles decoration */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </motion.div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-20 bg-white/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ReviewSection />
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-20 bg-brand-container-low/40">
        <div className="max-w-7xl mx-auto px-4 md:px-8">

          <div className="text-center mb-10">
            <span className="text-xs uppercase tracking-widest font-black text-brand-primary">
              КАК НАС НАЙТИ
            </span>

            <h2 className="text-3xl md:text-4xl font-black text-brand-on-surface mt-2">
              Ждём вас в нашей студии 🎉
            </h2>

            <p className="text-brand-on-surface-variant font-semibold mt-3">
              г. Тирасполь, ул. Карла Либкнехта, 159/2
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Информация */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-brand-container">
              <h3 className="font-black text-xl text-brand-on-surface mb-4">
                Контакты
              </h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold text-brand-primary">📍 Адрес</p>
                  <p>г. Тирасполь, ул. Карла Либкнехта, 159/2</p>
                </div>

                <div>
                  <p className="font-bold text-brand-primary">📞 Телефон</p>
                  <a
                    href="tel:+37377768649"
                    className="hover:text-brand-primary"
                  >
                    +373 777 68 649
                  </a>
                </div>

                <div>
                  <p className="font-bold text-brand-primary">📷 Instagram</p>
                  <a
                    href="https://www.instagram.com/multiprazdnik_tiraspol/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-brand-primary"
                  >
                    @multiprazdnik_tiraspol
                  </a>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/WJoQYjKDkXNjxP9SA"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block w-full text-center py-3 rounded-2xl bg-brand-primary text-white font-black hover:opacity-90 transition"
              >
                Построить маршрут 🗺️
              </a>
            </div>

            {/* Карта */}
            <div className="lg:col-span-2 overflow-hidden rounded-3xl shadow-xl border-4 border-white">
              <iframe
                src="https://www.google.com/maps?q=46.83866346075466,29.585312944195586&z=17&output=embed"
                className="w-full h-[500px]"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER & CONTACTS ZONE */}
      <footer id="contacts" className="bg-brand-on-surface text-white pt-16 pb-8 border-t border-brand-container">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">

          {/* Logo column */}
          <div className="md:col-span-5 space-y-4 text-left">
            <MyLogo dark />
            <p className="text-xs md:text-sm font-semibold text-white/70 max-w-sm leading-relaxed">
              Мультипраздник — детская праздничная сказка в Тирасполе. Живем любовью к детям, искренними эмоциями и уютом. Зажигаем волшебство вместе!
            </p>
            {/* Instagram link icon layout */}
            <div className="pt-2">
              <a
                href="https://www.instagram.com/multiprazdnik_tiraspol/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-white/80 hover:text-brand-primary-container transition-colors"
                id="instagram-social-action"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <IconResolver name="Instagram" size={16} />
                </div>
                <span>@multiprazdnik_tiraspol</span>
              </a>
            </div>
          </div>

          {/* Navigation Links column */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-black uppercase text-brand-primary-container tracking-widest">
              Навигация
            </h4>
            <ul className="space-y-2 text-xs font-bold text-white/80">
              <li><a href="#about" className="hover:text-white transition-colors">О нашей семье</a></li>
              <li><a href="#programs" className="hover:text-white transition-colors">Программы и шоу</a></li>
              <li><a href="#heroes" className="hover:text-white transition-colors">Наши ведущие герои</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Отзывы родителей</a></li>
            </ul>
          </div>

          {/* Real Contacts address column */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-black uppercase text-brand-primary-container tracking-widest">
              Контакты
            </h4>
            <div className="space-y-3.5 text-xs font-bold text-white/80">
              <div className="flex items-start gap-2">
                <IconResolver name="Phone" size={14} className="text-[#fdd73b] shrink-0 mt-0.5" />
                <div>
                  <p>Контактный телефон студии:</p>
                  <a href="tel:+37377768649" className="text-sm font-black text-white hover:text-[#fdd73b] transition-colors leading-relaxed block mt-0.5">
                    +373 77768649
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <IconResolver name="MapPin" size={14} className="text-[#fdd73b] shrink-0 mt-0.5" />
                <div>
                  <p>Локация студии:</p>
                  <p className="text-sm font-black text-white leading-relaxed mt-0.5">г. Тирасполь, Приднестровье</p>
                </div>
              </div>

              {/* Callback callback forms */}
              <form onSubmit={submitCallback} className="space-y-1.5 pt-2">
                <p className="text-[10px] uppercase text-brand-primary-container tracking-wider block">Заказать обратный звонок</p>
                <div className="flex gap-1.5">
                  <input
                    type="tel"
                    placeholder="Ваш телефон"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="bg-white/10 rounded-xl px-3 py-2 text-xs font-bold text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 w-full border border-white/5"
                  />
                  <button
                    type="submit"
                    className="bg-brand-primary-container text-brand-on-primary-container px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center transition-all hover:bg-brand-primary cursor-pointer"
                  >
                    Жду 📞
                  </button>
                </div>
                {showCallbackSuccess && (
                  <p className="text-[10px] text-green-400 font-bold animate-pulse">✓ Заявка отправлена! Сестра Инна скоро вам перезвонит.</p>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Legal copyright watermark row */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-bold text-white/50 gap-4">
          <p>
            <span
              onClick={() => setIsAdminOpen(true)}
              className="cursor-pointer"
            >
              ©
            </span> 2026 Мультипраздник. Все права защищены. Сказки создаются с искренней душой.
          </p>
          <div className="flex gap-3">
            <a href="#" className="hover:underline">Политика конфиденциальности</a>
            <span>•</span>
            <a href="#" className="hover:underline">Договор оферты</a>
          </div>
        </div>
      </footer>

      {/* OVERLAY MODALS & DIALOG WIZARDS COMPONENT MAPPING */}
      <ProgramModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onBook={(title) => handleOpenBooking(title)}
        availableHeroes={CHARACTERS_DATA}
      />

      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        programs={PROGRAMS_DATA}
        characters={CHARACTERS_DATA}
        defaultProgramTitle={defaultProgram}
        defaultCharacterName={defaultCharacter}
      />

      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        programs={PROGRAMS_DATA}
        characters={CHARACTERS_DATA}
      />
    </div>
  );
}
