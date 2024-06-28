import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement
);

const BarChart = ({ data }) => {
  // Prepare data for Chart.js
  const chartData = {
    labels: Object.keys(data), // Array of dates (e.g., ["2024-06-01", "2024-06-02", ...])
    datasets: [
      {
        label: "Requests",
        data: Object.values(data), // Array of request counts corresponding to dates
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  // Chart.js options
  const options = {
    indexAxis: "x", // Display labels on x-axis
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Increase of Requests Over Time",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20, // Limit number of x-axis ticks for better readability
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Number of Requests",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default BarChart;
