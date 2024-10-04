import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'; // Import heatmap components

Chart.register(...registerables, MatrixController, MatrixElement);

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Säkerställ att din API URL är korrekt satt
  withCredentials: true,
});

const Home = () => {
  const navigate = useNavigate();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [quote, setQuote] = useState(''); // State för inspiration

  // Hämta citat från API
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await api.get('/get-inspiration'); // Hämta citat från /get-inspiration endpoint
        setQuote(response.data.quote); // Spara citatet i state
      } catch (error) {
        console.error('Error fetching inspiration:', error);
      }
    };
    fetchQuote(); // Kör funktionen när komponenten laddas
  }, []);

  const handleGameClick = () => {
    navigate('/Gangertabell'); // Navigate to Game page
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
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl mb-4">Welcome to the Application</h1>
      <p className="mb-8"><strong>{quote}</strong></p> {/* Visa inspirationscitat */}
      
      <div className="flex flex-col space-y-4"> {/* Flexbox för att centrera och ge utrymme mellan knapparna */}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleGameClick}>
          Gångertabell
        </button>
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleRegisterClick}>
          Registrera användare
        </button>
        <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleLoginClick}>
          Logga in
        </button>
        <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded" onClick={handleHeatmapClick}>
          Visa heatmap
        </button>
      </div>

      {showHeatmap && (
        <div className="mt-8">
          <h2 className="text-2xl mb-4">Heatmap</h2>
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
