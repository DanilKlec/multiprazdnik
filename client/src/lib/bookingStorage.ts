import { Booking } from '../types';

const STORAGE_KEY = 'multiprazdnik_bookings';

const INITIAL_SEED_BOOKINGS: Booking[] = [
  {
    id: 'seed-1',
    ticketId: 'MP-837422',
    childName: 'Никита',
    childAge: 11,
    eventDate: '2026-06-04',
    eventTime: '14:00',
    selectedProgram: 'Игра в кальмара',
    selectedCharacter: 'Уэнсдей',
    parentName: 'Мама Елена',
    parentPhone: '+373 (778) 12-34-56',
    specificWishes: 'Ребенок очень любит этот сериал. Сюрприз в конце программы!',
    addCake: true,
    addConfetti: true,
    totalPrice: 1500,
    createdAt: '2026-06-01T10:30:11.000Z',
    status: 'confirmed'
  },
  {
    id: 'seed-2',
    ticketId: 'MP-910405',
    childName: 'Стефания',
    childAge: 12,
    eventDate: '2026-06-05',
    eventTime: '16:00',
    selectedProgram: 'Уэнсдей',
    selectedCharacter: 'Уэнсдей',
    parentName: 'Мама Кристина',
    parentPhone: '+373 (779) 54-32-10',
    specificWishes: 'Сделайте побольше кадров готического танца',
    addCake: false,
    addConfetti: true,
    totalPrice: 1300,
    createdAt: '2026-06-02T12:15:33.000Z',
    status: 'confirmed'
  },
  {
    id: 'seed-3',
    ticketId: 'MP-112349',
    childName: 'Алина',
    childAge: 13,
    eventDate: '2026-06-10',
    eventTime: '18:00',
    selectedProgram: 'Барби вечеринка',
    selectedCharacter: 'Без аниматора (Только шоу)',
    parentName: 'Мама Светлана',
    parentPhone: '+373 (775) 22-44-44',
    specificWishes: 'Предпочитают много розовых воздушных шаров',
    addCake: true,
    addConfetti: true,
    totalPrice: 1750,
    createdAt: '2026-06-02T15:00:22.000Z',
    status: 'pending'
  },
  {
    id: 'seed-4',
    ticketId: 'MP-772834',
    childName: 'Даниил',
    childAge: 9,
    eventDate: '2026-06-12',
    eventTime: '12:00',
    selectedProgram: 'Вечеринка спецназ',
    selectedCharacter: 'Вечеринка спецназ',
    parentName: 'Папа Андрей',
    parentPhone: '+373 (777) 99-88-77',
    specificWishes: 'Активные мальчишки, нужно побегать во дворе дома',
    addCake: false,
    addConfetti: false,
    totalPrice: 1300,
    createdAt: '2026-05-30T09:11:00.000Z',
    status: 'confirmed'
  },
  {
    id: 'seed-5',
    ticketId: 'MP-445831',
    childName: 'Тимофей',
    childAge: 4,
    eventDate: '2026-06-15',
    eventTime: '10:00',
    selectedProgram: 'Щенячий патруль',
    selectedCharacter: 'Щенячий патруль',
    parentName: 'Мама Ирина',
    parentPhone: '+373 (778) 11-12-22',
    specificWishes: 'Пригласите Гонщика, малыши его обожают!',
    addCake: true,
    addConfetti: false,
    totalPrice: 1250,
    createdAt: '2026-06-01T14:45:00.000Z',
    status: 'completed'
  },
  {
    id: 'seed-6',
    ticketId: 'MP-523190',
    childName: 'Максим',
    childAge: 8,
    eventDate: '2026-06-20',
    eventTime: '14:00',
    selectedProgram: 'Амонг ас',
    selectedCharacter: 'Амонг ас',
    parentName: 'Папа Виталий',
    parentPhone: '+373 (779) 66-55-44',
    specificWishes: 'Космический квест прямо в кафе',
    addCake: false,
    addConfetti: true,
    totalPrice: 1550,
    createdAt: '2026-06-02T11:00:00.000Z',
    status: 'confirmed'
  }
];

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_BOOKINGS));
    return INITIAL_SEED_BOOKINGS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_SEED_BOOKINGS;
  }
}

export function saveBookings(bookings: Booking[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: 'booking-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    createdAt: new Date().toISOString()
  };
  bookings.push(newBooking);
  saveBookings(bookings);
  return newBooking;
}

export function updateBookingStatus(id: string, status: Booking['status']): Booking[] {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index !== -1) {
    bookings[index].status = status;
    saveBookings(bookings);
  }
  return bookings;
}

export function deleteBooking(id: string): Booking[] {
  const bookings = getBookings();
  const filtered = bookings.filter(b => b.id !== id);
  saveBookings(filtered);
  return filtered;
}
