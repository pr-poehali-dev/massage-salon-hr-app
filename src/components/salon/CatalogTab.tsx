import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { api, Staff, Service, Sale, money } from '@/lib/salon-data';

/* ---------------- Services ---------------- */
export const Services = ({ services, onReload }: { services: Service[]; onReload: () => void }) => {
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
export const Checkout = ({ services, staff, onSale }: { services: Service[]; staff: Staff[]; onSale: (s: Partial<Sale>) => void }) => {
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
