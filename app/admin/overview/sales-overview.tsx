import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlySale } from '@/types';
import Charts from './charts';

type SalesOverviewProps = {
  data: MonthlySale[];
};

const SalesOverview = ({ data }: SalesOverviewProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Charts
          data={{
            salesData: data,
          }}
        />
      </CardContent>
    </Card>
  );
};

export default SalesOverview;
