export const API = 'https://functions.poehali.dev/e55c0afd-6629-46d1-9c71-249d8315f4ac';

export interface Staff {
  id: number;
  name: string;
  role: string;
  status: 'work' | 'break' | 'off';
  hours_week: number;
  rating: number;
}

export interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
  description: string;
}

export interface Sale {
  id: number;
  created_at: string;
  service_name: string;
  staff_name: string;
  client_name: string;
  amount: number;
  method: 'card' | 'cash';
}

export interface Stats {
  today: { total: number; cnt: number };
  top: { staff_name: string; revenue: number; sessions: number }[];
  week: { day: string; value: number }[];
}

async function req<T>(resource: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${API}?resource=${resource}`, opts);
  return res.json();
}

export const api = {
  getStaff: () => req<{ items: Staff[] }>('staff').then((r) => r.items),
  addStaff: (b: Partial<Staff>) =>
    req<{ item: Staff }>('staff', { method: 'POST', body: JSON.stringify(b) }).then((r) => r.item),
  delStaff: (id: number) => req('staff', { method: 'DELETE', body: JSON.stringify({ id }) }),

  getServices: () => req<{ items: Service[] }>('services').then((r) => r.items),
  addService: (b: Partial<Service>) =>
    req<{ item: Service }>('services', { method: 'POST', body: JSON.stringify(b) }).then((r) => r.item),
  delService: (id: number) => req('services', { method: 'DELETE', body: JSON.stringify({ id }) }),

  getSales: () => req<{ items: Sale[] }>('sales').then((r) => r.items),
  addSale: (b: Partial<Sale>) =>
    req<{ item: Sale }>('sales', { method: 'POST', body: JSON.stringify(b) }).then((r) => r.item),

  getStats: () => req<Stats>('stats'),
};

export const money = (n: number) => Number(n).toLocaleString('ru-RU') + ' ₽';

export const weekDayShort = (iso: string) => {
  const d = new Date(iso);
  return ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'][d.getDay()];
};

export const timeShort = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

export const initials = (name: string) =>
  name.split(' ').map((w) => w[0]).join('').slice(0, 2);
