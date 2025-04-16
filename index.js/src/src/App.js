import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  const [selectedCurrency, setSelectedCurrency] = useState('BTC/USD');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1d');
  const [selectedStrategy, setSelectedStrategy] = useState('sma-crossover');

  return (
    <div className="app">
      <Navbar />
      <Dashboard 
        selectedCurrency={selectedCurrency} 
        setSelectedCurrency={setSelectedCurrency}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
        selectedStrategy={selectedStrategy}
        setSelectedStrategy={setSelectedStrategy}
      />
    </div>
  );
}

export default App;