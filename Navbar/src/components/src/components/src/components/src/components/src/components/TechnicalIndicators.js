import React from 'react';

function TechnicalIndicators({ indicators }) {
  if (!indicators || Object.keys(indicators).length === 0) {
    return <div>ინდიკატორები არ არის ხელმისაწვდომი</div>;
  }

  return (
    <div>
      {indicators.summary && (
        <div>
          <h4>მიმდინარე მდგომარეობა:</h4>
          <p style={{ color: indicators.summary.signal === 'buy' ? '#50fa7b' : indicators.summary.signal === 'sell' ? '#ff5555' : '#e0e0e0' }}>
            {indicators.summary.description}
          </p>
        </div>
      )}
      
      <div style={{ marginTop: '1rem' }}>
        <h4>ტექნიკური მაჩვენებლები:</h4>
        <ul style={{ listStyle: 'none', marginTop: '0.5rem' }}>
          {indicators.rsi && (
            <li>
              RSI (14): <span style={{ color: indicators.rsi < 30 ? '#50fa7b' : indicators.rsi > 70 ? '#ff5555' : '#e0e0e0' }}>
                {indicators.rsi.toFixed(2)}
              </span>
            </li>
          )}
          
          {indicators.macd && (
            <li>
              MACD: <span style={{ color: indicators.macd.histogram > 0 ? '#50fa7b' : '#ff5555' }}>
                {indicators.macd.value.toFixed(2)} (Histogram: {indicators.macd.histogram.toFixed(2)})
              </span>
            </li>
          )}
          
          {indicators.ema12 && indicators.ema26 && (
            <li>
              EMA 12/26: <span style={{ color: indicators.ema12 > indicators.ema26 ? '#50fa7b' : '#ff5555' }}>
                {indicators.ema12.toFixed(2)} / {indicators.ema26.toFixed(2)}
              </span>
            </li>
          )}
          
          {indicators.sma20 && indicators.sma50 && indicators.lastPrice && (
            <li>
              SMA 20/50: <span style={{ color: indicators.sma20[indicators.sma20.length - 1].value > indicators.sma50[indicators.sma50.length - 1].value ? '#50fa7b' : '#ff5555' }}>
                {indicators.sma20[indicators.sma20.length - 1].value.toFixed(2)} / {indicators.sma50[indicators.sma50.length - 1].value.toFixed(2)}
              </span>
            </li>
          )}
          
          {indicators.bbands && (
            <li>
              Bollinger Bands: 
              <span> Upper: {indicators.bbands.upper.toFixed(2)}</span>,
              <span style={{ color: '#e0e0e0' }}> Middle: {indicators.bbands.middle.toFixed(2)}</span>,
              <span> Lower: {indicators.bbands.lower.toFixed(2)}</span>
            </li>
          )}
        </ul>
      </div>
      
      {indicators.patterns && indicators.patterns.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4>დაფიქსირებული პატერნები:</h4>
          <ul style={{ listStyle: 'none', marginTop: '0.5rem' }}>
            {indicators.patterns.map((pattern, index) => (
              <li key={index} style={{ color: pattern.bullish ? '#50fa7b' : '#ff5555' }}>
                {pattern.name}: {pattern.bullish ? 'აღმავალი' : 'დაღმავალი'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default TechnicalIndicators;