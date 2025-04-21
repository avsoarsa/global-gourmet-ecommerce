import { Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ 
  data, 
  title = '', 
  height = 300,
  showLegend = true,
  isDoughnut = false,
  cutout = '50%',
  legendPosition = 'top'
}) => {
  // Default options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: showLegend,
        position: legendPosition,
        labels: {
          font: {
            size: 12
          },
          padding: 20
        }
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.formattedValue;
            const dataset = context.dataset;
            const total = dataset.data.reduce((acc, data) => acc + data, 0);
            const percentage = Math.round((context.raw / total) * 100);
            
            // Check if data has a currency format
            if (dataset.currency) {
              return `${label}: ${dataset.currency}${value} (${percentage}%)`;
            }
            
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: isDoughnut ? cutout : 0
  };

  // Choose between Pie and Doughnut chart
  const ChartComponent = isDoughnut ? Doughnut : Pie;

  return (
    <div style={{ height: height }}>
      <ChartComponent data={data} options={options} />
    </div>
  );
};

export default PieChart;
