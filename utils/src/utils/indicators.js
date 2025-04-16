// ტექნიკური ინდიკატორების გამოთვლის ფუნქციები

// SMA (Simple Moving Average) გამოთვლა
export const calculateSMA = (data, period) => {
    const result = [];
    
    if (data.length < period) {
      return result;
    }
    
    for (let i = period - 1; i < data.length; i++) {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      const sma = sum / period;
      result.push({
        time: data[i].time,
        value: sma
      });
    }
    
    return result;
  };
  
  // EMA (Exponential Moving Average) გამოთვლა
  export const calculateEMA = (prices, period) => {
    const result = [];
    const multiplier = 2 / (period + 1);
    
    // პირველი EMA = SMA (პირველი period რაოდენობის ელემენტის)
    let sma = 0;
    for (let i = 0; i < period; i++) {
      sma += prices[i];
    }
    sma /= period;
    
    result.push(sma);
    
    // დანარჩენი EMA-ების გამოთვლა
    for (let i = period; i < prices.length; i++) {
      const ema = (prices[i] - result[result.length - 1]) * multiplier + result[result.length - 1];
      result.push(ema);
    }
    
    return result;
  };
  
  // RSI (Relative Strength Index) გამოთვლა
  export const calculateRSI = (prices, period = 14) => {
    if (prices.length < period + 1) {
      return 50; // ნაგულისხმევი მნიშვნელობა
    }
    
    const deltas = [];
    for (let i = 1; i < prices.length; i++) {
      deltas.push(prices[i] - prices[i - 1]);
    }
    
    let gain = 0;
    let loss = 0;
    
    // საწყისი gain და loss
    for (let i = 0; i < period; i++) {
      if (deltas[i] > 0) {
        gain += deltas[i];
      } else {
        loss -= deltas[i];
      }
    }
    
    gain /= period;
    loss /= period;
    
    // გამოვთვალოთ უკანასკნელი მნიშვნელობის RS და RSI
    for (let i = period; i < deltas.length; i++) {
      if (deltas[i] > 0) {
        gain = (gain * (period - 1) + deltas[i]) / period;
        loss = (loss * (period - 1)) / period;
      } else {
        gain = (gain * (period - 1)) / period;
        loss = (loss * (period - 1) - deltas[i]) / period;
      }
    }
    
    const rs = gain / (loss === 0 ? 0.00001 : loss);
    return 100 - (100 / (1 + rs));
  };
  
  // MACD (Moving Average Convergence Divergence) გამოთვლა
  export const calculateMACD = (prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    // EMA-ების გამოთვლა
    const fastEMA = calculateEMA(prices, fastPeriod);
    const slowEMA = calculateEMA(prices, slowPeriod);
    
    // MACD ხაზის გამოთვლა (fastEMA - slowEMA)
    const macdLine = [];
    for (let i = slowPeriod - fastPeriod; i < fastEMA.length; i++) {
      macdLine.push(fastEMA[i] - slowEMA[i - (slowPeriod - fastPeriod)]);
    }
    
    // სიგნალის ხაზი (MACD ხაზის EMA)
    const signalLine = calculateEMA(macdLine, signalPeriod);
    
    // ჰისტოგრამა (MACD ხაზი - სიგნალის ხაზი)
    const histogram = macdLine[macdLine.length - 1] - signalLine[signalLine.length - 1];
    const previousHistogram = macdLine[macdLine.length - 2] - signalLine[signalLine.length - 2];
    
    return {
      value: macdLine[macdLine.length - 1],
      signal: signalLine[signalLine.length - 1],
      histogram,
      previousHistogram
    };
  };
  
  // ბოლინჯერის ზოლების გამოთვლა
  export const calculateBollingerBands = (prices, period = 20, multiplier = 2) => {
    if (prices.length < period) {
      return {
        upper: prices[prices.length - 1] * 1.05,
        middle: prices[prices.length - 1],
        lower: prices[prices.length - 1] * 0.95
      };
    }
    
    // პერიოდის შესაბამისი მონაცემების აღება
    const periodicPrices = prices.slice(-period);
    
    // საშუალოს გამოთვლა
    const sum = periodicPrices.reduce((total, price) => total + price, 0);
    const middle = sum / period;
    
    // სტანდარტული გადახრის გამოთვლა
    const squaredDeviations = periodicPrices.map(price => Math.pow(price - middle, 2));
    const variance = squaredDeviations.reduce((total, dev) => total + dev, 0) / period;
    const standardDeviation = Math.sqrt(variance);
    
    // ზედა და ქვედა ზოლების გამოთვლა
    const upper = middle + multiplier * standardDeviation;
    const lower = middle - multiplier * standardDeviation;
    
    return { upper, middle, lower };
  };