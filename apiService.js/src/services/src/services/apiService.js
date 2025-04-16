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
      timeStep = 5 * 60 * 1000; // 5 წუთი
      break;
    case '15m':
      timeStep = 15 * 60 * 1000; // 15 წუთი
      break;
    case '1h':
      timeStep = 60 * 60 * 1000; // 1 საათი
      break;
    case '4h':
      timeStep = 4 * 60 * 60 * 1000; // 4 საათი
      break;
    case '1d':
      timeStep = 24 * 60 * 60 * 1000; // 1 დღე
      break;
    case '1w':
      timeStep = 7 * 24 * 60 * 60 * 1000; // 1 კვირა
      break;
    default:
      timeStep = 24 * 60 * 60 * 1000; // ნაგულისხმევად 1 დღე
  }

  const now = new Date().getTime();
  
  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * timeStep;
    
    // სანთლის მონაცემების გენერაცია
    const change = (Math.random() - 0.5) * 2 * volatility * lastClose;
    const open = lastClose;
    const close = open + change;
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);
    
    // მოცულობის გენერაცია
    const volume = Math.floor(basePrice * 10 * (1 + Math.random()));
    
    data.push({
      time: Math.floor(time / 1000), // უნიქს დროის ფორმატში (წამები)
      open,
      high,
      low,
      close,
      volume
    });
    
    lastClose = close;
  }
  
  return data;
}

// ფუნქცია, რომელიც იღებს კრიპტოვალუტის მონაცემებს
export const fetchCurrencyData = async (symbol, timeframe) => {
  try {
    // რეალურ აპლიკაციაში აქ უნდა იყოს API-სთან დაკავშირება
    // მაგალითად:
    // const response = await axios.get(`https://api.example.com/crypto/${symbol}?timeframe=${timeframe}`);
    // return response.data;
    
    // დემო მონაცემების დაბრუნება
    return generateDemoData(symbol, timeframe);
  } catch (error) {
    console.error("შეცდომა მონაცემების მიღებისას:", error);
    throw error;
  }
};