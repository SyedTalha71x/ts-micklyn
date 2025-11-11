import React, { useState, useEffect } from "react";
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
        beforeText.split('').forEach(char => {
          segments.push({ char, isBold: false });
        });
      }
      
      match[1].split('').forEach(char => {
        segments.push({ char, isBold: true });
      });
      
      currentIndex = match.index + match[0].length;
    }
    
    if (currentIndex < text.length) {
      const remainingText = text.slice(currentIndex);
      remainingText.split('').forEach(char => {
        segments.push({ char, isBold: false });
      });
    }
    
    return segments;
  };

  const segments = parseTextSegments(text);

  return (
    <div style={{ fontFamily: 'inherit', lineHeight: 1.6 }}>
      {segments.map((segment, index) => {
        if (segment.char === '\n') {
          return <br key={`br-${index}`} />;
        }
        
        return (
          <span
            key={`${segment.char}-${index}`}
            style={{
              fontWeight: segment.isBold ? 600 : 'normal',
              fontSize: segment.isBold ? '1.1em' : '1em',
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
  const chartRef = React.useRef(null);

  const [step, setStep] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [timeRange, setTimeRange] = useState("all");
  const [filteredChartData, setFilteredChartData] = useState({});

  // Extract all data types from the response
  const descriptionData = data.find(
    (item) => item.response_type === "chatoshi_description"
  );
  
  // Get all current data items (multiple tokens)
  const currentDataItems = data.filter(
    (item) => item.response_type === "chatoshi_current_data"
  );
  
  // Get all chart data items (multiple tokens)
  const chartDataItems = data.filter(
    (item) => item.response_type === "chatoshi_chart"
  );

  // Filter chart data based on time range for all tokens
  useEffect(() => {
    if (!chartDataItems.length) return;

    const now = new Date();
    const filteredData = {};

    chartDataItems.forEach((chartData) => {
      const key = `${chartData.token}-${chartData.chain}`;
      let filteredChart = [...chartData.data];

      switch (timeRange) {
        case "today":
          const today = new Date(now.setHours(0, 0, 0, 0));
          filteredChart = chartData.data.filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate >= today;
          });
          break;
        case "7days":
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          filteredChart = chartData.data.filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate >= sevenDaysAgo;
          });
          break;
        case "30days":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          filteredChart = chartData.data.filter((item) => {
            const itemDate = new Date(item.Date);
            return itemDate >= thirtyDaysAgo;
          });
          break;
        default:
          break;
      }

      filteredData[key] = filteredChart;
    });

    setFilteredChartData(filteredData);
  }, [chartDataItems, timeRange]);

  // Chart options for comparison
  const getChartOptions = (token, chain) => ({
    chart: {
      type: "candlestick",
      height: 350,
      toolbar: { show: true },
    },
    title: {
      text: `${token} on ${chain} - Price Chart`,
      size: 18,
      align: "left",
    },
    xaxis: { type: "datetime" },
    yaxis: { 
      tooltip: { enabled: true },
      labels: {
        formatter: function(value) {
          return "$" + value.toFixed(3);
        }
      }
    },
    plotOptions: {
      candlestick: {
        colors: { upward: "#00B746", downward: "#EF403C" },
        wick: { useFillColor: true },
      },
    },
  });

  // Generate chart series for each token
  const getChartSeries = (token, chain) => {
    const key = `${token}-${chain}`;
    const chartData = filteredChartData[key] || [];
    
    return [
      {
        name: `${token} (${chain})`,
        data: chartData.map((item) => ({
          x: new Date(item.Date).getTime(),
          y: [item.Open, item.High, item.Low, item.Close],
        })),
      },
    ];
  };

  // Combined comparison chart
  const getComparisonChartOptions = () => ({
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: true },
    },
    title: {
      text: "Price Comparison",
      size: 18,
      align: "left",
    },
    xaxis: { type: "datetime" },
    yaxis: { 
      tooltip: { enabled: true },
      labels: {
        formatter: function(value) {
          return "$" + value.toFixed(3);
        }
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    markers: {
      size: 0
    },
  });

  const getComparisonChartSeries = () => {
    return chartDataItems.map((chartData, index) => {
      const key = `${chartData.token}-${chartData.chain}`;
      const chartDataFiltered = filteredChartData[key] || [];
      const colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'];
      
      return {
        name: `${chartData.token} (${chartData.chain})`,
        data: chartDataFiltered.map((item) => ({
          x: new Date(item.Date).getTime(),
          y: item.Close
        })),
        color: colors[index % colors.length]
      };
    });
  };

  // Sequence controller
  useEffect(() => {
    if (isHistory) return; // Skip animation logic in history view

    if (step === 0 && descriptionData) {
      setTimeout(() => setStep(1), 4000);
    } else if (step === 1 && currentDataItems.length > 0) {
      setTimeout(() => setStep(2), 4000);
    } else if (step === 2 && chartDataItems.length > 0) {
      const steps = [
        "Preparing chart data...",
        "Analyzing market trends...",
        "Calculating price movements...",
        "Finalizing visualization...",
        "Almost done...",
      ];
      setLoadingSteps(steps);
      let totalLoadingTime = steps.length * 2000 + 3000;
      setTimeout(() => setStep(3), totalLoadingTime);
    }
  }, [step, descriptionData, currentDataItems, chartDataItems, isHistory]);

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
      {currentDataItems.length > 0 && (
        (isHistory || step >= 1) && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">
              {isHistory ? "Market Data Comparison" : "Current Market Data Comparison"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentDataItems.map((currentData, index) => (
                <div key={`${currentData.token}-${currentData.chain}`} 
                     className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-semibold text-md mb-3 text-center">
                    {currentData.token} on {currentData.chain}
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(currentData.data).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-sm text-gray-600">
                          {isHistory ? (
                            <StaticText text={`${key}:`} />
                          ) : (
                            <Typewriter text={`${key}:`} speed={30} />
                          )}
                        </span>
                        <span className="font-semibold text-sm">
                          {isHistory ? (
                            <StaticText text={value.toString()} />
                          ) : (
                            <Typewriter
                              text={value.toString()}
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
        )
      )}

      {/* Step 2-3: Chart Loading & Chart Display */}
      {chartDataItems.length > 0 && (
        (isHistory || step >= 2) && (
          <div ref={chartRef} className="space-y-6">
            {/* Time Range Selector */}
            <div className="flex justify-end">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            {isHistory || step === 3 ? (
              <>
                {/* Combined Comparison Chart */}
                {chartDataItems.length > 1 && (
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Price Comparison Chart</h3>
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

                {/* Individual Charts */}
                {/* {chartDataItems.map((chartData) => (
                  <div key={`${chartData.token}-${chartData.chain}`} 
                       className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                    {typeof window !== "undefined" && (
                      <Chart
                        options={getChartOptions(chartData.token, chartData.chain)}
                        series={getChartSeries(chartData.token, chartData.chain)}
                        type="candlestick"
                        height={350}
                      />
                    )}
                  </div>
                ))} */}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow">
                <div className="space-y-2">
                  {loadingSteps.map((stepText, index) => (
                    <div key={index} className="flex items-center">
                      <div
                        className="w-4 h-4 rounded-full bg-blue-500 mr-2 animate-pulse"
                        style={{ animationDelay: `${index * 0.2}s` }}
                      />
                      <Typewriter text={stepText} speed={20} delay={index * 1000} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Catoshi;