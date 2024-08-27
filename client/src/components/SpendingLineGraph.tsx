import React, { useRef, useEffect } from "react";
import { Chart, registerables, ChartOptions } from "chart.js";
import "chartjs-adapter-date-fns";

Chart.register(...registerables);

interface DailyExpense {
  date: string; // Format: YYYY-MM
  totalAmount: number;
}

interface SpendingLineGraphProps {
  monthlyExpenses: DailyExpense[];
}

const SpendingLineGraph: React.FC<SpendingLineGraphProps> = ({
  monthlyExpenses,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<"line", number[], string> | null>(null);

  useEffect(() => {
    const ctx = chartRef.current?.getContext("2d");
    if (ctx) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const data = {
        labels: monthlyExpenses.map((entry) => entry.date),
        datasets: [
          {
            label: "Monthly Expenses",
            data: monthlyExpenses.map((entry) => entry.totalAmount),
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            fill: true,
          },
        ],
      };

      const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
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
        scales: {
          x: {
            type: "time",
            time: {
              unit: "month", // Set unit to month for monthly data
              tooltipFormat: "MMM yyyy",
              displayFormats: {
                month: "MMM yyyy",
              },
            },
            title: {
              display: true,
              text: "Month",
            },
          },
          y: {
            title: {
              display: true,
              text: "Amount",
            },
          },
        },
      };

      const newChart = new Chart<"line", number[], string>(ctx, {
        type: "line",
        data,
        options,
      });

      chartInstanceRef.current = newChart;
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [monthlyExpenses]);

  return <canvas ref={chartRef}></canvas>;
};

export default SpendingLineGraph;
