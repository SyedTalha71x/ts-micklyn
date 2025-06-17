import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Typewriter } from "@/lib/Typewriter";

const Catoshi = ({ data }) => {
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
        // "all" - use all data
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
  }, [step, descriptionData, currentData, chartData]);

  return (
    <div className="space-y-4">
      {/* Step 0: Description */}
      {descriptionData && step >= 0 && (
        <div className="prose dark:prose-invert max-w-none p-4 rounded-lg">
          <Typewriter text={descriptionData.data} />
        </div>
      )}

      {/* Step 1: Current Data */}
      {currentData && step >= 1 && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold text-sm mb-3">
            Current Market Data
          </h3>
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(currentData.data).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b">
                <span className="font-bold ">
                  <Typewriter text={`${key}:`} speed={30} />
                </span>
                <span>
                  <Typewriter
                    text={value.toString()}
                    speed={30}
                    delay={key.length * 50}
                  />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2-3: Chart Loading & Chart Display */}
      {chartData && step >= 2 && (
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          {step < 3 ? (
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
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
};

export default Catoshi;
