import React, { useState, useEffect } from 'react';
import { Booking, Program, Character } from '../types';
import { IconResolver } from './MagicIcons';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
  characters: Character[];
}

export default function AdminPanel({ isOpen, onClose, programs, characters }: AdminPanelProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'stats'>('calendar');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => new Date(2026, 5, 1));
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [programFilter, setProgramFilter] = useState('all');

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Ошибка загрузки данных');
      const data = await response.json();
      setBookings(data.map((b: any) => ({
        id: b.id.toString(),
        ticketId: b.ticket_id,
        childName: b.child_name,
        childAge: b.child_age,
        eventDate: b.event_date.split('T')[0],
        eventTime: b.event_time,
        selectedProgram: b.selected_program,
        status: b.status,
        parentPhone: b.parent_phone,
        totalPrice: b.total_price
      })));
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { if (isOpen && isUnlocked) fetchBookings(); }, [isOpen, isUnlocked]);

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    try {
      await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) { alert('Ошибка при обновлении статуса'); }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-600 text-white';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl border-4 border-black flex flex-col max-h-[92vh] animate-modalEntry">
        <div className="p-6 bg-black text-white flex justify-between items-center">
          <h3 className="text-xl font-black uppercase">Панель Управления</h3>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-white hover:text-black">✕</button>
        </div>

        {!isUnlocked ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
            <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} className="mb-4 px-4 py-2 border rounded-xl" placeholder="Пароль..." />
            <button onClick={() => { if(passcode === 'multiprazdnik_2010_admin') setIsUnlocked(true); else setPassError('Неверно'); }} className="px-6 py-2 bg-black text-white rounded-xl">Войти</button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex bg-gray-100 border-b">
              {['calendar', 'list', 'stats'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-4 font-black text-xs uppercase ${activeTab === tab ? 'bg-white border-b-4 border-amber-400' : ''}`}>
                  {tab === 'calendar' ? '📅 Календарь' : tab === 'list' ? '📋 Заказы' : '📊 Статистика'}
                </button>
              ))}
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'calendar' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 grid grid-cols-7 gap-1">
                    {Array.from({ length: 30 }).map((_, i) => {
                      const day = i + 1;
                      const dayBookings = bookings.filter(b => parseInt(b.eventDate.split('-')[2]) === day);
                      return (
                        <div key={i} onClick={() => setSelectedDateFilter(`2026-06-${day.toString().padStart(2, '0')}`)} className="h-24 p-1 border rounded bg-white hover:bg-amber-50 cursor-pointer">
                          <span className="text-[10px] font-bold">{day}</span>
                          <div className="flex flex-col gap-0.5 mt-1">
                            {dayBookings.map(b => (
                              <div key={b.id} className={`text-[8px] truncate px-1 rounded ${b.status === 'completed' ? 'bg-blue-600 text-white' : 'bg-black text-white'}`}>
                                {b.eventTime} {b.childName}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h5 className="font-black mb-4 text-xs">Детали: {selectedDateFilter || 'Выберите дату'}</h5>
                    <div className="space-y-3">
                      {bookings.filter(b => b.eventDate === selectedDateFilter).map(b => (
                        <div key={b.id} className="p-3 bg-gray-50 rounded-lg text-[10px] font-bold border">
                          <p>{b.childName} | {b.selectedProgram}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            <button onClick={() => handleUpdateStatus(b.id, 'confirmed')} className="bg-green-500 text-white px-1.5 py-0.5 rounded">Подтв.</button>
                            <button onClick={() => handleUpdateStatus(b.id, 'completed')} className="bg-blue-600 text-white px-1.5 py-0.5 rounded">Выполнено</button>
                            <button onClick={() => handleUpdateStatus(b.id, 'cancelled')} className="bg-red-500 text-white px-1.5 py-0.5 rounded">Отмена</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes modalEntry { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}