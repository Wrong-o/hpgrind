import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'; // Import heatmap components

Chart.register(...registerables, MatrixController, MatrixElement);

const Home = () => {
  const navigate = useNavigate();
  const [showHeatmap, setShowHeatmap] = useState(false);

  const handleGameClick = () => {
    navigate('/game'); // Navigate to Game page
  };

  const handleRegisterClick = () => {
    navigate('/Register'); // Navigate to Register page
  };

  const handleLoginClick = () => {
    navigate('/Login'); // Navigate to Login page
  };

  const handleHeatmapClick = () => {
    setShowHeatmap((prev) => !prev); // Toggle heatmap visibility
  };

  // Sample data for the heatmap
  const heatmapData = {
    labels: ['A', 'B', 'C', 'D', 'E'], // X-axis labels
    datasets: [
      {
        label: 'Heatmap',
        data: [
          { x: 'A', y: 'A', v: 10 },
          { x: 'B', y: 'A', v: 20 },
          { x: 'C', y: 'A', v: 30 },
          { x: 'A', y: 'B', v: 40 },
          // Add more data points as needed
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div>
      <h1>Welcome to the Application</h1>
      <button onClick={handleGameClick}>Go to Game</button>
      <button onClick={handleRegisterClick}>Go to Register</button>
      <button onClick={handleLoginClick}>Go to Login</button>
      <button onClick={handleHeatmapClick}>Show heatmap</button>

      {showHeatmap && (
        <div style={{ marginTop: '20px' }}>
          <h2>Heatmap</h2>
          <canvas id="heatmapCanvas"></canvas>
          <script>
            {`const ctx = document.getElementById('heatmapCanvas').getContext('2d');
              new Chart(ctx, {
                type: 'matrix',
                data: ${JSON.stringify(heatmapData)},
                options: {
                  responsive: true,
                  scales: {
                    x: {
                      type: 'category',
                      labels: ${JSON.stringify(heatmapData.labels)},
                    },
                    y: {
                      type: 'category',
                      labels: ${JSON.stringify(heatmapData.labels)},
                    },
                  },
                },
              });`}
          </script>
        </div>
      )}
    </div>
  );
};

export default Home;
