"use client";

import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const colors = {
  emerald: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"],
  blue: ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
  purple: ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"],
  slate: ["#0f172a", "#1e293b", "#334155", "#475569", "#94a3b8"],
};

export function ViewsBarChart({
  data,
}: {
  data: Array<{ title: string; views: number }>
}) {
  const labels = data.map((d) => d.title);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Vues",
        data: data.map((d) => d.views),
        backgroundColor: colors.blue[2],
        borderColor: colors.blue[0],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "#eef2f7" } },
    },
  };

  return (
    <div className="h-72">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export function DurationLineChart({
  data,
}: {
  data: Array<{ title: string; avgDurationSeconds: number }>
}) {
  const labels = data.map((d) => d.title);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Durée moyenne (s)",
        data: data.map((d) => Math.round(d.avgDurationSeconds)),
        fill: true,
        borderColor: colors.emerald[0],
        backgroundColor: "rgba(16,185,129,0.15)",
        pointBackgroundColor: colors.emerald[0],
        tension: 0.35,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { color: "#eef2f7" } },
    },
  };

  return (
    <div className="h-72">
      <Line data={chartData} options={options} />
    </div>
  );
}

export function LocationsDoughnut({
  data,
}: {
  data: Array<{ label: string; value: number }>
}) {
  const labels = data.map((d) => d.label);
  const chartData = {
    labels,
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: [
          colors.purple[0],
          colors.purple[1],
          colors.purple[2],
          colors.purple[3],
          colors.purple[4],
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
    cutout: "65%",
  };

  return (
    <div className="h-72">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
