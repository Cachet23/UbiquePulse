import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, TimeScale, Tooltip, Legend);

interface RedGraphProps {
  data: { timestamp: Date; value: number }[];
}

const RedGraph: React.FC<RedGraphProps> = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.timestamp),
    datasets: [
      {
        label: 'Red Value',
        data: data.map(d => d.value),
        fill: false,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'second' as const,
          tooltipFormat: 'PPpp',
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Red Value',
        },
      },
    },
  };

  return (
    <div className="relative h-64">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default RedGraph;
