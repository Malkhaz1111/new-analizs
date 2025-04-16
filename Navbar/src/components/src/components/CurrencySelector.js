import React from 'react';

function CurrencySelector({ selectedCurrency, setSelectedCurrency }) {
  const currencies = [
    'BTC/USD',
    'ETH/USD',
    'BNB/USD',
    'XRP/USD',
    'ADA/USD',
    'SOL/USD',
    'DOGE/USD',
    'DOT/USD',
    'AVAX/USD',
    'MATIC/USD'
  ];

  return (
    <div>
      <select 
        value={selectedCurrency} 
        onChange={(e) => setSelectedCurrency(e.target.value)}
      >
        {currencies.map(currency => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CurrencySelector;