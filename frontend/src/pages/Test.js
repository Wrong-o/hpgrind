import React, { useState } from 'react';

const HeatMap = ({ data }) => {
  const maxValue = Math.max(...data.filter(item => item.value !== "-").map(item => item.value));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: '2px' }}>
      {data.map((item) => (
        <div
          key={`${item.x}-${item.y}`}
          style={{
            backgroundColor: item.value === "-" ? 'black' : `rgba(255, 0, 0, ${item.value / maxValue})`,
            padding: '20px',
            textAlign: 'center',
            border: '1px solid #ccc',
          }}
        >
          {item.value}
        </div>
      ))}
    </div>
  );
};

const sampleData = [
  { x: '1', y: '1', value: 30 },
  { x: '1', y: '2', value: 20 },
  { x: '1', y: '3', value: 15 },
  { x: '1', y: '4', value: 40 },
  { x: '1', y: '5', value: 25 },
  { x: '1', y: '6', value: 50 },
  { x: '1', y: '7', value: 30 },
  { x: '1', y: '8', value: 20 },
  { x: '1', y: '9', value: 15 },
  { x: '1', y: '10', value: 40 },
  { x: '2', y: '1', value: 25 },
  { x: '2', y: '2', value: 50 },
  { x: '2', y: '3', value: 30 },
  { x: '2', y: '4', value: 20 },
  { x: '2', y: '5', value: 15 },
  { x: '2', y: '6', value: 40 },
  { x: '2', y: '7', value: 25 },
  { x: '2', y: '8', value: 50 },
  { x: '2', y: '9', value: 30 },
  { x: '2', y: '10', value: 20 },
  { x: '3', y: '1', value: 15 },
  { x: '3', y: '2', value: 40 },
  { x: '3', y: '3', value: 25 },
  { x: '3', y: '4', value: 50 },
  { x: '3', y: '5', value: 30 },
  { x: '3', y: '6', value: 20 },
  { x: '3', y: '7', value: 15 },
  { x: '3', y: '8', value: 40 },
  { x: '3', y: '9', value: 25 },
  { x: '3', y: '10', value: 50 },
  { x: '5', y: '1', value: 15 },
  { x: '5', y: '2', value: 40 },
  { x: '5', y: '3', value: 25 },
  { x: '5', y: '4', value: 50 },
  { x: '5', y: '5', value: 30 },
  { x: '5', y: '6', value: 20 },
  { x: '5', y: '7', value: 15 },
  { x: '5', y: '8', value: 40 },
  { x: '5', y: '9', value: 25 },
  { x: '5', y: '10', value: 50 },
  { x: '6', y: '1', value: 15 },
  { x: '6', y: '2', value: 40 },
  { x: '6', y: '3', value: 25 },
  { x: '6', y: '4', value: 50 },
  { x: '6', y: '5', value: 30 },
  { x: '6', y: '6', value: 20 },
  { x: '6', y: '7', value: 15 },
  { x: '6', y: '8', value: 40 },
  { x: '6', y: '9', value: 25 },
  { x: '6', y: '10', value: 50 },
  { x: '7', y: '1', value: 15 },
  { x: '7', y: '2', value: 40 },
  { x: '7', y: '3', value: 25 },
  { x: '7', y: '4', value: 50 },
  { x: '7', y: '5', value: 30 },
  { x: '7', y: '6', value: 20 },
  { x: '7', y: '7', value: 15 },
  { x: '7', y: '8', value: 40 },
  { x: '7', y: '9', value: 25 },
  { x: '7', y: '10', value: 50 },
    { x: '8', y: '1', value: 15 },
  { x: '8', y: '2', value: 40 },
  { x: '8', y: '3', value: 25 },
  { x: '8', y: '4', value: 50 },
  { x: '8', y: '5', value: 30 },
  { x: '8', y: '6', value: 20 },
  { x: '8', y: '7', value: 15 },
  { x: '8', y: '8', value: 40 },
  { x: '8', y: '9', value: 25 },
  { x: '8', y: '10', value: 50 },
  { x: '9', y: '1', value: 15 },
  { x: '9', y: '2', value: 40 },
  { x: '9', y: '3', value: 25 },
  { x: '9', y: '4', value: 50 },
  { x: '9', y: '5', value: 30 },
  { x: '9', y: '6', value: 20 },
  { x: '9', y: '7', value: 15 },
  { x: '9', y: '8', value: 40 },
  { x: '9', y: '9', value: 25 },
  { x: '10', y: '10', value: 50 },
  { x: '10', y: '1', value: 15 },
  { x: '10', y: '2', value: 40 },
  { x: '10', y: '3', value: 25 },
  { x: '10', y: '4', value: 50 },
  { x: '10', y: '5', value: 30 },
  { x: '10', y: '6', value: 20 },
  { x: '10', y: '7', value: 15 },
  { x: '10', y: '8', value: 40 },
  { x: '10', y: '9', value: 25 },
  { x: '10', y: '10', value: 50 },



];

const Gangertabell = () => {
  const [showHeatmap, setShowHeatmap] = useState(false);

  const toggleHeatmap = () => {
    setShowHeatmap(prev => !prev);
  };

  const handleHomeClick = () => {
    // Logic for home button click
  };

  return (
    <div>
      <button 
        onClick={toggleHeatmap} 
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        {showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
      </button>
      {showHeatmap && (
        <div className="w-full max-w-2xl mt-4 bg-white p-4 rounded">
          <HeatMap data={sampleData} /> {/* Use local HeatMap component */}
        </div>
      )}
      <button 
        onClick={handleHomeClick} 
        className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
      >
        Home
      </button>
    </div>
  );
};

export default Gangertabell;
