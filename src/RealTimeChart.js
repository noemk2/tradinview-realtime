import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js';

const RealTimeChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Candlestick',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              displayFormats: {
                minute: 'HH:mm',
              },
            },
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return () => {
      chart.destroy();
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current.chart;
    const newData = {
      x: data.t,
      y: parseFloat(data.c),
    };

    chart.data.labels.push(newData.x);
    chart.data.datasets[0].data.push(newData);
    chart.update();
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default RealTimeChart;
