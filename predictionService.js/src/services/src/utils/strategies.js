// სტრატეგიების ფუნქციები

// SMA კვეთის სტრატეგია
export const smaStrategy = (data, shortPeriod = 20, longPeriod = 50) => {
    // SMA გამოთვლა
    const shortSMA = calculateSMA(data.map(d => d.close), shortPeriod);
    const longSMA = calculateSMA(data.map(d => d.close), longPeriod);
    
    if (shortSMA.length < 2 || longSMA.length < 2) {
      return { signal: 'neutral', explanation: 'არასაკმარისი მონაცემები' };
    }
    
    const currentShortSMA = shortSMA[shortSMA.length - 1];
    const previousShortSMA = shortSMA[shortSMA.length - 2];
        const currentLongSMA = longSMA[longSMA.length - 1];
    };