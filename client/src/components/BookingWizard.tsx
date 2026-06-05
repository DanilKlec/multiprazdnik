import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Program, Character } from '../types';
import { IconResolver } from './MagicIcons';
import { addBooking } from '../lib/bookingStorage';

interface BookingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
  characters: Character[];
  defaultProgramTitle?: string;
  defaultCharacterName?: string;
}

export default function BookingWizard({ 
  isOpen, 
  onClose, 
  programs, 
  characters,
  defaultProgramTitle = '',
  defaultCharacterName = ''
}: BookingWizardProps) {
  const [step, setStep] = useState(1);
  const [ticketId] = useState(() => 'MP-' + Math.floor(100000 + Math.random() * 90000).toString());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // State for parents
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('5');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('14:00');
  const [selectedProgram, setSelectedProgram] = useState(defaultProgramTitle || programs[0]?.title || '');
  const [selectedCharacter, setSelectedCharacter] = useState(defaultCharacterName || 'Без аниматора (Только шоу)');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [specificWishes, setSpecificWishes] = useState('');
  const [addCake, setAddCake] = useState(false);
  const [addConfetti, setAddConfetti] = useState(false);

  // Form error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateStep1 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!childName.trim()) newErrors.childName = 'Пожалуйста, введите имя ребенка';
    if (!eventDate) newErrors.eventDate = 'Выберите желаемую дату';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: { [key: string]: string } = {};
    if (!parentName.trim()) newErrors.parentName = 'Пожалуйста, укажите ваше имя';
    if (!parentPhone.trim()) {
      newErrors.parentPhone = 'Введите номер телефона для связи';
    } else if (parentPhone.trim().length < 5) {
      newErrors.parentPhone = 'Неверный формат номера';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pricing calculator engine
  const calcPrice = () => {
    let base = 800; // Base show price in PMR rubles
    if (selectedProgram.includes('Научное') || selectedProgram.includes('пузырей')) base += 300;
    if (selectedProgram.includes('Барабанное') || selectedProgram.includes('Серпантиновое')) base += 400;
    if (selectedCharacter !== 'Без аниматора (Только шоу)') base += 500;
    if (addCake) base += 450;
    if (addConfetti) base += 250;
    return base;
  };

  // Метод сохранения записи на сервере в базу PostgreSQL
  const handleSubmitBooking = async () => {
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setSubmitError('');

    const bookingData = {
      ticketId,
      childName,
      childAge: parseInt(childAge, 10) || 5,
      eventDate,
      eventTime,
      selectedProgram,
      selectedCharacter,
      parentName,
      parentPhone,
      specificWishes,
      addCake,
      addConfetti,
      totalPrice: calcPrice(),
      status: 'pending'
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка при сохранении бронирования');
      }

      console.log('Успешно сохранено в БД PostgreSQL:', result.booking);
      // Переходим на финальный успешный экран билета
      setStep(4);
    } catch (error: any) {
      console.error('Ошибка добавления бронирования:', error);
      setSubmitError(error.message || 'Ошибка подключения к серверу. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-out" id="booking-wizard-container">
      {/* Backdrop with solid Tailwind backdrop-blur and animation */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Window using Tailwind classes for smooth scale on entry */}
      <div 
        className="relative bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border-4 border-white z-10 flex flex-col max-h-[90vh] transform scale-100 transition-transform duration-300 ease-out"
      >
        {/* Magical Header Badge & Background Colors */}
        <div className="relative bg-amber-50 p-6 text-center border-b border-gray-100">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 text-black transition-colors cursor-pointer"
            id="close-wizard-btn"
          >
            <IconResolver name="X" size={18} />
          </button>
          <span className="text-2xl">🎉</span>
          <h3 className="text-xl font-extrabold text-black leading-tight mt-1 font-sans">
            Сказочное бронирование праздника
          </h3>
          {step < 4 && (
            <p className="text-xs font-bold text-gray-600 mt-1.5 uppercase tracking-wider">
              Шаг {step} из 3: {step === 1 ? 'Общая идея' : step === 2 ? 'Наполнение сказки' : 'Контакты и финал'}
            </p>
          )}
          {/* Simple Step indicator bar */}
          {step < 4 && (
            <div className="w-48 h-1.5 bg-gray-200 mx-auto rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-amber-400 transition-all duration-300 rounded-full" 
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Step Contents Component Container */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 transition-all duration-300">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-gray-600 font-semibold text-sm text-center mb-2">
                Давайте соберем начальные данные о имениннике и дате его дня рождения!
              </p>

              {/* Child Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <IconResolver name="Smile" size={15} className="text-amber-500" />
                  Имя именинника / именинницы *
                </label>
                <input 
                  type="text" 
                  placeholder="Например: Катя, Артём..." 
                  value={childName}
                  onChange={(e) => {
                    setChildName(e.target.value);
                    if (errors.childName) {
                      const eTmp = { ...errors };
                      delete eTmp.childName;
                      setErrors(eTmp);
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none font-bold text-black transition-all placeholder:text-gray-400"
                />
                {errors.childName && (
                  <span className="text-red-500 text-xs font-bold mt-1 block">{errors.childName}</span>
                )}
              </div>

              {/* Slider or number picker for Age */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <IconResolver name="Gift" size={15} className="text-amber-500" />
                  Сколько лет исполняется? ({childAge})
                </label>
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    min="1" 
                    max="16" 
                    value={childAge} 
                    onChange={(e) => setChildAge(e.target.value)}
                    className="w-full accent-amber-400"
                  />
                  <span className="text-lg font-black text-amber-500 w-8">{childAge}</span>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-semibold px-1">
                  <span>1 год</span>
                  <span>5 лет</span>
                  <span>10 лет</span>
                  <span>16 лет</span>
                </div>
              </div>

              {/* Date and Time Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <IconResolver name="Calendar" size={15} className="text-amber-500" />
                    Желаемая дата *
                  </label>
                  <input 
                    type="date"
                    value={eventDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => {
                      setEventDate(e.target.value);
                      if (errors.eventDate) {
                        const eTmp = { ...errors };
                        delete eTmp.eventDate;
                        setErrors(eTmp);
                      }
                    }}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none font-bold text-black transition-all"
                  />
                  {errors.eventDate && (
                    <span className="text-red-500 text-xs font-bold mt-1 block">{errors.eventDate}</span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <IconResolver name="Compass" size={15} className="text-amber-500" />
                    Желаемое время
                  </label>
                  <select
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none font-bold text-black transition-all cursor-pointer"
                  >
                    <option value="10:00">10:00 (Утро)</option>
                    <option value="12:00">12:00 (Полдень)</option>
                    <option value="14:00">14:00 (День)</option>
                    <option value="16:00">16:00 (День)</option>
                    <option value="18:00">18:00 (Вечер)</option>
                    <option value="20:00">20:00 (Вечер)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              {/* Select Program */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Выберите грандиозную программу:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {programs.map((p) => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedProgram(p.title)}
                      className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        selectedProgram === p.title 
                          ? 'border-amber-400 bg-amber-50/50 shadow-xs' 
                          : 'border-gray-200 bg-gray-50 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">⭐</span>
                        <div>
                          <p className="font-extrabold text-sm text-black">{p.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{p.intro}</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedProgram === p.title ? 'border-amber-400 bg-amber-400' : 'border-gray-300'
                      }`}>
                        {selectedProgram === p.title && <IconResolver name="Check" className="text-white" size={12} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Character */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Предводитель праздника (Любимый герой):
                </label>
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none font-bold text-black transition-all cursor-pointer"
                >
                  <option value="Без аниматора (Только шоу)">Без аниматора (Только само шоу программы)</option>
                  {characters.map((char) => (
                    <option key={char.id} value={char.name}>
                      {char.name} ({char.category === 'girls' ? 'Девочкам' : char.category === 'boys' ? 'Мальчикам' : char.category === 'teens' ? 'Подросткам' : 'Всем'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Super Add-ons */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Сказочные дополнения к празднику:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setAddCake(!addCake)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                      addCake ? 'border-amber-400 bg-amber-50/30 font-extrabold' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">🎂</span>
                    <div className="text-left">
                      <p className="text-xs font-black text-black">Именинный торт</p>
                      <p className="text-[10px] text-gray-500 font-bold">+450 руб.</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setAddConfetti(!addConfetti)}
                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                      addConfetti ? 'border-amber-400 bg-amber-50/30 font-extrabold' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xl">✨</span>
                    <div className="text-left">
                      <p className="text-xs font-black text-black">Блеск & конфетти</p>
                      <p className="text-[10px] text-gray-500 font-bold">+250 руб.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <p className="text-gray-600 font-semibold text-sm text-center">
                Осталось совсем чуть-чуть! Укажите ваши контакты, чтобы забронировать дату за вашим праздником.
              </p>

              {/* Parent Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">
                  Как к вам обращаться? (Имя родителя) *
                </label>
                <input 
                  type="text" 
                  placeholder="Мама Анна, папа Сергей..." 
                  value={parentName}
                  onChange={(e) => {
                    setParentName(e.target.value);
                    if (errors.parentName) {
                      const eTmp = { ...errors };
                      delete eTmp.parentName;
                      setErrors(eTmp);
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none font-bold text-black transition-all placeholder:text-gray-400"
                />
                {errors.parentName && (
                  <span className="text-red-500 text-xs font-bold mt-1 block">{errors.parentName}</span>
                )}
              </div>

              {/* Parent Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">
                  Ваш номер мобильной связи *
                </label>
                <input 
                  type="tel" 
                  placeholder="+373 (777) XX-XX-XX" 
                  value={parentPhone}
                  onChange={(e) => {
                    setParentPhone(e.target.value);
                    if (errors.parentPhone) {
                      const eTmp = { ...errors };
                      delete eTmp.parentPhone;
                      setErrors(eTmp);
                    }
                  }}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none font-bold text-black transition-all placeholder:text-gray-400"
                />
                {errors.parentPhone && (
                  <span className="text-red-500 text-xs font-bold mt-1 block">{errors.parentPhone}</span>
                )}
              </div>

              {/* Custom wishes */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 text-left">
                  Особые пожелания или детали (необязательно)
                </label>
                <textarea 
                  placeholder="Например: любимая музыка ребенка, особенности места..." 
                  rows={2}
                  value={specificWishes}
                  onChange={(e) => setSpecificWishes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border-2 border-transparent focus:border-amber-400 focus:bg-white outline-none font-medium text-black transition-all placeholder:text-gray-400"
                />
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border-2 border-red-100 rounded-xl text-red-600 text-xs font-bold text-center">
                  ⚠ {submitError}
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 text-center animate-bounceIn">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 animate-bounce">
                <IconResolver name="Check" size={32} />
              </div>

              <div>
                <h4 className="text-2xl font-black text-black leading-tight">Билет успешно оформлен!</h4>
                <p className="text-gray-500 font-semibold text-sm mt-1">
                  Мы забронировали для вас предварительную дату. Менеджер сестёр Инны или Марьяны свяжется с вами в течение 15 минут!
                </p>
              </div>

              {/* Scaled magical Ticket Container */}
              <div className="relative border-4 border-dashed border-amber-400 rounded-2xl p-5 bg-amber-50/50 text-left space-y-3.5 shadow-sm overflow-hidden" id="magical-ticket-printable">
                {/* Ticket notch cutouts */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r-4 border-dashed border-amber-400" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l-4 border-dashed border-amber-400" />

                <div className="flex justify-between items-center pb-2 border-b border-amber-400/20">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
                    <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Мультипраздник</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gray-500">
                    Код: {ticketId}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Именинник</span>
                    <span className="text-black text-sm uppercase">{childName} ({childAge} лет)</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Дата и время</span>
                    <span className="text-black text-sm">{eventDate} в {eventTime}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-400 uppercase block">Сценарий праздника</span>
                    <span className="text-black text-sm">{selectedProgram}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Ведущий герой</span>
                    <span className="text-black text-sm">{selectedCharacter}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 uppercase block">Расчетная стоимость</span>
                    <span className="text-amber-500 text-base font-black">~{calcPrice()} руб. ПМР</span>
                  </div>
                </div>

                <div className="bg-white/80 p-2 rounded-lg text-center text-[10px] font-bold text-gray-500 animate-pulse">
                  🌟 Покажите этот билет менеджеру для активации сладкого сюрприза!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Actions Footer */}
        <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          {step < 4 ? (
            <>
              <div className="text-left">
                <span className="text-[10px] text-gray-400 font-black block uppercase tracking-wider">Примерный итог:</span>
                <span className="text-base font-black text-amber-500 whitespace-nowrap">
                  {calcPrice()} руб. ПМР
                </span>
              </div>

              <div className="flex gap-2">
                {step > 1 && (
                  <button 
                    onClick={() => setStep(step - 1)}
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl font-bold bg-gray-200 text-black hover:bg-gray-300 disabled:opacity-50 transition-all text-xs cursor-pointer"
                  >
                    Назад
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (step === 1 && validateStep1()) {
                      setStep(2);
                    } else if (step === 2) {
                      setStep(3);
                    } else if (step === 3) {
                      handleSubmitBooking();
                    }
                  }}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl font-black text-white bg-black hover:bg-amber-400 hover:text-black transition-all text-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  id={`wizard-next-btn-step-${step}`}
                >
                  <span>{isSubmitting ? 'Магия...' : step === 3 ? 'Завершить волшебство' : 'Далее'}</span>
                  <IconResolver name="ChevronRight" size={14} />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={onClose}
              className="w-full py-3 rounded-xl font-bold text-white bg-black hover:bg-amber-400 hover:text-black shadow-md transition-all text-sm cursor-pointer"
              id="wizard-conclude-btn"
            >
              Закрыть сказку
            </button>
          )}
        </div>
      </div>

      {/* Простые вспомогательные CSS стили для анимаций внутри SPA */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.9); }
          50% { transform: scale(1.02); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-bounceIn {
          animation: bounceIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
}
