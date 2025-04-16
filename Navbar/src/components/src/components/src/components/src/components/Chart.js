import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

function Chart({ data, indicators }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // თუ უკვე არსებობს, გავასუფთავოთ არსებული ჩარტი
    if (chartRef.current) {
      chartContainerRef.current.innerHTML = '';
      chartRef.current = null;
    }

    // შევქმნათ ახალი ჩარტი
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: 'solid', color: '#1a2234' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2a3245' },
        horzLines: { color: '#2a3245' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#2a3245',
      },
      timeScale: {
        borderColor: '#2a3245',
        timeVisible: true,
      },
    });

    // ფანჯრის ზომის ცვლილებაზე რეაგირება
    const handleResize = () => {
      chart.applyOptions({ 
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight 
      });
    };

    window.addEventListener('resize', handleResize);

    // დავამატოთ სანთლის ჩარტი
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#50fa7b',
      downColor: '#ff5555',
      borderVisible: false,
      wickUpColor: '#50fa7b',
      wickDownColor: '#ff5555',
    });

    candleSeries.setData(data);

    // დავამატოთ ინდიკატორები, თუ არსებობს
    if (indicators) {
      // SMA ინდიკატორები
      if (indicators.sma20) {
        const sma20Series = chart.addLineSeries({
          color: '#2196f3',
          lineWidth: 2,
          title: 'SMA 20',
        });
        sma20Series.setData(indicators.sma20);
      }

      if (indicators.sma50) {
        const sma50Series = chart.addLineSeries({
          color: '#ff9800',
          lineWidth: 2,
          title: 'SMA 50',
        });
        sma50Series.setData(indicators.sma50);
      }

      // MACD ინდიკატორი
      if (indicators.volumeSeries) {
        const volumeSeries = chart.addHistogramSeries({
          color: '#26a69a',
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: '',
          scaleMargins: {
            top: 0.8,
            bottom: 0,
          },
        });
        volumeSeries.setData(indicators.volumeSeries);
      }
    }

    chart.timeScale().fitContent();
    chartRef.current = chart;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chart.remove();
        chartRef.current = null;
      }
    };
  }, [data, indicators]);

  return (
    <div 
      ref={chartContainerRef} 
      style={{ width: '100%', height: '100%' }}
    />
  );
}

export default Chart;