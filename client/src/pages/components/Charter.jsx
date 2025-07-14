import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Pie, Scatter } from 'react-chartjs-2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import apiClient from '../../axiosClient'; // adjust path if needed


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Charter = ({ title, type, data, saveChart, tt = "Save Chart" }) => {
  const chartRef = useRef();

  if (!data || !data.x || !data.y || data.x.length === 0 || data.y.length === 0) {
    return <div className="text-center p-4 text-gray-500">No data available</div>;
  }

  let chartData;
  let options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: !!title, text: title },
    },
  };

  switch (type) {
    case 'line':
    case 'bar':
      chartData = {
        labels: data.x,
        datasets: [
          {
            label: type,
            data: data.y,
            backgroundColor: type === 'bar' ? 'rgba(54, 162, 235, 0.5)' : undefined,
            borderColor: type === 'line' ? 'rgba(75,192,192,1)' : undefined,
            fill: false,
          }
        ],
      };
      break;

    case 'pie':
      const grouped = {};
      data.x.forEach((label, i) => {
        grouped[label] = (grouped[label] || 0) + data.y[i];
      });
      const labels = Object.keys(grouped);
      const values = Object.values(grouped);
      const backgroundColors = [
        '#FF6384', '#36A2EB', '#FFCE56',
        '#4BC0C0', '#9966FF', '#FF9F40',
        '#8B4513', '#20B2AA', '#FF69B4', '#A52A2A'
      ];
      chartData = {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: backgroundColors.slice(0, labels.length),
          }
        ]
      };
      break;

    case 'scatter':
      chartData = {
        datasets: [
          {
            label: title,
            data: data.x.map((xVal, idx) => ({
              x: xVal,
              y: data.y[idx],
            })),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      };

      options.scales = {
        x: { type: 'linear', position: 'bottom' },
      };
      break;

    default:
      return <div className="text-red-500">Unsupported chart type: {type}</div>;
  }

  const ChartComponent = {
    line: Line,
    bar: Bar,
    pie: Pie,
    scatter: Scatter,
  }[type];

  const downloadImage = () => {
    const canvas = chartRef.current.canvas;
    const imageWithWhiteBg = document.createElement('canvas');
    const ctx = imageWithWhiteBg.getContext('2d');
    imageWithWhiteBg.width = canvas.width;
    imageWithWhiteBg.height = canvas.height;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, imageWithWhiteBg.width, imageWithWhiteBg.height);
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.href = imageWithWhiteBg.toDataURL('image/png');
    link.download = `${title || 'chart'}.png`;
    link.click();
  };

  const downloadPDF = async () => {
    const canvasEl = chartRef.current.canvas;
    const canvasImg = await html2canvas(canvasEl);
    const imgData = canvasImg.toDataURL('image/png');
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvasEl.height / canvasEl.width) * width;
    pdf.addImage(imgData, 'PNG', 10, 10, width - 20, height);
    pdf.save(`${title || 'chart'}.pdf`);
  };



  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <ChartComponent ref={chartRef} data={chartData} options={options} />
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <button
          onClick={downloadImage}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download Image
        </button>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Download PDF
        </button>
        <button
          onClick={saveChart}
          className={"px-4 py-2  text-white rounded " + (tt == "Delete Chart" ? "hover:bg-red-700 bg-red-600" : "hover:bg-purple-700 bg-purple-600")}
        >
          {tt}
        </button>
      </div>
    </div>
  );
};

export default Charter;
