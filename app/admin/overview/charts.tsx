'use client';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { MonthlySale } from '@/types';

type ChartsProps = {
  data: { salesData: MonthlySale[] };
};

const Charts = ({ data }: ChartsProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data.salesData}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey="totalSales"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Charts;
