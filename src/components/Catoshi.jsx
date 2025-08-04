import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Typewriter } from "@/lib/Typewriter";

// Helper component to render parsed text (without animation)
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
      
      // Add bold text
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
  const [step, setStep] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState([]);
  const [timeRange, setTimeRange] = useState("all");
  const [filteredChartData, setFilteredChartData] = useState([]);

  const descriptionData = data.find(
    (item) => item.response_type === "chatoshi_description"
  );
  const currentData = data.find(
    (item) => item.response_type === "chatoshi_current_data"
  );
  const chartData = data.find(
    (item) => item.response_type === "chatoshi_chart"
  );

  // Filter chart data based on time range
  useEffect(() => {
    if (!chartData?.data) return;

    const now = new Date();
    let filteredData = [...chartData.data];

    switch (timeRange) {
      case "today":
        const today = new Date(now.setHours(0, 0, 0, 0));
        filteredData = chartData.data.filter((item) => {
          const itemDate = new Date(item.Date);
          return itemDate >= today;
        });
        break;
      case "7days":
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        filteredData = chartData.data.filter((item) => {
          const itemDate = new Date(item.Date);
          return itemDate >= sevenDaysAgo;
        });
        break;
      case "30days":
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        filteredData = chartData.data.filter((item) => {
          const itemDate = new Date(item.Date);
          return itemDate >= thirtyDaysAgo;
        });
        break;
      default:
        break;
    }

    setFilteredChartData(filteredData);
  }, [chartData, timeRange]);

  const chartOptions = {
    chart: {
      type: "candlestick",
      height: 350,
      toolbar: { show: true },
    },
    title: {
      text: "Price Chart",
      size: 24,
      align: "left",
    },
    xaxis: { type: "datetime" },
    yaxis: { tooltip: { enabled: true } },
    plotOptions: {
      candlestick: {
        colors: { upward: "#00B746", downward: "#EF403C" },
        wick: { useFillColor: true },
      },
    },
  };

  const chartSeries = [
    {
      data: filteredChartData.map((item) => ({
        x: new Date(item.Date).getTime(),
        y: [item.Open, item.High, item.Low, item.Close],
      })),
    },
  ];

  // Sequence controller
  useEffect(() => {
    if (isHistory) return; // Skip animation logic in history view

    if (step === 0 && descriptionData) {
      setTimeout(() => setStep(1), 4000);
    } else if (step === 1 && currentData) {
      setTimeout(() => setStep(2), 4000);
    } else if (step === 2 && chartData) {
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
  }, [step, descriptionData, currentData, chartData, isHistory]);

  return (
    <div className="space-y-4">
      {/* Step 0: Description */}
      {descriptionData && (
        <div className="prose dark:prose-invert max-w-none p-4 rounded-lg">
          {isHistory ? (
            <StaticText text={descriptionData.data} />
          ) : (
            step >= 0 && <Typewriter text={descriptionData.data} />
          )}
        </div>
      )}

      {/* Step 1: Current Data */}
      {currentData && (
        (isHistory || step >= 1) && (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-bold text-sm mb-3">
              {isHistory ? "Market Data" : "Current Market Data"}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(currentData.data).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b">
                  <span className="font-bold">
                    {isHistory ? (
                      <StaticText text={`${key}:`} />
                    ) : (
                      <Typewriter text={`${key}:`} speed={30} />
                    )}
                  </span>
                  <span>
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
        )
      )}

      {/* Step 2-3: Chart Loading & Chart Display */}
      {chartData && (
        (isHistory || step >= 2) && (
          <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
            {isHistory || step === 3 ? (
              <>
                <div className="flex justify-end mb-4">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                  >
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                </div>
                {typeof window !== "undefined" && (
                  <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="candlestick"
                    height={350}
                  />
                )}
              </>
            ) : (
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
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Catoshi;