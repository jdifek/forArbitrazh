import React from 'react';

interface ChartProps {
  title: string;
  children: React.ReactNode;
}

const Chart: React.FC<ChartProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-gray-700 text-sm font-medium mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default Chart;