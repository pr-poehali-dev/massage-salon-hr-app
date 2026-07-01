import Icon from '@/components/ui/icon';

type Tab = 'dashboard' | 'sales' | 'schedule' | 'staff' | 'services' | 'checkout';

const nav: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Аналитика', icon: 'LayoutDashboard' },
  { id: 'sales', label: 'Продажи', icon: 'Receipt' },
  { id: 'schedule', label: 'Расписание', icon: 'CalendarClock' },
  { id: 'staff', label: 'Сотрудники', icon: 'Users' },
  { id: 'services', label: 'Услуги', icon: 'Sparkles' },
  { id: 'checkout', label: 'Касса', icon: 'CreditCard' },
];

interface SidebarProps {
  tab: Tab;
  onTabChange: (t: Tab) => void;
}

const Sidebar = ({ tab, onTabChange }: SidebarProps) => (
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
          onClick={() => onTabChange(n.id)}
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
);

export { nav };
export type { Tab };
export default Sidebar;
