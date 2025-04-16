import axios from 'axios';

// მოკლედ, ეს არის დემო მონაცემების გენერატორი, რეალურ API-ს უნდა მიმართოთ
function generateDemoData(symbol, timeframe, count = 100) {
  let basePrice = 0;

  // საბაზისო ფასის დაყენება სიმბოლოს მიხედვით
  switch (symbol.split('/')[0]) {
    case 'BTC':
      basePrice = 55000 + Math.random() * 5000;
      break;
    case 'ETH':
      basePrice = 3000 + Math.random() * 300;
      break;
    case 'BNB':
      basePrice = 400 + Math.random() * 50;
      break;
    case 'XRP':
      basePrice = 0.5 + Math.random() * 0.1;
      break;
    case 'ADA':
      basePrice = 0.3 + Math.random() * 0.05;
      break;
    case 'SOL':
      basePrice = 100 + Math.random() * 20;
      break;
    case 'DOGE':
      basePrice = 0.1 + Math.random() * 0.02;
      break;
    case 'DOT':
      basePrice = 5 + Math.random() * 1;
      break;
    case 'AVAX':
      basePrice = 25 + Math.random() * 5;
      break;
    case 'MATIC':
      basePrice = 0.7 + Math.random() * 0.1;
      break;
    default:
      basePrice = 100 + Math.random() * 20;
    }
    return data;
  }

  const volatility = 0.02; // 2% ვოლატილობა
  const data = [];
  let lastClose = basePrice;
  
  // დროის მასშტაბი
  let timeStep;
  switch (timeframe) {
    case '1m':
      timeStep = 60 * 1000; // 1 წუთი მილისეკუნდებში
      break;
    case '5m':
      timeStep = 5 * 60 * 1000; // 5 წუთი მილისეკუნდებში
      break;
    // Add other cases as needed
    default:
      throw new Error('Unsupported timeframe');
  }