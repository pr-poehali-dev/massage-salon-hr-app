import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import {
  api, Staff, Service, Sale, Stats,
  money, weekDayShort, timeShort, initials,
} from '@/lib/salon-data';

type Tab = 'dashboard' | 'sales' | 'schedule' | 'staff' | 'services' | 'checkout';

const nav: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Аналитика', icon: 'LayoutDashboard' },
  { id: 'sales', label: 'Продажи', icon: 'Receipt' },
  { id: 'schedule', label: 'Расписание', icon: 'CalendarClock' },
  { id: 'staff', label: 'Сотрудники', icon: 'Users' },
  { id: 'services', label: 'Услуги', icon: 'Sparkles' },
  { id: 'checkout', label: 'Касса', icon: 'CreditCard' },
];

const Index = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);

  const reload = async () => {
    const [st, sv, sl, stat] = await Promise.all([
      api.getStaff(), api.getServices(), api.getSales(), api.getStats(),
    ]);
    setStaff(st); setServices(sv); setSales(sl); setStats(stat);
  };

  useEffect(() => { reload(); }, []);

  const onSale = async (sale: Partial<Sale>) => {
    await api.addSale(sale);
    await reload();
    setTab('sales');
    toast({ title: 'Чек пробит', description: `Продажа на ${money(sale.amount || 0)} сохранена` });
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 shrink-0 border-r border-border bg-card/60 backdrop-blur px-4 py-6 flex flex-col fixed h-screen">
        <div className="flex items-center gap-3 px-2 mb-9">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Icon name="Flower2" size={22} />
          </div>
          <div>
            <p className="font-display font-extrabold text-[15px] leading-tight tracking-tight">Serenity</p>
            <p className="text-[11px] text-muted-foreground">Massage & SPA</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === n.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon name={n.icon} size={18} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 px-3 py-3 rounded-xl bg-secondary">
          <div className="w-9 h-9 rounded-full bg-accent text-accent-foreground grid place-items-center font-semibold text-sm">
            АД
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Администратор</p>
            <p className="text-[11px] text-muted-foreground">Управляющий</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 px-8 py-8 max-w-[1200px]">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-extrabold text-2xl tracking-tight">
              {nav.find((n) => n.id === tab)?.label}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Вторник, 1 июля 2026 · Салон открыт до 22:00
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl border border-border grid place-items-center hover:bg-secondary transition-colors">
              <Icon name="Bell" size={18} />
            </button>
            <button
              onClick={() => setTab('checkout')}
              className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Icon name="Plus" size={16} />
              Новая продажа
            </button>
          </div>
        </header>

        <div key={tab} className="animate-fade-in">
          {tab === 'dashboard' && <Dashboard stats={stats} sales={sales} />}
          {tab === 'sales' && <Sales sales={sales} />}
          {tab === 'schedule' && <Schedule staff={staff} />}
          {tab === 'staff' && <StaffView staff={staff} onReload={reload} />}
          {tab === 'services' && <Services services={services} onReload={reload} />}
          {tab === 'checkout' && <Checkout services={services} staff={staff} onSale={onSale} />}
        </div>
      </main>
    </div>
  );
};

