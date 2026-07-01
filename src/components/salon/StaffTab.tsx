import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { api, Staff, initials } from '@/lib/salon-data';

export const statusMap = {
  work: { label: 'В работе', cls: 'bg-accent text-accent-foreground' },
  break: { label: 'Перерыв', cls: 'bg-secondary text-muted-foreground' },
  off: { label: 'Выходной', cls: 'bg-secondary text-muted-foreground' },
};

const hours = ['09', '10', '11', '12', '13', '14', '15', '16', '17', '18'];

/* ---------------- Schedule ---------------- */
export const Schedule = ({ staff }: { staff: Staff[] }) => {
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

/* ---------------- StaffView ---------------- */
export const StaffView = ({ staff, onReload }: { staff: Staff[]; onReload: () => void }) => {
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
