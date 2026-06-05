import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking, Program, Character } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
  characters: Character[];
}

export default function AdminPanel({ isOpen, onClose, programs, characters }: AdminPanelProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'calendar' | 'list' | 'stats'>('calendar');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) throw new Error('Не удалось загрузить данные');
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
    } catch (err) { console.error(err); } finally { setIsLoading(false); }
  };

  useEffect(() => { if (isOpen && isUnlocked) fetchBookings(); }, [isOpen, isUnlocked]);

  const handleUpdateStatus = async (id: string, status: string) => {
    await fetch(`/api/bookings/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchBookings();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white rounded-3xl w-full max-w-5xl shadow-2xl border-4 border-black flex flex-col max-h-[92vh] overflow-hidden">
          <div className="p-6 bg-black text-white flex justify-between items-center">
            <h3 className="text-xl font-black uppercase tracking-wider">Панель администратора</h3>
            <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full hover:bg-amber-400 hover:text-black transition-all">✕</button>
          </div>

          {!isUnlocked ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gray-50">
              <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} className="mb-4 px-6 py-3 border-2 border-black rounded-xl text-center font-bold" placeholder="Введите пароль..." />
              <button onClick={() => passcode === 'multiprazdnik_2010_admin' && setIsUnlocked(true)} className="px-8 py-3 bg-black text-white font-black rounded-xl uppercase hover:bg-amber-400 hover:text-black">Войти</button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex border-b border-gray-200">
                {['calendar', 'list', 'stats'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-8 py-4 font-black text-xs uppercase ${activeTab === tab ? 'bg-amber-400 text-black' : 'hover:bg-gray-100'}`}>
                    {tab === 'calendar' ? '📅 Календарь' : tab === 'list' ? '📋 Заказы' : '📊 Статистика'}
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                {activeTab === 'calendar' && (
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3 grid grid-cols-7 gap-2">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} onClick={() => setSelectedDateFilter(`2026-06-${(i+1).toString().padStart(2, '0')}`)} className="aspect-square bg-white border border-gray-200 rounded-xl p-2 cursor-pointer hover:border-amber-400">
                          <span className="font-bold">{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white p-4 rounded-2xl border shadow-sm">
                      <h5 className="font-black text-xs mb-4">Заказы на дату</h5>
                      <div className="space-y-2">
                        {bookings.filter(b => b.eventDate === selectedDateFilter).map(b => (
                          <div key={b.id} className="p-3 text-[10px] border rounded-lg bg-gray-50">
                            <p className="font-black">{b.childName} | {b.eventTime}</p>
                            <div className="flex gap-1 mt-2">
                              <button onClick={() => handleUpdateStatus(b.id, 'confirmed')} className="bg-green-100 p-1 rounded">✔</button>
                              <button onClick={() => handleUpdateStatus(b.id, 'completed')} className="bg-blue-100 p-1 rounded">🏁</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'list' && (
                  <div className="bg-white rounded-2xl border overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-black text-white">
                        <tr><th className="p-3">Код</th><th className="p-3">Ребенок</th><th className="p-3">Статус</th><th className="p-3">Действия</th></tr>
                      </thead>
                      <tbody>
                        {bookings.map(b => (
                          <tr key={b.id} className="border-b">
                            <td className="p-3 font-mono">{b.ticketId}</td>
                            <td className="p-3 font-bold">{b.childName}</td>
                            <td className="p-3"><span className={`px-2 py-1 rounded ${b.status === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>{b.status}</span></td>
                            <td className="p-3 flex gap-2">
                              <button onClick={() => handleUpdateStatus(b.id, 'completed')} className="bg-blue-500 text-white px-2 py-1 rounded">Завершить</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}