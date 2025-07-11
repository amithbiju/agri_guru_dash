import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PriceQuery } from '../../types';
import ChartCard from './ChartCard';
import { format } from 'date-fns';

interface PriceChartProps {
  priceQueries: PriceQuery[];
}

const PriceChart: React.FC<PriceChartProps> = ({ priceQueries }) => {
  const data = priceQueries
    .slice(0, 15)
    .reverse()
    .map((query) => ({
      date: format(query.query_date, 'MM/dd'),
      price: query.queried_price,
      crop: query.crop_name
    }));

  return (
    <ChartCard title="Recent Price Queries">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`₹${value}`, 'Price']}
            labelFormatter={(label) => `Date: ${label}`}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#F59E0B" 
            fill="#FEF3C7"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default PriceChart;