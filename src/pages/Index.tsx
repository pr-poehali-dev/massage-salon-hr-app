import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { api, Staff, Service, Sale, Stats, money } from '@/lib/salon-data';
import Sidebar, { nav, Tab } from '@/components/salon/Sidebar';
import { Dashboard, Sales } from '@/components/salon/DashboardTab';
import { Schedule, StaffView } from '@/components/salon/StaffTab';
import { Services, Checkout } from '@/components/salon/CatalogTab';

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
      <Sidebar tab={tab} onTabChange={setTab} />

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

export default Index;
