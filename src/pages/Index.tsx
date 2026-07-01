import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { staff, services, sales, revenueWeek, money } from '@/lib/salon-data';

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

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
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

      {/* Main */}
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
            <button className="flex items-center gap-2 px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              <Icon name="Plus" size={16} />
              Новая запись
            </button>
          </div>
        </header>

        <div key={tab} className="animate-fade-in">
          {tab === 'dashboard' && <Dashboard />}
          {tab === 'sales' && <Sales />}
          {tab === 'schedule' && <Schedule />}
          {tab === 'staff' && <StaffView />}
          {tab === 'services' && <Services />}
          {tab === 'checkout' && <Checkout />}
        </div>
      </main>
    </div>
  );
};

/* ---------------- Dashboard ---------------- */
const Dashboard = () => {
  const total = sales.reduce((s, x) => s + x.amount, 0);
  const stats = [
    { label: 'Выручка сегодня', value: money(total), sub: '+12% к вчера', icon: 'TrendingUp', up: true },
    { label: 'Продано услуг', value: String(sales.length), sub: '6 мастеров', icon: 'Receipt', up: true },
    { label: 'Средний чек', value: money(Math.round(total / sales.length)), sub: '+4%', icon: 'Wallet', up: true },
    { label: 'Загрузка мастеров', value: '78%', sub: '3 в работе', icon: 'Activity', up: false },
  ];
  const max = Math.max(...revenueWeek.map((r) => r.value));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-9 h-9 rounded-lg bg-accent text-accent-foreground grid place-items-center">
                <Icon name={s.icon} size={18} />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.up ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
                {s.sub}
              </span>
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
              <p className="text-sm text-muted-foreground">Тысяч рублей по дням</p>
            </div>
            <span className="text-sm font-semibold text-primary">624 000 ₽</span>
          </div>
          <div className="flex items-end justify-between gap-3 h-48">
            {revenueWeek.map((r) => (
              <div key={r.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-secondary rounded-lg relative overflow-hidden" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 w-full bg-primary rounded-lg group-hover:bg-primary/80 transition-all"
                    style={{ height: `${(r.value / max) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground font-medium">{r.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-5">Топ мастеров</h3>
          <div className="space-y-4">
            {[...staff].sort((a, b) => b.revenue - a.revenue).slice(0, 4).map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="w-6 text-sm font-bold text-muted-foreground tabular">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.sessions} сеансов</p>
                </div>
                <span className="text-sm font-semibold tabular">{money(s.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Sales ---------------- */
const Sales = () => {
  const total = sales.reduce((s, x) => s + x.amount, 0);
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <p className="text-sm text-muted-foreground">Продажи за сегодня · {sales.length} операций</p>
        <p className="font-display font-bold text-lg tabular">{money(total)}</p>
      </div>
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
              <td className="px-6 py-4 tabular text-muted-foreground">{s.time}</td>
              <td className="px-6 py-4 font-medium">{s.service}</td>
              <td className="px-6 py-4 text-muted-foreground">{s.staff}</td>
              <td className="px-6 py-4 text-muted-foreground">{s.client}</td>
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

const Schedule = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-4 gap-4">
      {[
        { l: 'Часов отработано', v: '22.5', i: 'Clock' },
        { l: 'Мастеров в смене', v: '3', i: 'Users' },
        { l: 'Записей сегодня', v: '18', i: 'CalendarCheck' },
        { l: 'Свободных окон', v: '7', i: 'CalendarPlus' },
      ].map((s) => (
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
                {s.name.split(' ').map((w) => w[0]).join('')}
              </div>
              <span className="text-sm font-medium truncate">{s.name.split(' ')[0]}</span>
            </div>
            <div className="flex-1 flex gap-2">
              {hours.map((h, i) => {
                const active = s.status !== 'off' && i >= (s.id % 2) && i < (s.id % 2) + Math.round(s.hoursToday);
                return (
                  <div key={h} className={`flex-1 h-8 rounded-md ${active ? 'bg-primary' : 'bg-secondary'}`} />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ---------------- Staff ---------------- */
const StaffView = () => (
  <div className="grid grid-cols-3 gap-4">
    {staff.map((s) => (
      <div key={s.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground grid place-items-center font-display font-bold">
              {s.name.split(' ').map((w) => w[0]).join('')}
            </div>
            <div>
              <p className="font-semibold leading-tight">{s.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.role}</p>
            </div>
          </div>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusMap[s.status].cls}`}>
            {statusMap[s.status].label}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border">
          {[
            { l: 'Часов/нед', v: s.hoursWeek },
            { l: 'Выручка', v: (s.revenue / 1000).toFixed(0) + 'к' },
            { l: 'Рейтинг', v: s.rating },
          ].map((m) => (
            <div key={m.l} className="text-center">
              <p className="font-display font-bold tabular">{m.v}</p>
              <p className="text-[11px] text-muted-foreground">{m.l}</p>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ---------------- Services ---------------- */
const Services = () => (
  <div className="grid grid-cols-2 gap-4">
    {services.map((s) => (
      <div key={s.id} className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
        <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground grid place-items-center shrink-0">
          <Icon name="Sparkles" size={22} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{s.category}</span>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1">
              <Icon name="Clock" size={12} /> {s.duration} мин
            </span>
          </div>
          <p className="font-semibold">{s.name}</p>
          <p className="text-sm text-muted-foreground mt-1 leading-snug">{s.desc}</p>
        </div>
        <p className="font-display font-extrabold text-lg tabular shrink-0">{money(s.price)}</p>
      </div>
    ))}
  </div>
);

/* ---------------- Checkout ---------------- */
const Checkout = () => {
  const [cart, setCart] = useState<{ id: number; qty: number }[]>([{ id: 1, qty: 1 }, { id: 4, qty: 1 }]);
  const [method, setMethod] = useState<'card' | 'cash'>('card');

  const add = (id: number) =>
    setCart((c) => (c.find((x) => x.id === id) ? c.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x)) : [...c, { id, qty: 1 }]));
  const remove = (id: number) => setCart((c) => c.filter((x) => x.id !== id));

  const items = cart.map((c) => ({ ...services.find((s) => s.id === c.id)!, qty: c.qty }));
  const total = items.reduce((s, x) => s + x.price * x.qty, 0);

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="col-span-3">
        <p className="text-sm text-muted-foreground mb-3">Выберите услуги</p>
        <div className="grid grid-cols-2 gap-3">
          {services.map((s) => (
            <button
              key={s.id}
              onClick={() => add(s.id)}
              className="text-left bg-card border border-border rounded-2xl p-4 hover:border-primary hover:shadow-md transition-all"
            >
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
          <h3 className="font-display font-bold text-lg">Чек №1042</h3>
        </div>

        <div className="space-y-3 mb-5 min-h-[80px]">
          {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Корзина пуста</p>}
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
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                method === m ? 'border-primary bg-accent text-accent-foreground' : 'border-border text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Icon name={m === 'card' ? 'CreditCard' : 'Banknote'} size={16} />
              {m === 'card' ? 'Карта' : 'Наличные'}
            </button>
          ))}
        </div>

        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
          <Icon name="Printer" size={18} />
          Оплатить и напечатать чек
        </button>
      </div>
    </div>
  );
};

export default Index;
