import Icon from '@/components/ui/icon';
import { Sale, Stats, money, weekDayShort, timeShort } from '@/lib/salon-data';

/* ---------------- Dashboard ---------------- */
export const Dashboard = ({ stats, sales }: { stats: Stats | null; sales: Sale[] }) => {
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
export const Sales = ({ sales }: { sales: Sale[] }) => {
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