/* ---------------- Dashboard ---------------- */
const Dashboard = ({ stats, sales }: { stats: Stats | null; sales: Sale[] }) => {
  const total = stats?.today.total ?? 0;
  const cnt = stats?.today.cnt ?? 0;
  const avg = cnt ? Math.round(Number(total) / Number(cnt)) : 0;
  const cards = [
    { label: 'Выручка сегодня', value: money(total), sub: 'за смену', icon: 'TrendingUp' },
    { label: 'Продано услуг', value: String(cnt), sub: 'сегодня', icon: 'Receipt' },
    { label: 'Средний чек', value: money(avg), sub: 'сегодня', icon: 'Wallet' },
    { label: 'Всего операций', value: String(sales.length), sub: 'в базе', icon: 'Activity' },
  ];
  const week = stats?.week ?? [];
  const max = Math.max(1, ...week.map((r) => Number(r.value)));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent text-accent-foreground grid place-items-center">
                <Icon name={s.icon} size={18} />
              </div>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{s.sub}</span>
            </div>
            <p className="font-display font-extrabold text-2xl tabular tracking-tight">{s.value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg">Выручка за неделю</h3>
              <p className="text-sm text-muted-foreground">Рублей по дням</p>
            </div>
            <span className="text-sm font-semibold text-primary tabular">
              {money(week.reduce((s, r) => s + Number(r.value), 0))}
            </span>
          </div>
          {week.length === 0 ? (
            <p className="text-sm text-muted-foreground py-16 text-center">Пока нет данных за неделю</p>
          ) : (
            <div className="flex items-end justify-between gap-3 h-48">
              {week.map((r) => (
                <div key={r.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-secondary rounded-lg relative overflow-hidden h-full">
                    <div
                      className="absolute bottom-0 w-full bg-primary rounded-lg group-hover:bg-primary/80 transition-all"
                      style={{ height: `${(Number(r.value) / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{weekDayShort(r.day)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-5">Топ мастеров</h3>
          <div className="space-y-4">
            {(stats?.top ?? []).map((s, i) => (
              <div key={s.staff_name} className="flex items-center gap-3">
                <span className="w-6 text-sm font-bold text-muted-foreground tabular">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.staff_name || '—'}</p>
                  <p className="text-xs text-muted-foreground">{s.sessions} сеансов</p>
                </div>
                <span className="text-sm font-semibold tabular">{money(s.revenue)}</span>
              </div>
            ))}
            {(stats?.top ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">Нет продаж</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Sales ---------------- */
const Sales = ({ sales }: { sales: Sale[] }) => {
  const total = sales.reduce((s, x) => s + Number(x.amount), 0);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <p className="text-sm text-muted-foreground">Все продажи · {sales.length} операций</p>
        <p className="font-display font-bold text-lg tabular">{money(total)}</p>
      </div>
      {sales.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-16">Продаж пока нет — пробейте первый чек в разделе «Касса»</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground text-xs uppercase tracking-wide border-b border-border">
              <th className="px-6 py-3 font-medium">Время</th>
              <th className="px-6 py-3 font-medium">Услуга</th>
              <th className="px-6 py-3 font-medium">Мастер</th>
              <th className="px-6 py-3 font-medium">Клиент</th>
              <th className="px-6 py-3 font-medium">Оплата</th>
              <th className="px-6 py-3 font-medium text-right">Сумма</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 tabular text-muted-foreground">{timeShort(s.created_at)}</td>
                <td className="px-6 py-4 font-medium">{s.service_name}</td>
                <td className="px-6 py-4 text-muted-foreground">{s.staff_name}</td>
                <td className="px-6 py-4 text-muted-foreground">{s.client_name || '—'}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-secondary">
                    <Icon name={s.method === 'card' ? 'CreditCard' : 'Banknote'} size={13} />
                    {s.method === 'card' ? 'Карта' : 'Наличные'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-semibold tabular">{money(s.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

/* ---------------- Schedule ---------------- */
const statusMap = {
  work: { label: 'В работе', cls: 'bg-accent text-accent-foreground' },
  break: { label: 'Перерыв', cls: 'bg-secondary text-muted-foreground' },
  off: { label: 'Выходной', cls: 'bg-secondary text-muted-foreground' },
};
const hours = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

const Schedule = ({ staff }: { staff: Staff[] }) => {
  const cards = [
    { l: 'Мастеров всего', v: String(staff.length), i: 'Users' },
    { l: 'В смене сейчас', v: String(staff.filter((s) => s.status === 'work').length), i: 'CalendarCheck' },
    { l: 'На перерыве', v: String(staff.filter((s) => s.status === 'break').length), i: 'Coffee' },
    { l: 'Выходной', v: String(staff.filter((s) => s.status === 'off').length), i: 'Moon' },
  ];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {cards.map((s) => (
          <div key={s.l} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-accent text-accent-foreground grid place-items-center">
              <Icon name={s.i} size={20} />
            </div>
            <div>
              <p className="font-display font-extrabold text-xl tabular">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 overflow-x-auto">
        <h3 className="font-display font-bold text-lg mb-5">Учёт рабочего времени · сегодня</h3>
        <div className="min-w-[720px]">
          <div className="flex gap-2 mb-3 pl-40">
            {hours.map((h) => (
              <div key={h} className="flex-1 text-center text-xs text-muted-foreground font-medium">{h}:00</div>
            ))}
          </div>
          {staff.map((s) => (
            <div key={s.id} className="flex items-center gap-2 mb-2">
              <div className="w-40 shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary grid place-items-center text-xs font-semibold">
                  {initials(s.name)}
                </div>
                <span className="text-sm font-medium truncate">{s.name.split(' ')[0]}</span>
              </div>
              <div className="flex-1 flex gap-2">
                {hours.map((h, i) => {
                  const span = Math.max(1, Math.round(Number(s.hours_week) / 5));
                  const active = s.status !== 'off' && i >= (s.id % 2) && i < (s.id % 2) + span;
                  return <div key={h} className={`flex-1 h-8 rounded-md ${active ? 'bg-primary' : 'bg-secondary'}`} />;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Staff ---------------- */
const StaffView = ({ staff, onReload }: { staff: Staff[]; onReload: () => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', hours_week: '', rating: '5.0' });

  const submit = async () => {
    if (!form.name.trim()) return;
    await api.addStaff({
      name: form.name, role: form.role, status: 'work',
      hours_week: Number(form.hours_week) || 0, rating: Number(form.rating) || 5,
    });
    setForm({ name: '', role: '', hours_week: '', rating: '5.0' });
    setOpen(false);
    onReload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">
          <Icon name={open ? 'X' : 'UserPlus'} size={16} />
          {open ? 'Отмена' : 'Добавить сотрудника'}
        </button>
      </div>

      {open && (
        <div className="bg-card border border-border rounded-2xl p-5 grid grid-cols-4 gap-3 animate-scale-in">
          <input className="col-span-2 px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Имя и фамилия" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="col-span-2 px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Должность" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <input className="px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Часов/нед" value={form.hours_week} onChange={(e) => setForm({ ...form, hours_week: e.target.value })} />
          <input className="px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Рейтинг" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          <button onClick={submit} className="col-span-2 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Сохранить</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        {staff.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground grid place-items-center font-display font-bold">
                  {initials(s.name)}
                </div>
                <div>
                  <p className="font-semibold leading-tight">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.role}</p>
                </div>
              </div>
              <button onClick={async () => { await api.delStaff(s.id); onReload(); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                <Icon name="Trash2" size={15} />
              </button>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusMap[s.status].cls}`}>{statusMap[s.status].label}</span>
              <div className="flex gap-4 text-sm">
                <span className="tabular"><span className="text-muted-foreground">Часов </span>{s.hours_week}</span>
                <span className="tabular"><Icon name="Star" size={12} className="inline mb-0.5" /> {s.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Services ---------------- */
const Services = ({ services, onReload }: { services: Service[]; onReload: () => void }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', description: '', duration: '', price: '' });

  const submit = async () => {
    if (!form.name.trim()) return;
    await api.addService({
      name: form.name, category: form.category, description: form.description,
      duration: Number(form.duration) || 60, price: Number(form.price) || 0,
    });
    setForm({ name: '', category: '', description: '', duration: '', price: '' });
    setOpen(false);
    onReload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 px-4 h-10 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors">
          <Icon name={open ? 'X' : 'Plus'} size={16} />
          {open ? 'Отмена' : 'Добавить услугу'}
        </button>
      </div>

      {open && (
        <div className="bg-card border border-border rounded-2xl p-5 grid grid-cols-4 gap-3 animate-scale-in">
          <input className="col-span-2 px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Название услуги" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Категория" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Цена ₽" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="col-span-3 px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Описание" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className="px-3 h-10 rounded-xl border border-input bg-background text-sm" placeholder="Мин" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          <button onClick={submit} className="col-span-2 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">Сохранить</button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {services.map((s) => (
          <div key={s.id} className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground grid place-items-center shrink-0">
              <Icon name="Sparkles" size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{s.category || '—'}</span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Icon name="Clock" size={12} /> {s.duration} мин
                </span>
              </div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-muted-foreground mt-1 leading-snug">{s.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <p className="font-display font-extrabold text-lg tabular">{money(s.price)}</p>
              <button onClick={async () => { await api.delService(s.id); onReload(); }} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                <Icon name="Trash2" size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Checkout ---------------- */
const Checkout = ({ services, staff, onSale }: { services: Service[]; staff: Staff[]; onSale: (s: Partial<Sale>) => void }) => {
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([]);
  const [method, setMethod] = useState<'card' | 'cash'>('card');
  const [client, setClient] = useState('');
  const [master, setMaster] = useState('');

  const add = (id: number) =>
    setCart((c) => (c.find((x) => x.id === id) ? c.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { id, qty: 1 }]));
  const remove = (id: number) => setCart((c) => c.filter((x) => x.id !== id));

  const items = cart.map((c) => ({ ...services.find((s) => s.id === c.id)!, qty: c.qty })).filter((x) => x.name);
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);

  const pay = () => {
    if (items.length === 0) return;
    const names = items.map((x) => (x.qty > 1 ? `${x.name} ×${x.qty}` : x.name)).join(', ');
    onSale({ service_name: names, staff_name: master || staff[0]?.name || '', client_name: client, amount: total, method });
    setCart([]); setClient(''); setMaster('');
  };

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-3">
        <p className="text-sm text-muted-foreground mb-3">Выберите услуги</p>
        <div className="grid grid-cols-2 gap-3">
          {services.map((s) => (
            <button key={s.id} onClick={() => add(s.id)} className="text-left bg-card border border-border rounded-2xl p-4 hover:border-primary hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-accent text-accent-foreground grid place-items-center mb-3">
                <Icon name="Sparkles" size={16} />
              </div>
              <p className="font-medium text-sm leading-tight">{s.name}</p>
              <p className="font-display font-bold mt-2 tabular">{money(s.price)}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="col-span-2 bg-card border border-border rounded-2xl p-6 flex flex-col self-start sticky top-8">
        <div className="flex items-center gap-2 mb-5">
          <Icon name="Receipt" size={18} />
          <h3 className="font-display font-bold text-lg">Новый чек</h3>
        </div>

        <div className="space-y-3 mb-5 min-h-[80px]">
          {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Выберите услуги слева</p>}
          {items.map((x) => (
            <div key={x.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{x.name}</p>
                <p className="text-xs text-muted-foreground">{x.qty} × {money(x.price)}</p>
              </div>
              <span className="font-semibold text-sm tabular">{money(x.price * x.qty)}</span>
              <button onClick={() => remove(x.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Icon name="X" size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 mb-4">
          <select value={master} onChange={(e) => setMaster(e.target.value)} className="px-3 h-10 rounded-xl border border-input bg-background text-sm">
            <option value="">Мастер (не выбран)</option>
            {staff.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
          <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Имя клиента" className="px-3 h-10 rounded-xl border border-input bg-background text-sm" />
        </div>

        <div className="border-t border-border pt-4 space-y-2 mb-5">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Подытог</span><span className="tabular">{money(total)}</span>
          </div>
          <div className="flex justify-between font-display font-extrabold text-xl">
            <span>Итого</span><span className="tabular">{money(total)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['card', 'cash'] as const).map((m) => (
            <button key={m} onClick={() => setMethod(m)} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${method === m ? 'border-primary bg-accent text-accent-foreground' : 'border-border text-muted-foreground hover:bg-secondary'}`}>
              <Icon name={m === 'card' ? 'CreditCard' : 'Banknote'} size={16} />
              {m === 'card' ? 'Карта' : 'Наличные'}
            </button>
          ))}
        </div>

        <button onClick={pay} disabled={items.length === 0} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-40">
          <Icon name="Printer" size={18} />
          Оплатить и напечатать чек
        </button>
      </div>
    </div>
  );
};

export default Index;
