import React, { useState, useEffect, useCallback } from 'react';
import { ResponsiveContainer } from 'recharts';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

const HeatMap = ({ onDataUpdate }) => {
  const [data, setData] = useState([]);

  const fetchHeatmapData = useCallback(async () => {
    try {
      const response = await api.get('/get-user-heatmap');
      const processedData = response.data.map(item => ({
        x: item.x,
        y: item.y,
        value: item.correct_rate === '-' ? null : parseFloat(item.correct_rate)
      }));
      setData(processedData);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
    }
  }, []);

  useEffect(() => {
    fetchHeatmapData();
  }, [fetchHeatmapData]);

  const updateHeatmapData = useCallback((x, y, isCorrect) => {
    setData(prevData => {
      const newData = [...prevData];
      const index = newData.findIndex(item => item.x === x && item.y === y);
      if (index !== -1) {
        const currentValue = newData[index].value;
        const totalAttempts = currentValue !== null ? 1 / currentValue : 0;
        const newTotalAttempts = totalAttempts + 1;
        const newCorrectAttempts = (totalAttempts * currentValue + (isCorrect ? 1 : 0));
        newData[index] = {
          ...newData[index],
          value: newCorrectAttempts / newTotalAttempts
        };
      } else {
        newData.push({ x, y, value: isCorrect ? 1 : 0 });
      }
      return newData;
    });
  }, []);

  useEffect(() => {
    if (onDataUpdate) {
      onDataUpdate(updateHeatmapData);
    }
  }, [onDataUpdate, updateHeatmapData]);

  const colorScale = (value) => {
    if (value === null) return '#333333'; // Darker gray for no data
    const hue = ((value) * 120).toString(10);
    return `hsl(${hue}, 80%, 50%)`;
  };

  const cellSize = 40;
  const margin = { top: 20, right: 20, bottom: 30, left: 30 };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <svg width="100%" height="100%" style={{backgroundColor: 'black'}}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          {data.map((item) => (
            <rect
              key={`cell-${item.x}-${item.y}`}
              x={(item.x - 1) * cellSize}
              y={(item.y - 1) * cellSize}
              width={cellSize}
              height={cellSize}
              fill={colorScale(item.value)}
              stroke="#000"
              strokeWidth={1}
            >
              <title>{`${item.x} x ${item.y} = ${item.x * item.y}
${item.value !== null ? `Correct: ${(item.value * 100).toFixed(1)}%` : 'No data'}`}</title>
            </rect>
          ))}
          {[...Array(10)].map((_, i) => (
            <text
              key={`x-label-${i + 1}`}
              x={(i + 0.5) * cellSize}
              y={10 * cellSize + 20}
              textAnchor="middle"
              fill="#ffffff"
              fontSize="12px"
            >
              {i + 1}
            </text>
          ))}
          {[...Array(10)].map((_, i) => (
            <text
              key={`y-label-${i + 1}`}
              x={-10}
              y={(i + 0.5) * cellSize}
              textAnchor="end"
              alignmentBaseline="middle"
              fill="#ffffff"
              fontSize="12px"
            >
              {i + 1}
            </text>
          ))}
        </g>
      </svg>
    </ResponsiveContainer>
  );
};

export default HeatMap;