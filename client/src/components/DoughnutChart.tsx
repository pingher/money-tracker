import React, { useRef, useEffect } from "react";
import { Chart, registerables, ChartOptions } from "chart.js";

Chart.register(...registerables);

interface DoughnutChartProps {
  data: {
    title: string;
    totalAmount: number;
    percentage: number;
    icons?: string;
  }[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<"doughnut", number[], string> | null>(
    null
  );

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (ctx) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const chartData = {
        labels: data.map((item) => item.title),
        datasets: [
          {
            data: data.map((item) => item.totalAmount),
            backgroundColor: data.map(
              () => `#${Math.floor(Math.random() * 16777215).toString(16)}`
            ),
          },
        ],
      };

      const options: ChartOptions<"doughnut"> = {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const datasetLabel = tooltipItem.dataset.label || "";
                return `${datasetLabel}: ${tooltipItem.raw}`;
              },
            },
          },
        },
      };

      const newChart = new Chart<"doughnut", number[], string>(ctx, {
        type: "doughnut",
        data: chartData,
        options,
      });

      chartInstanceRef.current = newChart;
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartRef}></canvas>;
};

export default DoughnutChart;
