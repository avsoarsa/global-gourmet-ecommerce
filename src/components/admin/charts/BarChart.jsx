import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ 
  data, 
  title = '', 
  xAxisLabel = '', 
  yAxisLabel = '',
  height = 300,
  showLegend = true,
  showGrid = true,
  horizontal = false,
  stacked = false
}) => {
  // Default options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        display: showLegend,
        position: 'top',
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 10,
        cornerRadius: 4,
        displayColors: true
      }
    },
    scales: {
      x: {
        stacked: stacked,
        title: {
          display: !!xAxisLabel,
          text: xAxisLabel,
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: horizontal ? showGrid : false,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      y: {
        stacked: stacked,
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          font: {
            weight: 'bold'
          }
        },
        grid: {
          display: horizontal ? false : showGrid,
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          },
          callback: function(value) {
            // Check if data has a currency format
            if (data.datasets && data.datasets[0] && data.datasets[0].currency) {
              return data.datasets[0].currency + value;
            }
            return value;
          }
        },
        beginAtZero: true
      }
    }
  };

  return (
    <div style={{ height: height }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
