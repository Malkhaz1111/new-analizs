import React from 'react';

function PredictionDisplay({ prediction }) {
  if (!prediction) {
    return <div>პროგნოზი არ არის ხელმისაწვდომი</div>;
  }

  const { upProbability, downProbability, expectedMove, timeframe, confidence } = prediction;
  
  // გამოვყოთ უფრო სავარაუდო მიმართულება
  const morelikelyDirection = upProbability > downProbability ? 'up' : 'down';
  const higherProbability = Math.max(upProbability, downProbability);
  
  return (
    <div className="prediction-result">
      <div>
        <h4>მოსალოდნელი მოძრაობა:</h4>
        <div className={morelikelyDirection === 'up' ? 'up-prediction' : 'down-prediction'} style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {morelikelyDirection === 'up' ? '▲' : '▼'} 
          {expectedMove}%
        </div>
      </div>
      
      <div style={{ marginTop: '1rem' }}>
        <div>ზემოთ: <span className="up-prediction">{(upProbability * 100).toFixed(1)}%</span></div>
        <div>ქვემოთ: <span className="down-prediction">{(downProbability * 100).toFixed(1)}%</span></div>
        <div>დროის ჩარჩო: {timeframe}</div>
        <div>სანდოობა: {(confidence * 100).toFixed(1)}%</div>
      </div>
    </div>
  );
}

export default PredictionDisplay;