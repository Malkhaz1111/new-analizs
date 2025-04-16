import { calculateSMA, calculateEMA, calculateRSI, calculateMACD, calculateBollingerBands } from '../utils/indicators';
import { detectPatterns } from '../utils/helpers';

// ფუნქცია, რომელიც აანალიზებს სავაჭრო მონაცემებს
export const analyzeData = (data, strategy) => {
  if (!data || data.length === 0) {
    return {};
  }

  const closePrices = data.map(item => item.close);
  const lastPrice = closePrices[closePrices.length - 1];
  
  // ძირითადი ინდიკატორების გამოთვლა
  const rsi = calculateRSI(closePrices, 14);
  const macd = calculateMACD(closePrices);
  
  // მოძრავი საშუალოების გამოთვლა
  const sma20Data = calculateSMA(data, 20);
  const sma50Data = calculateSMA(data, 50);
  
  const ema12 = calculateEMA(closePrices, 12)[closePrices.length - 1];
  const ema26 = calculateEMA(closePrices, 26)[closePrices.length - 1];
  
  // ბოლინჯერის ზოლების გამოთვლა
  const bbands = calculateBollingerBands(closePrices, 20, 2);
  
  // მოცულობის სერიების მომზადება
  const volumeSeries = data.map(item => ({
    time: item.time,
    value: item.volume,
    color: item.close > item.open ? 'rgba(76, 175, 80, 0.5)' : 'rgba(255, 82, 82, 0.5)'
  }));
  
  // პატერნების დეტექცია
  const patterns = detectPatterns(data);
  
  // სიგნალის დადგენა არჩეული სტრატეგიის მიხედვით
  let signal = 'neutral';
  let description = 'ტრენდის გარეშე';
  
  switch (strategy) {
    case 'sma-crossover':
      // SMA კვეთის სტრატეგია
      if (sma20Data.length > 0 && sma50Data.length > 0) {
        const sma20 = sma20Data[sma20Data.length - 1].value;
        const sma50 = sma50Data[sma50Data.length - 1].value;
        const prevSma20 = sma20Data[sma20Data.length - 2]?.value;
        const prevSma50 = sma50Data[sma50Data.length - 2]?.value;
        
        if (sma20 > sma50 && prevSma20 <= prevSma50) {
          signal = 'buy';
          description = 'SMA20 გადაკვეთა SMA50 ზევით - სავარაუდოდ აღმავალი ტრენდი';
        } else if (sma20 < sma50 && prevSma20 >= prevSma50) {
          signal = 'sell';
          description = 'SMA20 გადაკვეთა SMA50 ქვევით - სავარაუდოდ დაღმავალი ტრენდი';
        } else if (sma20 > sma50) {
          signal = 'neutral-bullish';
          description = 'SMA20 SMA50-ის ზემოთაა - ზოგადად აღმავალი ტრენდი';
        } else {
          signal = 'neutral-bearish';
          description = 'SMA20 SMA50-ის ქვემოთაა - ზოგადად დაღმავალი ტრენდი';
        }
      }
      break;
    
    case 'ema-crossover':
      // EMA კვეთის სტრატეგია
      const emaValues = data.map((_, i) => {
        if (i < 26) return null;
        return {
          ema12: calculateEMA(closePrices.slice(0, i + 1), 12).pop(),
          ema26: calculateEMA(closePrices.slice(0, i + 1), 26).pop()
        };
      }).filter(Boolean);
      
      if (emaValues.length >= 2) {
        const current = emaValues[emaValues.length - 1];
        const previous = emaValues[emaValues.length - 2];
        
        if (current.ema12 > current.ema26 && previous.ema12 <= previous.ema26) {
          signal = 'buy';
          description = 'EMA12 გადაკვეთა EMA26 ზევით - სავარაუდოდ აღმავალი ტრენდი';
        } else if (current.ema12 < current.ema26 && previous.ema12 >= previous.ema26) {
          signal = 'sell';
          description = 'EMA12 გადაკვეთა EMA26 ქვევით - სავარაუდოდ დაღმავალი ტრენდი';
        } else if (current.ema12 > current.ema26) {
          signal = 'neutral-bullish';
          description = 'EMA12 EMA26-ის ზემოთაა - ზოგადად აღმავალი ტრენდი';
        } else {
          signal = 'neutral-bearish';
          description = 'EMA12 EMA26-ის ქვემოთაა - ზოგადად დაღმავალი ტრენდი';
        }
      }
      break;
    
    case 'macd':
      // MACD სტრატეგია
      if (macd.histogram > 0 && macd.previousHistogram <= 0) {
        signal = 'buy';
        description = 'MACD ჰისტოგრამა გადავიდა პოზიტიურში - შესაძლო ყიდვის სიგნალი';
      } else if (macd.histogram < 0 && macd.previousHistogram >= 0) {
        signal = 'sell';
        description = 'MACD ჰისტოგრამა გადავიდა ნეგატიურში - შესაძლო გაყიდვის სიგნალი';
      } else if (macd.histogram > 0) {
        signal = 'neutral-bullish';
        description = 'MACD ჰისტოგრამა პოზიტიურია - აღმავალი მომენტუმი';
      } else {
        signal = 'neutral-bearish';
        description = 'MACD ჰისტოგრამა ნეგატიურია - დაღმავალი მომენტუმი';
      }
      break;
    
    case 'rsi-divergence':
      // RSI სტრატეგია
      if (rsi < 30) {
        signal = 'buy';
        description = 'RSI გადაყიდულ ზონაშია (<30) - შესაძლო ყიდვის სიგნალი';
      } else if (rsi > 70) {
        signal = 'sell';
        description = 'RSI გადაყიდულ ზონაშია (>70) - შესაძლო გაყიდვის სიგნალი';
      } else if (rsi > 50) {
        signal = 'neutral-bullish';
        description = 'RSI 50-ზე მეტია - ზომიერი აღმავალი მომენტუმი';
      } else {
        signal = 'neutral-bearish';
        description = 'RSI 50-ზე ნაკლებია - ზომიერი დაღმავალი მომენტუმი';
      }
      break;
    
    case 'bollinger-bands':
      // ბოლინჯერის ზოლების სტრატეგია
      if (lastPrice < bbands.lower) {
        signal = 'buy';
        description = 'ფასი ბოლინჯერის ქვედა ზოლის ქვემოთაა - შესაძლო ყიდვის სიგნალი';
      } else if (lastPrice > bbands.upper) {
        signal = 'sell';
        description = 'ფასი ბოლინჯერის ზედა ზოლის ზემოთაა - შესაძლო გაყიდვის სიგნალი';
      } else if (lastPrice > bbands.middle) {
        signal = 'neutral-bullish';
        description = 'ფასი ბოლინჯერის შუა ზოლის ზემოთაა - ზომიერი აღმავალი ტრენდი';
      } else {
        signal = 'neutral-bearish';
        description = 'ფასი ბოლინჯერის შუა ზოლის ქვემოთაა - ზომიერი დაღმავალი ტრენდი';
      }
      break;
  }
  
  return {
    lastPrice,
    rsi,
    macd,
    ema12,
    ema26,
    bbands,
    sma20: sma20Data,
    sma50: sma50Data,
    volumeSeries,
    patterns,
    summary: {
      signal,
      description
    }
  };
};