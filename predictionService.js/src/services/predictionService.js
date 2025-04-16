// პროგნოზირების სერვისი

// ფუნქცია, რომელიც გენერირებს პროგნოზებს მონაცემების საფუძველზე
export const generatePrediction = (data, indicators, strategy) => {
    if (!data || data.length === 0 || !indicators) {
      return null;
    }
  
    // პროგნოზირების პარამეტრები სტრატეგიის მიხედვით
    let upProbability = 0.5; // ნაგულისხმევი მნიშვნელობა - 50%
    let confidence = 0.6; // ნაგულისხმევი სანდოობა - 60%
    
    // დროის ჩარჩოს განსაზღვრა
    let timeframe = "24 საათი";
    
    // პროგნოზის მოდიფიცირება ტექნიკური ინდიკატორების მიხედვით
    
    // RSI გავლენა
    if (indicators.rsi) {
      if (indicators.rsi < 30) {
        upProbability += 0.15;
        confidence += 0.05;
      } else if (indicators.rsi > 70) {
        upProbability -= 0.15;
        confidence += 0.05;
      } else if (indicators.rsi > 50) {
        upProbability += 0.05;
      } else {
        upProbability -= 0.05;
      }
    }
    
    // MACD გავლენა
    if (indicators.macd) {
      if (indicators.macd.histogram > 0) {
        upProbability += 0.1;
        if (indicators.macd.histogram > indicators.macd.previousHistogram) {
          upProbability += 0.05;
          confidence += 0.03;
        }
      } else {
        upProbability -= 0.1;
        if (indicators.macd.histogram < indicators.macd.previousHistogram) {
          upProbability -= 0.05;
          confidence += 0.03;
        }
      }
    }
    
    // მოძრავი საშუალოები
    if (indicators.sma20 && indicators.sma20.length > 0 && 
        indicators.sma50 && indicators.sma50.length > 0) {
      const sma20 = indicators.sma20[indicators.sma20.length - 1].value;
      const sma50 = indicators.sma50[indicators.sma50.length - 1].value;
      
      if (sma20 > sma50) {
        upProbability += 0.08;
        const ratio = sma20 / sma50;
        if (ratio > 1.05) {
          upProbability += 0.05;
          confidence += 0.04;
        }
      } else {
        upProbability -= 0.08;
        const ratio = sma50 / sma20;
        if (ratio > 1.05) {
          upProbability -= 0.05;
          confidence += 0.04;
        }
      }
    }
    
    // ბოლინჯერის ზოლები
    if (indicators.bbands && indicators.lastPrice) {
      const price = indicators.lastPrice;
      const { upper, lower, middle } = indicators.bbands;
      
      if (price < lower) {
        upProbability += 0.12;
        confidence += 0.04;
      } else if (price > upper) {
        upProbability -= 0.12;
        confidence += 0.04;
      } else if (price > middle) {
        upProbability += 0.06;
      } else {
        upProbability -= 0.06;
      }
    }
    
    // პატერნების გავლენა
    if (indicators.patterns && indicators.patterns.length > 0) {
      indicators.patterns.forEach(pattern => {
        if (pattern.bullish) {
          upProbability += 0.07;
        } else {
          upProbability -= 0.07;
        }
        confidence += 0.02;
      });
    }
    
    // ვრწმუნდებით, რომ ალბათობა 0-სა და 1-ს შორისაა
    upProbability = Math.min(0.95, Math.max(0.05, upProbability));
    confidence = Math.min(0.95, Math.max(0.5, confidence));
    
    // მოსალოდნელი ფასის ცვლილების გაანგარიშება
    // ეს არის მარტივი მოდელი - რეალურ სისტემაში უფრო რთული ალგორითმი უნდა იყოს
    
    const lastPrice = indicators.lastPrice;
    const volatility = calculateVolatility(data);
    
    let expectedMove;
    if (upProbability > 0.5) {
      expectedMove = volatility * ((upProbability - 0.5) * 10) * confidence;
    } else {
      expectedMove = -volatility * ((0.5 - upProbability) * 10) * confidence;
    }
    
    // დაბრუნება
    return {
      upProbability,
      downProbability: 1 - upProbability,
      expectedMove: expectedMove.toFixed(2),
      timeframe,
      confidence
    };
  };
  
  // მარტივი ვოლატილობის გამოთვლის ფუნქცია
  function calculateVolatility(data, period = 14) {
    if (data.length < period) {
      return 2; // ნაგულისხმევი მნიშვნელობა თუ საკმარისი მონაცემები არ არის
    }
    
    const returns = [];
    for (let i = 1; i < data.length; i++) {
      const dailyReturn = (data[i].close - data[i-1].close) / data[i-1].close;
      returns.push(dailyReturn);
    }
    
    // საშუალო აბსოლუტური დევიაცია
    const recentReturns = returns.slice(-period);
    const avgReturn = recentReturns.reduce((sum, val) => sum + val, 0) / recentReturns.length;
    
    const deviations = recentReturns.map(r => Math.abs(r - avgReturn));
    const avgDeviation = deviations.reduce((sum, val) => sum + val, 0) / deviations.length;
    
    return avgDeviation * 100 * 2; // გადაყვანა პროცენტებში და მასშტაბირება
  }