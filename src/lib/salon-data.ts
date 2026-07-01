export interface Staff {
  id: number;
  name: string;
  role: string;
  status: 'work' | 'break' | 'off';
  hoursToday: number;
  hoursWeek: number;
  revenue: number;
  sessions: number;
  rating: number;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
  desc: string;
}

export interface Sale {
  id: number;
  time: string;
  service: string;
  staff: string;
  client: string;
  amount: number;
  method: 'card' | 'cash';
}

export const staff: Staff[] = [
  { id: 1, name: 'Анна Петрова', role: 'Массажист-терапевт', status: 'work', hoursToday: 6.5, hoursWeek: 34, revenue: 84200, sessions: 42, rating: 4.9 },
  { id: 2, name: 'Игорь Соколов', role: 'Мастер спортивного массажа', status: 'work', hoursToday: 5, hoursWeek: 31, revenue: 76800, sessions: 38, rating: 4.8 },
  { id: 3, name: 'Мария Ким', role: 'Специалист тайского массажа', status: 'break', hoursToday: 4, hoursWeek: 28, revenue: 61400, sessions: 29, rating: 5.0 },
  { id: 4, name: 'Дмитрий Волков', role: 'Массажист', status: 'work', hoursToday: 7, hoursWeek: 36, revenue: 58900, sessions: 33, rating: 4.7 },
  { id: 5, name: 'Елена Рощина', role: 'Мастер SPA-программ', status: 'off', hoursToday: 0, hoursWeek: 22, revenue: 47300, sessions: 24, rating: 4.9 },
];

export const services: Service[] = [
  { id: 1, name: 'Классический массаж спины', duration: 45, price: 2500, category: 'Классика', desc: 'Расслабляющая проработка мышц спины и шейно-воротниковой зоны' },
  { id: 2, name: 'Общий массаж тела', duration: 90, price: 4200, category: 'Классика', desc: 'Комплексная работа со всеми группами мышц' },
  { id: 3, name: 'Спортивный массаж', duration: 60, price: 3400, category: 'Спорт', desc: 'Восстановление и подготовка мышц для активных людей' },
  { id: 4, name: 'Тайский массаж', duration: 90, price: 4800, category: 'Восток', desc: 'Традиционные техники с элементами йога-стретчинга' },
  { id: 5, name: 'Антицеллюлитный массаж', duration: 60, price: 3200, category: 'SPA', desc: 'Интенсивная коррекция и лимфодренаж' },
  { id: 6, name: 'Стоун-терапия', duration: 75, price: 3900, category: 'SPA', desc: 'Массаж горячими вулканическими камнями' },
];

export const sales: Sale[] = [
  { id: 1, time: '09:15', service: 'Классический массаж спины', staff: 'Анна Петрова', client: 'Ольга М.', amount: 2500, method: 'card' },
  { id: 2, time: '10:30', service: 'Спортивный массаж', staff: 'Игорь Соколов', client: 'Андрей К.', amount: 3400, method: 'card' },
  { id: 3, time: '11:00', service: 'Тайский массаж', staff: 'Мария Ким', client: 'Ирина В.', amount: 4800, method: 'cash' },
  { id: 4, time: '12:20', service: 'Общий массаж тела', staff: 'Дмитрий Волков', client: 'Сергей Л.', amount: 4200, method: 'card' },
  { id: 5, time: '13:45', service: 'Стоун-терапия', staff: 'Анна Петрова', client: 'Юлия Р.', amount: 3900, method: 'card' },
  { id: 6, time: '14:30', service: 'Антицеллюлитный массаж', staff: 'Мария Ким', client: 'Наталья С.', amount: 3200, method: 'cash' },
];

export const revenueWeek = [
  { day: 'Пн', value: 62 },
  { day: 'Вт', value: 78 },
  { day: 'Ср', value: 54 },
  { day: 'Чт', value: 91 },
  { day: 'Пт', value: 118 },
  { day: 'Сб', value: 134 },
  { day: 'Вс', value: 87 },
];

export const money = (n: number) => n.toLocaleString('ru-RU') + ' ₽';
