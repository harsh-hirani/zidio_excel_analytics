

const ChartConfigForm = ({ onSubmit, setError,mode, setMode,chartType, setChartType }) => {
  

  const chartOptions = {
    '2d': ['bar', 'line', 'pie', 'scatter'],
    '3d': ['bar', 'line', 'scatter'],
  };

  const handleSubmit = () => {
    if (!chartType) {
      setError('Please select a chart type.');
      return;
    }
    // setError('');
    onSubmit({ mode, chartType });
  };

  return (
    <div className={"py-6 px-2 max-w-xl mx-auto   rounded-2xl space-y-6 "}>
      {/* Mode Selector */}
      <div>
        <h2 className="font-semibold mb-2 text-lg text-text-main ">Chart Mode</h2>
        <div className="flex gap-4 rounded-full p-1 bg-gray-100 ">
          {['2d', '3d'].map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setMode(opt);
                setChartType(''); // reset type on mode switch
              }}
              className={`px-4 py-2 rounded-full font-medium transition w-full
                ${mode === opt ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-700  hover:bg-blue-100 '}`}
            >
              {opt.toUpperCase()} Chart
            </button>
          ))}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div>
        <h2 className="font-semibold mb-2 text-lg text-text-main ">Chart Type</h2>
        <div className="flex flex-wrap gap-3">
          {chartOptions[mode].map((type) => (
            <button
              key={type}
              onClick={() => setChartType(type)}
              className={`capitalize px-4 py-2 rounded-full border font-medium transition
                ${chartType === type
                  ? 'bg-green-600 text-white border-green-700'
                  : 'bg-gray-200  text-gray-800  border-gray-300  hover:bg-green-100 0'}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      

      {/* Submit Button */}
      <div>
        <button
          onClick={handleSubmit}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-500  transition disabled:cursor-not-allowed"
          
        >
          Generate Chart
        </button>
      </div>
    </div>
  );
};

export default ChartConfigForm;
