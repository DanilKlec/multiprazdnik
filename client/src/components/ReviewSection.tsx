import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Review, INITIAL_REVIEWS_DATA } from '../types';
import { IconResolver } from './MagicIcons';

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  
  // New review form fields
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');

  // Load reviews on mount
  useEffect(() => {
    const saved = localStorage.getItem('multiprazdnik_reviews');
    if (saved) {
      try {
        setReviews(JSON.parse(saved));
      } catch (err) {
        setReviews(INITIAL_REVIEWS_DATA);
      }
    } else {
      setReviews(INITIAL_REVIEWS_DATA);
    }
  }, []);

  // Save reviews list
  const saveReviews = (newList: Review[]) => {
    setReviews(newList);
    localStorage.setItem('multiprazdnik_reviews', JSON.stringify(newList));
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) {
      setError('Имя и текст отзыва обязательны для заполнения!');
      return;
    }
    setError('');

    const letter = author.trim().charAt(0).toUpperCase();
    const bgList = [
      'bg-orange-100 text-orange-700',
      'bg-yellow-105 text-yellow-800',
      'bg-purple-100 text-purple-700',
      'bg-rose-100 text-rose-700',
      'bg-blue-105 text-blue-800'
    ];
    const borderBg = bgList[Math.floor(Math.random() * bgList.length)];

    const dateToday = new Date().toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });

    const newRev: Review = {
      id: 'rev-custom-' + Date.now(),
      author: author.trim(),
      text: `"${text.trim()}"`,
      date: dateToday,
      rating,
      avatarLetter: letter,
      avatarBg: borderBg
    };

    const updated = [newRev, ...reviews];
    saveReviews(updated);

    // Clear and collapse
    setAuthor('');
    setText('');
    setRating(5);
    setShowForm(false);
  };

  return (
    <div className="space-y-10" id="reviews-section-wrapper">
      {/* Intro and triggers */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-3xl font-extrabold text-brand-on-surface leading-tight font-sans tracking-tight">
            Отзывы счастливых родителей
          </h3>
          <p className="text-brand-on-surface-variant font-semibold text-sm mt-1">
            Ваши эмоции — наша главная награда!
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 rounded-full font-bold bg-white text-brand-primary border-2 border-brand-primary-container/40 hover:bg-brand-primary-container/10 transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm"
          id="reveal-review-form-btn"
        >
          <IconResolver name={showForm ? 'X' : 'MessageSquare'} size={18} />
          <span>{showForm ? 'Закрыть форму' : 'Оставить свой отзыв'}</span>
        </button>
      </div>

      {/* Write review expandable drawer */}
      <AnimatePresence>
        {showForm && (
          <motion.form 
            onSubmit={handleAddReview}
            className="p-6 md:p-8 bg-white rounded-2xl border-4 border-brand-primary-container/20 shadow-xl space-y-4 max-w-xl mx-auto"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            id="new-review-form"
          >
            <h4 className="text-lg font-black text-brand-on-surface flex items-center gap-1.5 justify-center">
              <span>✍️</span> Ваш искренний отзыв
            </h4>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 text-center animate-shake">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brand-outline mb-1 text-left">Имя (Фамилия)</label>
                <input 
                  type="text" 
                  placeholder="Например: Мама Марина"
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-container-low rounded-xl outline-none font-bold text-sm text-brand-on-surface border-2 border-transparent focus:border-brand-primary-container transition-all"
                />
              </div>

              {/* Dynamic star rating clicking switcher */}
              <div>
                <label className="block text-xs font-bold text-brand-outline mb-1 text-left">Ваша оценка</label>
                <div className="flex items-center gap-1.5 h-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl transition-transform duration-100 hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <IconResolver 
                        name="Star" 
                        size={22} 
                        className={star <= rating ? 'text-[#fdd73b] fill-[#fdd73b]' : 'text-brand-outline/20'} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-outline mb-1 text-left">Ваше сообщение</label>
              <textarea 
                placeholder="Как прошел детский праздник? Напишите о ваших эмоциях..."
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-2 bg-brand-container-low rounded-xl outline-none font-medium text-sm text-brand-on-surface border-2 border-transparent focus:border-brand-primary-container transition-all"
              />
            </div>

            <div className="flex justify-end gap-2.5">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-brand-on-surface hover:bg-brand-container-low transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button 
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-brand-primary-container hover:bg-brand-primary hover:shadow-md transition-all cursor-pointer"
                id="submit-review-action"
              >
                Опубликовать
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews feed grid */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        layout
      >
        <AnimatePresence mode="popLayout">
          {reviews.map((rev) => (
            <motion.div 
              key={rev.id}
              className="bg-white rounded-2xl p-5 border-2 border-[#eef5f7] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              layout
              id={`review-card-${rev.id}`}
            >
              {/* Star header */}
              <div>
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>
                      <IconResolver 
                        name="Star" 
                        size={15} 
                        className={i < rev.rating ? 'text-[#fdd73b] fill-[#fdd73b]' : 'text-slate-200'}
                      />
                    </span>
                  ))}
                </div>

                <p className="text-brand-on-surface font-semibold text-[13px] md:text-sm italic leading-relaxed text-left text-brand-on-surface/90 line-clamp-5">
                  {rev.text}
                </p>
              </div>

              {/* Author footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-brand-container/50 mt-4 text-left">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${rev.avatarBg}`}>
                  {rev.avatarLetter}
                </div>
                <div>
                  <h5 className="font-extrabold text-xs text-brand-on-surface leading-tight">
                    {rev.author}
                  </h5>
                  <span className="text-[10px] text-brand-outline font-semibold">
                    {rev.date}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
