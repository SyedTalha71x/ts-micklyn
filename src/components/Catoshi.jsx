import React, { useState, useEffect, useRef, useMemo } from "react";
import Chart from "react-apexcharts";
import { Typewriter } from "@/lib/Typewriter";

const StaticText = ({ text = "" }) => {
  if (!text || typeof text !== "string") return null;

  const parseTextSegments = (text) => {
    const segments = [];
    let currentIndex = 0;

    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > currentIndex) {
        const beforeText = text.slice(currentIndex, match.index);
        beforeText.split("").forEach((char) => {
          segments.push({ char, isBold: false });
        });
      }

      match[1].split("").forEach((char) => {
        segments.push({ char, isBold: true });
      });

      currentIndex = match.index + match[0].length;
    }

    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      remainingText.split("").forEach((char) => {
        segments.push({ char, isBold: false });
      });
    }

    return segments;
  };

  const segments = parseTextSegments(text);

  return (
    <div style={{ fontFamily: "inherit", lineHeight: 1.6 }}>
      {segments.map((segment, index) => {
        if (segment.char === "\n") {
          return <br key={`br-${index}`} />;
        }

        return (
          <span
            key={`${segment.char}-${index}`}
            style={{
              fontWeight: segment.isBold ? 600 : "normal",
              fontSize: segment.isBold ? "1.1em" : "1em",
            }}
          >
            {segment.char}
          </span>
        );
      })}
    </div>
  );
};

