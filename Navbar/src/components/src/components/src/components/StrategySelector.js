import React from 'react';

function StrategySelector({ selectedStrategy, setSelectedStrategy }) {
  const strategies = [
    { id: 'sma-crossover', name: 'SMA კვეთა (20/50)' },
    { id: 'ema-crossover', name: 'EMA კვეთა (12/26)' },
    { id: 'macd', name: 'MACD' },
    { id: 'rsi-divergence', name: 'RSI დივერგენცია' },
    { id: 'bollinger-bands', name: 'ბოლინჯერის ზოლები' }
  ];

  return (
    <div>
      <select 
        value={selectedStrategy} 
        onChange={(e) => setSelectedStrategy(e.target.value)}
      >
        {strategies.map(strategy => (
          <option key={strategy.id} value={strategy.id}>
            {strategy.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StrategySelector;