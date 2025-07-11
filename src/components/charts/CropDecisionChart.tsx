import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CropDecision } from '../../types';
import ChartCard from './ChartCard';

interface CropDecisionChartProps {
  decisions: CropDecision[];
}

const CropDecisionChart: React.FC<CropDecisionChartProps> = ({ decisions }) => {
  const resultCounts = decisions.reduce((acc, decision) => {
    acc[decision.result] = (acc[decision.result] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(resultCounts).map(([result, count]) => ({
    name: result,
    value: count
  }));

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

  return (
    <ChartCard title="Crop Decision Results">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default CropDecisionChart;