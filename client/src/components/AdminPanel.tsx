import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Booking, Program, Character } from '../types';
import { 
  getBookings, 
  saveBookings, 
  addBooking, 
  updateBookingStatus, 
  deleteBooking 
} from '../lib/bookingStorage';
import { IconResolver } from './MagicIcons';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
  characters: Character[];
}

export default function AdminPanel({
  isOpen,
  onClose,
  programs,
  characters
}: AdminPanelProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'stats'>('calendar');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  // Manual booking form states
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('6');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventTime, setNewEventTime] = useState('14:00');
  const [newSelectedProgram, setNewSelectedProgram] = useState(programs[0]?.title || '');
  const [newSelectedCharacter, setNewSelectedCharacter] = useState(characters[0]?.name || 'Без аниматора');
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newWishes, setNewWishes] = useState('');
  const [newAddCake, setNewAddCake] = useState(false);
  const [newAddConfetti, setNewAddConfetti] = useState(false);
  const [newCustomPrice, setNewCustomPrice] = useState('1100');

  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 5, 1)); // Default June 2026!

  // Password gate
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');

  // Search and program filter for the booking list
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');

  // Функция получения записей с бэкенда PostgreSQL
  const fetchBookings = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        throw new Error('Не удалось загрузить бронирования с сервера');
      }
      const data = await response.json();
      
      // Приводим поля snake_case из Postgres к camelCase для фронтенда
      const formattedBookings: Booking[] = data.map((b: any) => ({
        id: b.id.toString(),
        ticketId: b.ticket_id,
        childName: b.child_name,
        childAge: b.child_age,
        eventDate: b.event_date.split('T')[0], // форматируем дату в YYYY-MM-DD
        eventTime: b.event_time,
        selectedProgram: b.selected_program,
        selectedCharacter: b.selected_character,
        parentName: b.parent_name,
        parentPhone: b.parent_phone,
        specificWishes: b.specific_wishes,
        addCake: b.add_cake,
        addConfetti: b.add_confetti,
        totalPrice: b.total_price,
        status: b.status
      }));

      setBookings(formattedBookings);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || 'Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  // Получаем бронирования при открытии админки
  useEffect(() => {
    if (isOpen && isUnlocked) {
      fetchBookings();
    }
  }, [isOpen, isUnlocked]);

  // Handle passcode auth for visual security
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'multiprazdnik_2010_admin') {
      setIsUnlocked(true);
      setPassError('');
    } else {
      setPassError('Неверный код доступа. В доступе отказано.');
    }
  };

  // Обновление статуса на сервере PostgreSQL
  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    try {
      const response = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Не удалось обновить статус на сервере');
      }
      
      // Обновляем состояние на клиенте
      setBookings(prev => 
        prev.map(b => b.id === id ? { ...b, status } : b)
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Создание ручного бронирования в базу
  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName || !newEventDate || !newParentPhone) {
      alert('Заполните обязательные поля: Имя ребенка, Дата праздника и Телефон!');
      return;
    }

    const ticketId = 'MP-ADM-' + Math.floor(10000 + Math.random() * 90000);
    const bookingData = {
      ticketId,
      childName: newChildName,
      childAge: parseInt(newChildAge, 10) || 6,
      eventDate: newEventDate,
      eventTime: newEventTime,
      selectedProgram: newSelectedProgram,
      selectedCharacter: newSelectedCharacter,
      parentName: newParentName || 'Администратор',
      parentPhone: newParentPhone,
      specificWishes: newWishes,
      addCake: newAddCake,
      addConfetti: newAddConfetti,
      totalPrice: parseInt(newCustomPrice, 10) || 1000,
      status: 'confirmed'
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при сохранении ручной записи');
      }

      alert('Бронирование успешно внесено в календарь PostgreSQL!');
      setIsAddingBooking(false);
      
      // Сбрасываем форму
      setNewChildName('');
      setNewEventDate('');
      setNewParentPhone('');
      setNewWishes('');
      
      // Перезагружаем записи
      fetchBookings();
    } catch (err: any) {
      alert(`Ошибка: ${err.message}`);
    }
  };

  // Вспомогательные функции рендеринга календаря
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = [];
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Сдвиг для того чтобы неделя начиналась с Понедельника (а не с Воскресенья)
    const normalizedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    // Пустые ячейки для начала месяца
    for (let i = 0; i < normalizedFirstDay; i++) {
      days.push(null);
    }
    // Дни месяца
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getDayBookings = (dayDate: Date) => {
    const formattedStr = dayDate.toISOString().split('T')[0];
    return bookings.filter(b => b.eventDate === formattedStr);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with standard CSS transitions */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300" onClick={onClose} />

      {/* Modal Main container */}
      <div 
        className="relative bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl border-4 border-black z-10 flex flex-col max-h-[92vh] animate-modalEntry"
      >
        {/* HEADER */}
        <div className="p-6 bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔑</span>
            <div>
              <h3 className="text-xl font-black uppercase tracking-wider">Панель Управления</h3>
              <p className="text-xs text-amber-400 font-bold">Синхронизировано с базой PostgreSQL</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-zinc-800 hover:bg-amber-400 hover:text-black transition-all cursor-pointer">
            <IconResolver name="X" size={20} />
          </button>
        </div>

        {/* PASSWORD LOCK GUARD */}
        {!isUnlocked ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center bg-gray-50 min-h-[400px]">
            <div className="max-w-md w-full bg-white p-6 rounded-2xl shadow-md border-2 border-gray-100 text-center space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl">🔒</div>
              <h4 className="text-lg font-extrabold text-black">Вход в панель администратора</h4>
              <p className="text-xs text-gray-500 font-bold">Введите пароль для управления бронированиями и календарем студии:</p>
              <form onSubmit={handleUnlock} className="space-y-3">
                <input 
                  type="password" 
                  placeholder="Пароль администратора..." 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-transparent focus:border-amber-400 focus:bg-white rounded-xl text-center font-bold text-black outline-none transition-all"
                />
                {passError && <p className="text-xs text-red-500 font-bold">{passError}</p>}
                
                {/* ПРИМЕЧАНИЕ ДЛЯ РАЗРАБОТЧИКА / ДЕМО */}
                <p className="text-[10px] text-gray-400 italic">Подсказка: multiprazdnik_2010_admin</p>

                <button type="submit" className="w-full py-2.5 bg-black hover:bg-amber-400 hover:text-black text-white font-extrabold rounded-xl transition-all text-xs uppercase tracking-wider cursor-pointer">
                  Подтвердить и войти
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* ADMIN CONTROL INTERFACE */}
            <div className="flex bg-gray-100 border-b border-gray-200">
              <button 
                onClick={() => { setActiveTab('calendar'); setSelectedDateFilter(null); }}
                className={`px-6 py-4 font-extrabold text-xs uppercase tracking-wider transition-all border-b-4 ${activeTab === 'calendar' ? 'border-amber-400 bg-white text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
              >
                📅 Интерактивный Календарь
              </button>
              <button 
                onClick={() => setActiveTab('list')}
                className={`px-6 py-4 font-extrabold text-xs uppercase tracking-wider transition-all border-b-4 ${activeTab === 'list' ? 'border-amber-400 bg-white text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
              >
                📋 Все Заказы ({bookings.length})
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`px-6 py-4 font-extrabold text-xs uppercase tracking-wider transition-all border-b-4 ${activeTab === 'stats' ? 'border-amber-400 bg-white text-black' : 'border-transparent text-gray-500 hover:text-black'}`}
              >
                📊 Статистика & Выручка
              </button>
            </div>

            {/* MAIN SCROLLABLE WRAPPER */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50 max-h-[60vh]">
              {isLoading ? (
                <div className="text-center py-12">
                  <span className="text-3xl animate-spin inline-block">⭐</span>
                  <p className="text-xs font-bold text-gray-500 mt-2">Загрузка данных из PostgreSQL базы...</p>
                </div>
              ) : apiError ? (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-center text-sm font-bold">
                  ⚠ {apiError}
                </div>
              ) : (
                <>
                  {/* 1. TAB: INTERACTIVE CALENDAR */}
                  {activeTab === 'calendar' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-tabFadeIn">
                      {/* Month block calendar */}
                      <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-xs border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-black text-black text-lg">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                          </h4>
                          <div className="flex gap-1">
                            <button onClick={prevMonth} className="p-1.5 rounded-lg bg-gray-100 hover:bg-amber-400 hover:text-black transition-all cursor-pointer">
                              <IconResolver name="ChevronLeft" size={14} />
                            </button>
                            <button onClick={nextMonth} className="p-1.5 rounded-lg bg-gray-100 hover:bg-amber-400 hover:text-black transition-all cursor-pointer">
                              <IconResolver name="ChevronRight" size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">
                          <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {getDaysInMonth(currentMonth).map((day, idx) => {
                            if (!day) return <div key={`empty-${idx}`} className="aspect-square bg-gray-50/50 rounded-lg" />;
                            
                            const bList = getDayBookings(day);
                            const formattedDate = day.toISOString().split('T')[0];
                            const isSelected = selectedDateFilter === formattedDate;

                            return (
                              <div 
                                key={formattedDate}
                                onClick={() => setSelectedDateFilter(isSelected ? null : formattedDate)}
                                className={`aspect-square p-1 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                                  isSelected 
                                    ? 'border-amber-400 bg-amber-50 shadow-xs' 
                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                }`}
                              >
                                <span className={`text-xs font-black self-start px-1 rounded ${day.getDay() === 0 || day.getDay() === 6 ? 'text-red-500' : 'text-gray-700'}`}>
                                  {day.getDate()}
                                </span>
                                {bList.length > 0 && (
                                  <span className="text-[9px] font-extrabold text-white bg-black rounded px-1 py-0.5 text-center">
                                    {bList.length} праздн.
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Detail sidebar block for selected date */}
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b">
                          <h5 className="font-extrabold text-black text-sm">
                            {selectedDateFilter ? `Заказы на: ${selectedDateFilter}` : 'Все ближайшие праздники'}
                          </h5>
                          <button 
                            onClick={() => setIsAddingBooking(true)}
                            className="px-3 py-1.5 bg-black hover:bg-amber-400 hover:text-black text-white text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer"
                          >
                            + Внести вручную
                          </button>
                        </div>

                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          {(selectedDateFilter 
                            ? bookings.filter(b => b.eventDate === selectedDateFilter) 
                            : bookings.slice(0, 5)
                          ).map(b => (
                            <div key={b.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 relative space-y-1">
                              <div className="flex justify-between text-[10px]">
                                <span className="font-mono text-gray-500">{b.ticketId}</span>
                                <span className="font-bold text-amber-500">{b.eventTime}</span>
                              </div>
                              <h6 className="font-black text-xs text-black uppercase">{b.childName} ({b.childAge} лет)</h6>
                              <p className="text-[10px] font-semibold text-gray-600 line-clamp-1">Шоу: {b.selectedProgram}</p>
                              <p className="text-[10px] font-semibold text-gray-600">Тел: <a href={`tel:${b.parentPhone}`} className="underline text-black font-bold">{b.parentPhone}</a></p>
                              <div className="flex gap-2 mt-2 pt-2 border-t justify-end">
                                {b.status === 'pending' && (
                                  <button 
                                    onClick={() => handleUpdateStatus(b.id, 'confirmed')}
                                    className="px-2 py-1 bg-green-500 text-white rounded text-[9px] font-bold"
                                  >
                                    Подтвердить
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleUpdateStatus(b.id, 'cancelled')}
                                  className="px-2 py-1 bg-red-500 text-white rounded text-[9px] font-bold"
                                >
                                  Отменить
                                </button>
                              </div>
                            </div>
                          ))}
                          {(selectedDateFilter ? bookings.filter(b => b.eventDate === selectedDateFilter) : bookings).length === 0 && (
                            <p className="text-xs text-center text-gray-400 font-bold py-12">Нет запланированных праздников на этот период</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. TAB: COMPLETE LIST VIEW WITH FILTERS */}
                  {activeTab === 'list' && (
                    <div className="space-y-4 animate-tabFadeIn">
                      <div className="flex flex-col md:flex-row gap-2 justify-between">
                        <input 
                          type="text"
                          placeholder="Поиск по имени ребенка, родителя или коду..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="px-4 py-2 bg-white border rounded-xl text-xs font-bold w-full md:max-w-xs outline-none"
                        />
                        <select 
                          value={programFilter} 
                          onChange={(e) => setProgramFilter(e.target.value)}
                          className="px-3 py-2 bg-white border rounded-xl text-xs font-bold"
                        >
                          <option value="all">Все программы</option>
                          {programs.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                        </select>
                      </div>

                      <div className="bg-white rounded-2xl border overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-black text-white font-bold uppercase">
                              <th className="p-3">Код</th>
                              <th className="p-3">Именинник</th>
                              <th className="p-3">Дата/Время</th>
                              <th className="p-3">Программа</th>
                              <th className="p-3">Телефон</th>
                              <th className="p-3">Статус</th>
                              <th className="p-3">Итог</th>
                            </tr>
                          </thead>
                          <tbody className="font-bold text-gray-700">
                            {bookings
                              .filter(b => {
                                const search = searchTerm.toLowerCase();
                                  return (
                                    b.childName.toLowerCase().includes(search) || 
                                    b.parentName.toLowerCase().includes(search) || 
                                    b.ticketId.toLowerCase().includes(search)
                                  );
                                })
                                .filter(b => programFilter === 'all' || b.selectedProgram === programFilter)
                                .map(b => (
                                  <tr key={b.id} className="border-b hover:bg-gray-50/50">
                                    <td className="p-3 font-mono">{b.ticketId}</td>
                                    <td className="p-3">{b.childName} ({b.childAge} лет)</td>
                                    <td className="p-3">{b.eventDate} в {b.eventTime}</td>
                                    <td className="p-3">{b.selectedProgram}</td>
                                    <td className="p-3">{b.parentPhone}</td>
                                    <td className="p-3">
                                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                                        b.status === 'confirmed' ? 'bg-green-100 text-green-700' : b.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                      }`}>
                                        {b.status === 'confirmed' ? 'Одобрен' : b.status === 'cancelled' ? 'Отмена' : 'Ожидает'}
                                      </span>
                                    </td>
                                    <td className="p-3 text-black font-black">{b.totalPrice} руб.</td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* 3. TAB: STATISTICS & REVENUE */}
                  {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-tabFadeIn">
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-center">
                        <span className="text-2xl">💰</span>
                        <h5 className="text-gray-400 text-xs font-black uppercase mt-1">Подтвержденная выручка</h5>
                        <p className="text-2xl font-black text-green-600 mt-2">
                          {bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + b.totalPrice, 0)} руб. ПМР
                        </p>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-center">
                        <span className="text-2xl">📋</span>
                        <h5 className="text-gray-400 text-xs font-black uppercase mt-1">Всего праздников в базе</h5>
                        <p className="text-2xl font-black text-black mt-2">{bookings.length}</p>
                      </div>
                      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-center">
                        <span className="text-2xl">⚡</span>
                        <h5 className="text-gray-400 text-xs font-black uppercase mt-1">Ожидают подтверждения</h5>
                        <p className="text-2xl font-black text-amber-500 mt-2">
                          {bookings.filter(b => b.status === 'pending').length} заявок
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* MANUAL BOOKING CREATOR OVERLAY MODAL */}
      {isAddingBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsAddingBooking(false)} />
          <div 
            className="relative bg-white rounded-2xl max-w-lg w-full p-6 border-4 border-black shadow-2xl z-20 space-y-4 max-h-[85vh] overflow-y-auto animate-modalEntry"
          >
            <h4 className="text-lg font-black text-black uppercase">Внести праздник вручную</h4>
            <form onSubmit={handleCreateManualBooking} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-700">Имя ребенка *</label>
                <input type="text" required value={newChildName} onChange={e => setNewChildName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700">Возраст ребенка</label>
                <input type="number" value={newChildAge} onChange={e => setNewChildAge(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700">Дата торжества *</label>
                <input type="date" required value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700">Желаемое время</label>
                <input type="text" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs" />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-700">Выбор шоу-программы</label>
                <select value={newSelectedProgram} onChange={e => setNewSelectedProgram(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs">
                  {programs.map(p => <option key={p.id} value={p.title}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700">Любимый персонаж</label>
                <select value={newSelectedCharacter} onChange={e => setNewSelectedCharacter(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs">
                  <option value="Без аниматора">Без аниматора</option>
                  {characters.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700">Телефон связи *</label>
                <input type="tel" required value={newParentPhone} onChange={e => setNewParentPhone(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs" />
              </div>
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-700">Пожелания</label>
                <textarea value={newWishes} onChange={e => setNewWishes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700">Цена услуги (руб.)</label>
                <input type="number" value={newCustomPrice} onChange={e => setNewCustomPrice(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs" />
              </div>
              <div className="flex gap-4 items-center pt-4">
                <label className="flex items-center gap-1.5 text-xs font-bold">
                  <input type="checkbox" checked={newAddCake} onChange={e => setNewAddCake(e.target.checked)} /> Торт
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold">
                  <input type="checkbox" checked={newAddConfetti} onChange={e => setNewAddConfetti(e.target.checked)} /> Спецэффекты
                </label>
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddingBooking(false)} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-xs font-bold rounded-lg transition-all">Отмена</button>
                <button type="submit" className="px-5 py-2 bg-black hover:bg-amber-400 hover:text-black text-white text-xs font-bold rounded-lg transition-all">Сохранить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Плавные CSS-анимации на замену motion */}
      <style>{`
        @keyframes modalEntry {
          from { opacity: 0; transform: scale(0.95) translateY(15px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes tabFadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-modalEntry {
          animation: modalEntry 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-tabFadeIn {
          animation: tabFadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );}