const Catoshi = ({ data, isHistory = false }) => {
  const chartRef = useRef(null);
  const [step, setStep] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [timeRange, setTimeRange] = useState("all");
  
  // Use useMemo for filtered data to prevent infinite loops
  const { filteredChartData, currentDataItems, chartDataItems, descriptionData } = useMemo(() => {
    // Extract all data types from the response
    const description = data?.find(
      (item) => item.response_type === "chatoshi_description"
    ) || null;

    // Get all current data items (multiple tokens)
    const currentItems = data?.filter(
      (item) => item.response_type === "chatoshi_current_data"
    ) || [];

    // Get all chart data items (multiple tokens)
    const chartItems = data?.filter(
      (item) => item.response_type === "chatoshi_chart"
    ) || [];

    // Filter chart data based on time range for all tokens
    const filteredData = {};
    const now = new Date();

    chartItems.forEach((chartData) => {
      const key = `${chartData.token}-${chartData.chain}`;
      let filteredChart = [...(chartData.data || [])];

      switch (timeRange) {
        case "today":
          const today = new Date(now.setHours(0, 0, 0, 0));
          filteredChart = (chartData.data || []).filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate >= today;
          });
          break;
        case "7days":
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          filteredChart = (chartData.data || []).filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate >= sevenDaysAgo;
          });
          break;
        case "30days":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          filteredChart = (chartData.data || []).filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate >= thirtyDaysAgo;
          });
          break;
        default:
          break;
      }

      filteredData[key] = filteredChart;
    });

    return {
      filteredChartData: filteredData,
      currentDataItems: currentItems,
      chartDataItems: chartItems,
      descriptionData: description
    };
  }, [data, timeRange]); // Only re-calculate when data or timeRange changes

  // Dynamic Y-axis configuration based on price range
  const getDynamicYaxisConfig = (chartData) => {
    if (!chartData || !chartData.length) return {};

    // Extract all price values
    const allPrices = chartData.flatMap(item => [
      item.Open, item.High, item.Low, item.Close
    ]).filter(price => !isNaN(price) && price !== null);

    if (allPrices.length === 0) return {};

    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;

    // Calculate dynamic min and max with padding
    const padding = priceRange * 0.1 || 0.01; // 10% padding, min 0.01
    const yaxisMin = Math.max(0, minPrice - padding);
    const yaxisMax = maxPrice + padding;

    return {
      min: yaxisMin,
      max: yaxisMax,
      tickAmount: 6,
      forceNiceScale: true,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px',
          fontWeight: 500
        },
        formatter: function (value) {
          // Format based on price range
          if (maxPrice < 1) {
            return "$" + value.toFixed(4);
          } else if (maxPrice < 10) {
            return "$" + value.toFixed(3);
          } else if (maxPrice < 1000) {
            return "$" + value.toFixed(2);
          } else {
            return "$" + value.toFixed(0);
          }
        }
      },
      decimalsInFloat: maxPrice < 1 ? 4 : maxPrice < 10 ? 3 : 2
    };
  };

  // Chart options for candlestick
 // Chart options for candlestick - IMPROVED VISIBILITY
  const getChartOptions = (token, chain) => {
    const key = `${token}-${chain}`;
    const chartData = filteredChartData[key] || [];
    const yaxisConfig = getDynamicYaxisConfig(chartData);
    
    // Calculate maxPrice for this specific chart
    const allPrices = chartData.flatMap(item => [
      item.Open, item.High, item.Low, item.Close
    ]).filter(price => !isNaN(price) && price !== null);
    
    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

    return {
      chart: {
        type: "candlestick",
        height: 400,
        background: 'transparent',
        foreColor: '#9ca3af',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          },
          autoSelected: 'zoom'
        },
        animations: {
          enabled: true,
          speed: 800
        },
        zoom: {
          enabled: true,
          type: 'x',
          autoScaleYaxis: true
        }
      },
      title: {
        text: `${token} on (${chain})`,
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: '600',
          color: '#e5e7eb'
        }
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px',
            fontWeight: 500
          },
          datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH:mm'
          },
          rotate: 0
        },
        axisBorder: {
          show: true,
          color: '#374151'
        },
        axisTicks: {
          show: true,
          color: '#374151'
        }
      },
      yaxis: {
        ...yaxisConfig,
        tooltip: {
          enabled: true
        },
        opposite: true,
        labels: {
          style: {
            colors: '#9ca3af',
            fontSize: '12px',
            fontWeight: 500
          },
          formatter: function (value) {
            if (maxPrice < 1) {
              return "$" + value.toFixed(6);
            } else if (maxPrice < 10) {
              return "$" + value.toFixed(4);
            } else if (maxPrice < 1000) {
              return "$" + value.toFixed(2);
            } else {
              return "$" + value.toLocaleString();
            }
          }
        },
        axisBorder: {
          show: true,
          color: '#374151'
        }
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: '#a3e635',    // Bright lime green (bullish)
            downward: '#f87171'   // Bright red (bearish)
          },
          wick: {
            useFillColor: true
          }
        }
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif'
        },
        x: {
          format: 'dd MMM yyyy HH:mm'
        },
        custom: function({ seriesIndex, dataPointIndex, w }) {
          const data = w.config.series[seriesIndex]?.data?.[dataPointIndex];
          if (data && data.y) {
            const [open, high, low, close] = data.y;
            const date = new Date(data.x).toLocaleString('en-US', {
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
            
            const isBullish = close >= open;
            const change = close - open;
            const changePercent = ((change / open) * 100).toFixed(2);
            
            return `
              <div style="
                background: #1f2937;
                color: #e5e7eb;
                padding: 14px;
                border-radius: 8px;
                border: 1px solid #374151;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                font-family: 'Inter', sans-serif;
                min-width: 200px;
              ">
                <div style="margin-bottom: 10px; font-weight: 600; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${date}
                </div>
                <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; font-size: 14px;">
                  <div style="color: #9ca3af;">Open:</div>
                  <div style="font-weight: 700; color: #e5e7eb; text-align: right; font-family: 'Courier New', monospace;">
                    $${open?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) || '0.00'}
                  </div>
                  
                  <div style="color: #9ca3af;">High:</div>
                  <div style="font-weight: 700; color: #a3e635; text-align: right; font-family: 'Courier New', monospace;">
                    $${high?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) || '0.00'}
                  </div>
                  
                  <div style="color: #9ca3af;">Low:</div>
                  <div style="font-weight: 700; color: #f87171; text-align: right; font-family: 'Courier New', monospace;">
                    $${low?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) || '0.00'}
                  </div>
                  
                  <div style="color: #9ca3af;">Close:</div>
                  <div style="font-weight: 700; color: ${isBullish ? '#a3e635' : '#f87171'}; text-align: right; font-family: 'Courier New', monospace;">
                    $${close?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) || '0.00'}
                  </div>
                </div>
                <div style="
                  margin-top: 12px; 
                  padding-top: 12px; 
                  border-top: 1px solid #374151; 
                  font-size: 13px; 
                  font-weight: 600;
                  color: ${isBullish ? '#a3e635' : '#f87171'};
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                ">
                  <span>${isBullish ? '▲' : '▼'} ${isBullish ? 'Bullish' : 'Bearish'}</span>
                  <span>${changePercent > 0 ? '+' : ''}${changePercent}%</span>
                </div>
              </div>
            `;
          }
          return '';
        }
      },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: true
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 10
        }
      },
      stroke: {
        width: 2
      },
      states: {
        hover: {
          filter: {
            type: 'lighten',
            value: 0.1
          }
        },
        active: {
          filter: {
            type: 'darken',
            value: 0.1
          }
        }
      },
      responsive: [{
        breakpoint: 768,
        options: {
          chart: {
            height: 300
          },
          yaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          }
        }
      }]
    };
  };

  const getChartSeries = (token, chain) => {
    const key = `${token}-${chain}`;
    const chartData = filteredChartData[key] || [];

    const candleData = chartData.map((item) => ({
      x: new Date(item.Date).getTime(),
      y: [
        parseFloat(item.Open) || 0,
        parseFloat(item.High) || 0,
        parseFloat(item.Low) || 0,
        parseFloat(item.Close) || 0
      ]
    }));
    return [
      {
        name: `${token} (${chain})`,
        type: 'candlestick',
        data: candleData
      },
    ];
  };

  // Combined comparison chart
  const getComparisonChartOptions = () => {
    const allSeriesData = chartDataItems.flatMap(chartData => {
      const key = `${chartData.token}-${chartData.chain}`;
      const chartDataFiltered = filteredChartData[key] || [];
      return chartDataFiltered.map(item => item.Close).filter(val => !isNaN(val));
    });

    const minPrice = allSeriesData.length > 0 ? Math.min(...allSeriesData) : 0;
    const maxPrice = allSeriesData.length > 0 ? Math.max(...allSeriesData) : 1;
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1 || 0.01;

    return {
      chart: {
        type: "line",
        height: 350,
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true
          }
        }
      },
      title: {
        text: "",
        align: 'left',
        style: {
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#1e293b'
        }
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px'
          }
        }
      },
      yaxis: {
        min: Math.max(0, minPrice - padding),
        max: maxPrice + padding,
        tickAmount: 6,
        forceNiceScale: true,
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '12px',
            fontWeight: 500
          },
          formatter: function (value) {
            if (maxPrice < 1) {
              return "$" + value.toFixed(4);
            } else if (maxPrice < 10) {
              return "$" + value.toFixed(3);
            } else if (maxPrice < 1000) {
              return "$" + value.toFixed(2);
            } else {
              return "$" + value.toFixed(0);
            }
          }
        },
        tooltip: { enabled: true }
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      markers: {
        size: 4,
        hover: {
          size: 6
        }
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        theme: 'light',
        style: {
          fontSize: '12px',
          background: '#ffffff',
          color: '#000000',
          border: '1px solid #e2e8f0'
        }
      },
      grid: {
        borderColor: '#A0AEC0',
        strokeDashArray: 4
      }
    };
  };

  const getComparisonChartSeries = () => {
    return chartDataItems.map((chartData, index) => {
      const key = `${chartData.token}-${chartData.chain}`;
      const chartDataFiltered = filteredChartData[key] || [];
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

      return {
        name: "",
        data: chartDataFiltered.map((item) => ({
          x: new Date(item.Date).getTime(),
          y: item.Close,
        })),
        color: colors[index % colors.length],
      };
    });
  };

  // Time range buttons data
  const timeRangeButtons = [
    { value: "today", label: "Today" },
    { value: "7days", label: "7D" },
    { value: "30days", label: "30D" },
    { value: "all", label: "All" }
  ];

  // Sequence controller - FIXED: Prevent infinite loop
  useEffect(() => {
    if (isHistory) return;

    const timer = setTimeout(() => {
      if (step === 0 && descriptionData) {
        setStep(1);
      } else if (step === 1 && currentDataItems.length > 0) {
        setStep(2);
      } else if (step === 2 && chartDataItems.length > 0) {
        const steps = [
          "Preparing chart data...",
          "Analyzing market trends...",
          "Calculating price movements...",
          "Finalizing visualization...",
          "Almost done...",
        ];
        setLoadingSteps(steps);
        
        // Use a single timeout instead of multiple
        setTimeout(() => {
          setStep(3);
        }, steps.length * 2000 + 3000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [step, isHistory, descriptionData, currentDataItems.length, chartDataItems.length]);

  // Early return if no data
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No chart data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Step 0: Description */}
      {descriptionData && (
        <div className="prose dark:prose-invert max-w-none rounded-lg p-4">
          {isHistory ? (
            <StaticText text={descriptionData.data} />
          ) : (
            step >= 0 && <Typewriter text={descriptionData.data} />
          )}
        </div>
      )}

      {/* Step 1: Current Data Comparison */}
      {currentDataItems.length > 0 && (isHistory || step >= 1) && (
        <div className="bg-white dark:bg-[#1b1c1e] border border-[#A0AEC0] dark:border-gray-600 p-6 rounded-lg shadow">
          <h3 className="font-bold text-lg mb-4 border-b pb-2 border-[#A0AEC0] dark:border-gray-600">
            {isHistory
              ? "Market Data Comparison"
              : "Current Market Data Comparison"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentDataItems.map((currentData, index) => (
              <div
                key={`${currentData.token}-${currentData.chain}-${index}`}
                className="border rounded-lg dark:bg-[#1b1c1e] border-[#A0AEC0] dark:border-gray-600"
              >
                {/* <h4 className="font-semibold text-md mb-3 py-2 text-center border-b border-[#A0AEC0] dark:border-gray-600">
                  {currentData.token} on {currentData.chain}
                </h4> */}
                <div className="space-y-2">
                  {Object.entries(currentData.data || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between px-4">
                      <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
                        {isHistory ? (
                          <StaticText text={`${key}:`} />
                        ) : (
                          <Typewriter text={`${key}:`} speed={30} />
                        )}
                      </span>
                      <span className="font-semibold text-sm">
                        {isHistory ? (
                          <StaticText text={String(value)} />
                        ) : (
                          <Typewriter
                            text={String(value)}
                            speed={30}
                            delay={key.length * 50}
                          />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2-3: Chart Loading & Chart Display */}
      {chartDataItems.length > 0 && (isHistory || step >= 2) && (
        <div ref={chartRef} className="space-y-6">
          {/* Time Range Selector - Improved Visibility */}
          <div className="flex justify-end">
            <div className="inline-flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
              {timeRangeButtons.map((button) => (
                <button
                  key={button.value}
                  onClick={() => setTimeRange(button.value)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    timeRange === button.value
                      ? 'bg-gray-700 text-white'
                      : 'bg-white dark:bg-[#1b1c1e] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  } ${button.value !== 'today' ? 'border-l border-gray-300 dark:border-gray-600' : ''}`}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          {isHistory || step === 3 ? (
            <>
              {/* Combined Comparison Chart */}
              {chartDataItems.length > 1 && (
                <div className="bg-white dark:bg-[#1b1c1e] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
                    Price Comparison Chart
                  </h3>
                  {typeof window !== "undefined" && (
                    <Chart
                      options={getComparisonChartOptions()}
                      series={getComparisonChartSeries()}
                      type="line"
                      height={350}
                    />
                  )}
                </div>
              )}

              {/* Individual Candlestick Charts */}
              {chartDataItems.map((chartData, index) => {
                const key = `${chartData.token}-${chartData.chain}`;
                const chartSeries = getChartSeries(
                  chartData.token,
                  chartData.chain
                );

                // Skip if no valid data points
                if (!chartSeries[0]?.data?.length) {
                  return (
                    <div
                      key={key}
                      className="p-4 text-center text-gray-800 dark:text-gray-200"
                    >
                      No valid data points for {chartData.token} on{" "}
                      {chartData.chain}
                    </div>
                  );
                }

                return (
                  <div
                    key={`${key}-${index}`}
                    className="bg-white dark:bg-[#1b1c1e] border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow"
                  >

                    {typeof window !== "undefined" && (
                      <div className="relative">
                        <Chart
                          options={getChartOptions(
                            chartData.token,
                            chartData.chain
                          )}
                          series={chartSeries}
                          type="candlestick"
                          height={350}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="bg-white dark:bg-[#1b1c1e] border border-gray-300 text-black dark:text-white dark:border-[#1b1c1e] p-6 rounded-lg shadow">
              <div className="space-y-2">
                {loadingSteps.map((stepText, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-black dark:text-white"
                  >
                    <div
                      className="w-4 h-4 rounded-full bg-[#1b1c1e] text-black dark:text-white mr-2 animate-pulse"
                      style={{ animationDelay: `${idx * 0.2}s` }}
                    />
                    <Typewriter
                      text={stepText}
                      speed={20}
                      delay={idx * 1000}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Catoshi;