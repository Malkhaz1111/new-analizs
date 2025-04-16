import React, { useState, useEffect } from 'react';
import Chart from './Chart';
import CurrencySelector from './CurrencySelector';
import TechnicalIndicators from './TechnicalIndicators';
import StrategySelector from './StrategySelector';
import PredictionDisplay from './PredictionDisplay';
import { fetchCurrencyData } from '../services/apiService';
import { analyzeData } from '../services/analyticService';
import { generatePrediction } from '../services/predictionService';

function Dashboard({ selectedCurrency, setSelectedCurrency, selectedTimeframe, setSelectedTimeframe, selectedStrategy, setSelectedStrategy }) {
  const [chartData, setChartData] = useState(null);
  const [indicators, setIndicators] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  // ფუნქცია, რომელიც გამოიყენება მონაცემების განახლებისთვის
  const updateData = async () => {
    setLoading(true);
    try {
      // მივიღოთ მონაცემები API-დან
      const data = await fetchCurrencyData(selectedCurrency, selectedTimeframe);
      setChartData(data);
      
      // გავააანალიზოთ მონაცემები
      const indicatorData = analyzeData(data, selectedStrategy);
      setIndicators(indicatorData);
      
      // გავაკეთოთ პროგნოზი
      const predictionResult = generatePrediction(data, indicatorData, selectedStrategy);
      setPrediction(predictionResult);
    } catch (error) {
      console.error("მონაცემების მიღების შეცდომა:", error);
    } finally {
      setLoading(false);
    }
  };

  // მონაცემების განახლება როცა იცვლება არჩეული კრიპტოვალუტა ან დროის ჩარჩო
  useEffect(() => {
    updateData();
    // განახლების ინტერვალი ყოველ 1 წუთში
    const interval = setInterval(updateData, 60000);
    return () => clearInterval(interval);
  }, [selectedCurrency, selectedTimeframe, selectedStrategy]);

  return (
    <div className="dashboard">
      <div className="controls-container">
        <CurrencySelector 
          selectedCurrency={selectedCurrency} 
          setSelectedCurrency={setSelectedCurrency} 
        />
        <div>
          <select value={selectedTimeframe} onChange={(e) => setSelectedTimeframe(e.target.value)}>
            <option value="1m">1 წუთი</option>
            <option value="5m">5 წუთი</option>
            <option value="15m">15 წუთი</option>
            <option value="1h">1 საათი</option>
            <option value="4h">4 საათი</option>
            <option value="1d">1 დღე</option>
            <option value="1w">1 კვირა</option>
          </select>
        </div>
        <StrategySelector 
          selectedStrategy={selectedStrategy} 
          setSelectedStrategy={setSelectedStrategy} 
        />
        <button onClick={updateData}>განახლება</button>
      </div>

      <div className="chart-container">
        {loading ? (
          <div className="loading">მონაცემების ჩატვირთვა</div>
        ) : (
          <Chart data={chartData} indicators={indicators} />
        )}
      </div>

      <div className="analysis-container">
        <div className="indicators-panel">
          <h3>ტექნიკური ინდიკატორები</h3>
          {loading ? (
            <div className="loading">ინდიკატორების გამოთვლა</div>
          ) : (
            <TechnicalIndicators indicators={indicators} />
          )}
        </div>
        <div className="prediction-panel">
          <h3>პროგნოზი</h3>
          {loading ? (
            <div className="loading">პროგნოზის გენერაცია</div>
          ) : (
            <PredictionDisplay prediction={prediction} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;