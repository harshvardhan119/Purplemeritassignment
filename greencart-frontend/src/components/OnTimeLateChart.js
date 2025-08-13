import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

export default function OnTimeLateChart({ onTime = 0, late = 0 }) {
  const data = { labels: ['On Time', 'Late'], datasets: [{ data: [onTime, late], backgroundColor: ['#2f855a','#e53e3e'] }]};
  return (
    <div className="card">
      <h4>On-time vs Late</h4>
      <Doughnut data={data} />
    </div>
  );
}
