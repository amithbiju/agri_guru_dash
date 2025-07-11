import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SoilTest } from '../../types';
import ChartCard from './ChartCard';
import { format } from 'date-fns';

interface SoilTestChartProps {
  soilTests: SoilTest[];
}

const SoilTestChart: React.FC<SoilTestChartProps> = ({ soilTests }) => {
  const data = soilTests
    .slice(0, 10)
    .reverse()
    .map((test, index) => ({
      date: format(test.test_date, 'MM/dd'),
      pH: test.pH,
      organicMatter: test.organic_matter,
      testNumber: index + 1
    }));

  return (
    <ChartCard title="Soil Test History">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="pH" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981' }}
          />
          <Line 
            type="monotone" 
            dataKey="organicMatter" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default SoilTestChart;