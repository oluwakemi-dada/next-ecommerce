import { Metadata } from 'next';
import RecentSalesTable from './recent-sales-table';
import SalesOverview from './sales-overview';
import StatsCards from './stats-cards';
import { getOrderSummary } from '@/lib/actions/order.actions';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

const AdminOverviewPage = async () => {
  const summary = await getOrderSummary();

  return (
    <div className="space-y-3">
      <h1 className="h2-bold">Dashboard</h1>
      <StatsCards summary={summary} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <SalesOverview data={summary.salesData} />
        <RecentSalesTable latestSales={summary.latestSales} />
      </div>
    </div>
  );
};

export default AdminOverviewPage;
