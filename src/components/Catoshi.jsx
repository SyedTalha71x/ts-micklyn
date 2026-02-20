// import React, { useState, useEffect, useRef, useMemo } from "react";
// import Chart from "react-apexcharts";
// import { Typewriter } from "@/lib/Typewriter";
// import { ChevronDown } from "lucide-react";

// const StaticText = ({ text = "" }) => {
//   if (!text || typeof text !== "string") return null;

//   const parseTextSegments = (text) => {
//     const segments = [];
//     let currentIndex = 0;

//     const boldRegex = /\*\*(.*?)\*\*/g;
//     let match;

//     while ((match = boldRegex.exec(text)) !== null) {
//       if (match.index > currentIndex) {
//         const beforeText = text.slice(currentIndex, match.index);
//         beforeText.split("").forEach((char) => {
//           segments.push({ char, isBold: false });
//         });
//       }

//       match[1].split("").forEach((char) => {
//         segments.push({ char, isBold: true });
//       });

//       currentIndex = match.index + match[0].length;
//     }

//     if (currentIndex < text.length) {
//       const remainingText = text.slice(currentIndex);
//       remainingText.split("").forEach((char) => {
//         segments.push({ char, isBold: false });
//       });
//     }

//     return segments;
//   };

//   const segments = parseTextSegments(text);

//   return (
//     <div style={{ fontFamily: "inherit", lineHeight: 1.6 }}>
//       {segments.map((segment, index) => {
//         if (segment.char === "\n") {
//           return <br key={`br-${index}`} />;
//         }

//         return (
//           <span
//             key={`${segment.char}-${index}`}
//             style={{
//               fontWeight: segment.isBold ? 600 : "normal",
//               fontSize: segment.isBold ? "1.1em" : "1em",
//             }}
//           >
//             {segment.char}
//           </span>
//         );
//       })}
//     </div>
//   );
// };

// const Catoshi = ({ data, isHistory = false }) => {
//   const chartRef = useRef(null);
//   const [step, setStep] = useState(0);
//   const [loadingSteps, setLoadingSteps] = useState([]);
//   const [timeRange, setTimeRange] = useState("all");
//   const [chartType, setChartType] = useState("line");
//   const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
//   const [showChartTypeDropdown, setShowChartTypeDropdown] = useState(false);

//   // Helper function to parse date strings consistently (handles timezone issues)
//   const parseDateString = (dateString) => {
//     // If the date string is in ISO format with T00:00:00, we want to treat it as UTC midnight
//     // to avoid timezone shifts
//     if (dateString.includes('T00:00:00')) {
//       const [datePart] = dateString.split('T');
//       const [year, month, day] = datePart.split('-').map(Number);
//       // Create date at UTC midnight
//       return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
//     }
//     return new Date(dateString);
//   };

//   // Helper function to get start of day in UTC
//   const getUTCMidnight = (date) => {
//     return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
//   };

//   // Use useMemo for filtered data to prevent infinite loops
//   const {
//     filteredChartData,
//     filteredLineData,
//     currentDataItems,
//     chartDataItems,
//     descriptionData,
//   } = useMemo(() => {
//     // Extract all data types from the response
//     const description =
//       data?.find((item) => item.response_type === "chatoshi_description") ||
//       null;

//     // Get all current data items (multiple tokens)
//     const currentItems =
//       data?.filter((item) => item.response_type === "chatoshi_current_data") ||
//       [];

//     // Get all chart data items (multiple tokens)
//     const chartItems =
//       data?.filter((item) => item.response_type === "chatoshi_chart") || [];

//     // Filter chart data based on time range for all tokens
//     const filteredChart = {};
//     const filteredLine = {};

//     // Get current date in UTC for consistent comparison
//     const now = new Date();
//     const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));

//     chartItems.forEach((chartData) => {
//       const key = `${chartData.token}-${chartData.chain}`;
      
//       // Filter candle data
//       let filteredCandleData = [...(chartData.data || [])];
      
//       // Filter line data
//       let filteredLineChartData = [...(chartData.charts.line_data || [])];

//       switch (timeRange) {
//         case "today":
//           filteredCandleData = (chartData.data || []).filter((item) => {
//             const itemDate = parseDateString(item.Date);
//             // Compare dates in UTC
//             return itemDate >= todayUTC;
//           });
          
//           filteredLineChartData = (chartData.charts.line_data || []).filter((item) => {
//             const itemDate = parseDateString(item.x);
//             return itemDate >= todayUTC;
//           });
//           break;
          
//         case "7days":
//           const sevenDaysAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7, 0, 0, 0));
          
//           filteredCandleData = (chartData.data || []).filter((item) => {
//             const itemDate = parseDateString(item.Date);
//             return itemDate >= sevenDaysAgo;
//           });
          
//           filteredLineChartData = (chartData.charts.line_data || []).filter((item) => {
//             const itemDate = parseDateString(item.x);
//             return itemDate >= sevenDaysAgo;
//           });
//           break;
          
//         case "30days":
//           const thirtyDaysAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30, 0, 0, 0));
          
//           filteredCandleData = (chartData.data || []).filter((item) => {
//             const itemDate = parseDateString(item.Date);
//             return itemDate >= thirtyDaysAgo;
//           });
          
//           filteredLineChartData = (chartData.charts.line_data || []).filter((item) => {
//             const itemDate = parseDateString(item.x);
//             return itemDate >= thirtyDaysAgo;
//           });
//           break;
//         default:
//           break;
//       }

//       // Sort the filtered data by date to ensure proper order
//       filteredCandleData.sort((a, b) => parseDateString(a.Date) - parseDateString(b.Date));
//       filteredLineChartData.sort((a, b) => parseDateString(a.x) - parseDateString(b.x));

//       filteredChart[key] = filteredCandleData;
//       filteredLine[key] = filteredLineChartData;
//     });

//     return {
//       filteredChartData: filteredChart,
//       filteredLineData: filteredLine,
//       currentDataItems: currentItems,
//       chartDataItems: chartItems,
//       descriptionData: description,
//     };
//   }, [data, timeRange]);

//   // Dynamic Y-axis configuration based on price range
//   const getDynamicYaxisConfig = (chartData, isCandle = false) => {
//     if (!chartData || !chartData.length) return {};

//     let allPrices = [];
    
//     if (isCandle) {
//       // For candle data
//       allPrices = chartData
//         .flatMap((item) => [item.Open, item.High, item.Low, item.Close])
//         .filter((price) => !isNaN(price) && price !== null);
//     } else {
//       // For line data
//       allPrices = chartData
//         .map((item) => item.y)
//         .filter((price) => !isNaN(price) && price !== null);
//     }

//     if (allPrices.length === 0) return {};

//     const minPrice = Math.min(...allPrices);
//     const maxPrice = Math.max(...allPrices);
//     const priceRange = maxPrice - minPrice;

//     // Calculate dynamic min and max with padding
//     const padding = priceRange * 0.1 || 0.01;
//     const yaxisMin = Math.max(0, minPrice - padding);
//     const yaxisMax = maxPrice + padding;

//     return {
//       min: yaxisMin,
//       max: yaxisMax,
//       tickAmount: 6,
//       forceNiceScale: true,
//       labels: {
//         style: {
//           colors: "#64748b",
//           fontSize: "12px",
//           fontWeight: 500,
//         },
//         formatter: function (value) {
//           if (maxPrice < 1) {
//             return "$" + value.toFixed(4);
//           } else if (maxPrice < 10) {
//             return "$" + value.toFixed(3);
//           } else if (maxPrice < 1000) {
//             return "$" + value.toFixed(2);
//           } else {
//             return "$" + value.toFixed(0);
//           }
//         },
//       },
//       decimalsInFloat: maxPrice < 1 ? 4 : maxPrice < 10 ? 3 : 2,
//     };
//   };

//   // Chart options for LINE chart (using line_data directly from API)
//   const getLineChartOptions = (token, chain) => {
//     const key = `${token}-${chain}`;
//     const lineData = filteredLineData[key] || [];
//     const yaxisConfig = getDynamicYaxisConfig(lineData, false);
    
//     // Calculate maxPrice for this specific chart
//     const allPrices = lineData
//       .map((item) => item.y)
//       .filter((price) => !isNaN(price) && price !== null);

//     const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

//     return {
//       chart: {
//         type: "line",
//         height: 400,
//         background: "transparent",
//         foreColor: "#9ca3af",
//         toolbar: {
//           show: true,
//           tools: {
//             download: false,
//             selection: false,
//             zoom: false,
//             zoomin: true,
//             zoomout: true,
//             pan: false,
//             reset: false,
//           },
//           autoSelected: "zoom",
//         },
//         animations: {
//           enabled: true,
//           speed: 800,
//         },
//         zoom: {
//           enabled: true,
//           type: "x",
//           autoScaleYaxis: true,
//         },
//       },
//       title: {
//         text: `${
//           token && chain
//             ? `${token} on (${chain})`
//             : token
//             ? token
//             : chain
//             ? chain
//             : ""
//         }`,
//         align: "left",
//         style: {
//           fontSize: "18px",
//           fontWeight: "600",
//           color: "#364153",
//         },
//       },
//       xaxis: {
//         type: "datetime",
//         labels: {
//           style: {
//             colors: "#9ca3af",
//             fontSize: "12px",
//             fontWeight: 500,
//           },
//           datetimeFormatter: {
//             year: "yyyy",
//             month: "MMM 'yy",
//             day: "dd MMM",
//           },
//           rotate: 0,
//         },
//         axisBorder: {
//           show: true,
//           color: "#374151",
//         },
//         axisTicks: {
//           show: true,
//           color: "#374151",
//         },
//       },
//       yaxis: {
//         ...yaxisConfig,
//         tooltip: {
//           enabled: true,
//         },
//         opposite: true,
//         labels: {
//           style: {
//             colors: "#9ca3af",
//             fontSize: "12px",
//             fontWeight: 500,
//           },
//           formatter: function (value) {
//             if (maxPrice < 1) {
//               return "$" + value.toFixed(6);
//             } else if (maxPrice < 10) {
//               return "$" + value.toFixed(4);
//             } else if (maxPrice < 1000) {
//               return "$" + value.toFixed(2);
//             } else {
//               return "$" + value.toLocaleString();
//             }
//           },
//         },
//         axisBorder: {
//           show: true,
//           color: "#374151",
//         },
//       },
//       stroke: {
//         curve: "smooth",
//         width: 2,
//         colors: ["#3b82f6"],
//       },
//       markers: {
//         size: 0,
//       },
//       tooltip: {
//         enabled: true,
//         theme: "dark",
//         style: {
//           fontSize: "13px",
//           fontFamily: "Inter, sans-serif",
//         },
//         x: {
//           format: "dd MMM yyyy",
//         },
//         y: {
//           formatter: function (value) {
//             if (maxPrice < 1) {
//               return "$" + value.toFixed(6);
//             } else if (maxPrice < 10) {
//               return "$" + value.toFixed(4);
//             } else if (maxPrice < 1000) {
//               return "$" + value.toFixed(2);
//             } else {
//               return "$" + value.toLocaleString();
//             }
//           },
//           title: {
//             formatter: () => "Price:",
//           },
//         },
//       },
//       grid: {
//         borderColor: "#374151",
//         strokeDashArray: 3,
//         xaxis: {
//           lines: {
//             show: true,
//           },
//         },
//         yaxis: {
//           lines: {
//             show: true,
//           },
//         },
//         padding: {
//           top: 0,
//           right: 20,
//           bottom: 0,
//           left: 10,
//         },
//       },
//       states: {
//         hover: {
//           filter: {
//             type: "lighten",
//             value: 0.1,
//           },
//         },
//         active: {
//           filter: {
//             type: "darken",
//             value: 0.1,
//           },
//         },
//       },
//       responsive: [
//         {
//           breakpoint: 768,
//           options: {
//             chart: {
//               height: 300,
//             },
//             yaxis: {
//               labels: {
//                 style: {
//                   fontSize: "10px",
//                 },
//               },
//             },
//             xaxis: {
//               labels: {
//                 style: {
//                   fontSize: "10px",
//                 },
//               },
//             },
//           },
//         },
//       ],
//     };
//   };

//   // Chart options for CANDLESTICK (using data directly from API)
//   const getCandleChartOptions = (token, chain) => {
//     const key = `${token}-${chain}`;
//     const chartData = filteredChartData[key] || [];
//     const yaxisConfig = getDynamicYaxisConfig(chartData, true);

//     // Calculate maxPrice for this specific chart
//     const allPrices = chartData
//       .flatMap((item) => [item.Open, item.High, item.Low, item.Close])
//       .filter((price) => !isNaN(price) && price !== null);

//     const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

//     return {
//       chart: {
//         type: "candlestick",
//         height: 400,
//         background: "transparent",
//         foreColor: "#9ca3af",
//         toolbar: {
//           show: true,
//           tools: {
//             download: false,
//             selection: false,
//             zoom: false,
//             zoomin: true,
//             zoomout: true,
//             pan: false,
//             reset: false,
//           },
//           autoSelected: "zoom",
//         },
//         animations: {
//           enabled: true,
//           speed: 800,
//         },
//         zoom: {
//           enabled: true,
//           type: "x",
//           autoScaleYaxis: true,
//         },
//       },
//       title: {
//         text: `${
//           token && chain
//             ? `${token} on (${chain})`
//             : token
//             ? token
//             : chain
//             ? chain
//             : ""
//         }`,
//         align: "left",
//         style: {
//           fontSize: "18px",
//           fontWeight: "600",
//           color: "#364153",
//         },
//       },
//       xaxis: {
//         type: "datetime",
//         labels: {
//           style: {
//             colors: "#9ca3af",
//             fontSize: "12px",
//             fontWeight: 500,
//           },
//           datetimeFormatter: {
//             year: "yyyy",
//             month: "MMM 'yy",
//             day: "dd MMM",
//           },
//           rotate: 0,
//         },
//         axisBorder: {
//           show: true,
//           color: "#374151",
//         },
//         axisTicks: {
//           show: true,
//           color: "#374151",
//         },
//       },
//       yaxis: {
//         ...yaxisConfig,
//         tooltip: {
//           enabled: true,
//         },
//         opposite: true,
//         labels: {
//           style: {
//             colors: "#9ca3af",
//             fontSize: "12px",
//             fontWeight: 500,
//           },
//           formatter: function (value) {
//             if (maxPrice < 1) {
//               return "$" + value.toFixed(6);
//             } else if (maxPrice < 10) {
//               return "$" + value.toFixed(4);
//             } else if (maxPrice < 1000) {
//               return "$" + value.toFixed(2);
//             } else {
//               return "$" + value.toLocaleString();
//             }
//           },
//         },
//         axisBorder: {
//           show: true,
//           color: "#374151",
//         },
//       },
//       plotOptions: {
//         candlestick: {
//           colors: {
//             upward: "#a3e635",
//             downward: "#f87171",
//           },
//           wick: {
//             useFillColor: true,
//           },
//         },
//       },
//       tooltip: {
//         enabled: true,
//         theme: "dark",
//         style: {
//           fontSize: "13px",
//           fontFamily: "Inter, sans-serif",
//         },
//         x: {
//           format: "dd MMM yyyy",
//         },
//         custom: function ({ seriesIndex, dataPointIndex, w }) {
//           const data = w.config.series[seriesIndex]?.data?.[dataPointIndex];
//           if (data && data.y) {
//             const [open, high, low, close] = data.y;
//             const date = new Date(data.x).toLocaleString("en-US", {
//               month: "short",
//               day: "2-digit",
//               year: "numeric",
//               timeZone: "UTC"
//             });

//             const isBullish = close >= open;
//             const change = close - open;
//             const changePercent = ((change / open) * 100).toFixed(2);

//             return `
//               <div style="
//                 background: #1f2937;
//                 color: #e5e7eb;
//                 padding: 14px;
//                 border-radius: 8px;
//                 border: 1px solid #374151;
//                 box-shadow: 0 10px 25px rgba(0,0,0,0.3);
//                 font-family: 'Inter', sans-serif;
//                 min-width: 200px;
//               ">
//                 <div style="margin-bottom: 10px; font-weight: 600; color: #9ca3af; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
//                   ${date}
//                 </div>
//                 <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 16px; font-size: 14px;">
//                   <div style="color: #9ca3af;">Open:</div>
//                   <div style="font-weight: 700; color: #e5e7eb; text-align: right; font-family: 'Courier New', monospace;">
//                     $${
//                       open?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) ||
//                       "0.00"
//                     }
//                   </div>
                  
//                   <div style="color: #9ca3af;">High:</div>
//                   <div style="font-weight: 700; color: #a3e635; text-align: right; font-family: 'Courier New', monospace;">
//                     $${
//                       high?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) ||
//                       "0.00"
//                     }
//                   </div>
                  
//                   <div style="color: #9ca3af;">Low:</div>
//                   <div style="font-weight: 700; color: #f87171; text-align: right; font-family: 'Courier New', monospace;">
//                     $${
//                       low?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) ||
//                       "0.00"
//                     }
//                   </div>
                  
//                   <div style="color: #9ca3af;">Close:</div>
//                   <div style="font-weight: 700; color: ${
//                     isBullish ? "#a3e635" : "#f87171"
//                   }; text-align: right; font-family: 'Courier New', monospace;">
//                     $${
//                       close?.toFixed(
//                         maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2
//                       ) || "0.00"
//                     }
//                   </div>
//                 </div>
//                 <div style="
//                   margin-top: 12px; 
//                   padding-top: 12px; 
//                   border-top: 1px solid #374151; 
//                   font-size: 13px; 
//                   font-weight: 600;
//                   color: ${isBullish ? "#a3e635" : "#f87171"};
//                   display: flex;
//                   align-items: center;
//                   justify-content: space-between;
//                 ">
//                   <span>${isBullish ? "▲" : "▼"} ${
//               isBullish ? "Bullish" : "Bearish"
//             }</span>
//                   <span>${changePercent > 0 ? "+" : ""}${changePercent}%</span>
//                 </div>
//               </div>
//             `;
//           }
//           return "";
//         },
//       },
//       grid: {
//         borderColor: "#374151",
//         strokeDashArray: 3,
//         xaxis: {
//           lines: {
//             show: true,
//           },
//         },
//         yaxis: {
//           lines: {
//             show: true,
//           },
//         },
//         padding: {
//           top: 0,
//           right: 20,
//           bottom: 0,
//           left: 10,
//         },
//       },
//       stroke: {
//         width: 2,
//       },
//       states: {
//         hover: {
//           filter: {
//             type: "lighten",
//             value: 0.1,
//           },
//         },
//         active: {
//           filter: {
//             type: "darken",
//             value: 0.1,
//           },
//         },
//       },
//       responsive: [
//         {
//           breakpoint: 768,
//           options: {
//             chart: {
//               height: 300,
//             },
//             yaxis: {
//               labels: {
//                 style: {
//                   fontSize: "10px",
//                 },
//               },
//             },
//             xaxis: {
//               labels: {
//                 style: {
//                   fontSize: "10px",
//                 },
//               },
//             },
//           },
//         },
//       ],
//     };
//   };

//   // Get chart options based on selected type
//   const getChartOptions = (token, chain) => {
//     return chartType === "line"
//       ? getLineChartOptions(token, chain)
//       : getCandleChartOptions(token, chain);
//   };

//   const getChartSeries = (token, chain) => {
//     const key = `${token}-${chain}`;
    
//     if (chartType === "line") {
//       // Use line_data directly from API
//       const lineData = filteredLineData[key] || [];
      
//       return [
//         {
//           name: `${token} (${chain})`,
//           type: "line",
//           data: lineData.map((item) => ({
//             x: parseDateString(item.x).getTime(),
//             y: parseFloat(item.y) || 0,
//           })),
//         },
//       ];
//     } else {
//       // Use data directly from API for candlestick
//       const chartData = filteredChartData[key] || [];
      
//       const candleData = chartData.map((item) => ({
//         x: parseDateString(item.Date).getTime(),
//         y: [
//           parseFloat(item.Open) || 0,
//           parseFloat(item.High) || 0,
//           parseFloat(item.Low) || 0,
//           parseFloat(item.Close) || 0,
//         ],
//       }));
      
//       return [
//         {
//           name: `${token} (${chain})`,
//           type: "candlestick",
//           data: candleData,
//         },
//       ];
//     }
//   };

//   // Combined comparison chart
//   const getComparisonChartOptions = () => {
//     const allSeriesData = chartDataItems.flatMap((chartData) => {
//       const key = `${chartData.token}-${chartData.chain}`;
//       const lineData = filteredLineData[key] || [];
//       return lineData
//         .map((item) => item.y)
//         .filter((val) => !isNaN(val));
//     });

//     const minPrice = allSeriesData.length > 0 ? Math.min(...allSeriesData) : 0;
//     const maxPrice = allSeriesData.length > 0 ? Math.max(...allSeriesData) : 1;
//     const priceRange = maxPrice - minPrice;
//     const padding = priceRange * 0.1 || 0.01;

//     return {
//       chart: {
//         type: "line",
//         height: 350,
//         toolbar: {
//           show: true,
//           tools: {
//             download: true,
//             selection: true,
//             zoom: true,
//             zoomin: true,
//             zoomout: true,
//             pan: true,
//             reset: true,
//           },
//         },
//       },
//       title: {
//         text: "",
//         align: "left",
//         style: {
//           fontSize: "18px",
//           fontWeight: "600",
//           color: "#000000",
//         },
//       },
//       xaxis: {
//         type: "datetime",
//         labels: {
//           style: {
//             colors: "#64748b",
//             fontSize: "11px",
//           },
//         },
//       },
//       yaxis: {
//         min: Math.max(0, minPrice - padding),
//         max: maxPrice + padding,
//         tickAmount: 6,
//         forceNiceScale: true,
//         labels: {
//           style: {
//             colors: "#64748b",
//             fontSize: "12px",
//             fontWeight: 500,
//           },
//           formatter: function (value) {
//             if (maxPrice < 1) {
//               return "$" + value.toFixed(4);
//             } else if (maxPrice < 10) {
//               return "$" + value.toFixed(3);
//             } else if (maxPrice < 1000) {
//               return "$" + value.toFixed(2);
//             } else {
//               return "$" + value.toFixed(0);
//             }
//           },
//         },
//         tooltip: { enabled: true },
//       },
//       stroke: {
//         curve: "smooth",
//         width: 2,
//       },
//       markers: {
//         size: 0,
//       },
//       tooltip: {
//         enabled: true,
//         shared: true,
//         intersect: false,
//         theme: "light",
//         style: {
//           fontSize: "12px",
//           background: "#ffffff",
//           color: "#000000",
//           border: "1px solid #e2e8f0",
//         },
//       },
//       grid: {
//         borderColor: "#A0AEC0",
//         strokeDashArray: 4,
//       },
//     };
//   };

//   const getComparisonChartSeries = () => {
//     return chartDataItems.map((chartData, index) => {
//       const key = `${chartData.token}-${chartData.chain}`;
//       const lineData = filteredLineData[key] || [];
//       const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

//       return {
//         name: `${chartData.token}${chartData.chain ? ` (${chartData.chain})` : ''}`,
//         data: lineData.map((item) => ({
//           x: parseDateString(item.x).getTime(),
//           y: item.y,
//         })),
//         color: colors[index % colors.length],
//       };
//     });
//   };

//   // Time range buttons data
//   const timeRangeButtons = [
//     { value: "today", label: "Today" },
//     { value: "7days", label: "7D" },
//     { value: "30days", label: "30D" },
//     { value: "all", label: "All" },
//   ];

//   // Chart type buttons data
//   const chartTypeButtons = [
//     { value: "line", label: "Line Chart" },
//     { value: "candlestick", label: "Candle Chart" },
//   ];

//   // Get current label for time range
//   const getTimeRangeLabel = () => {
//     const button = timeRangeButtons.find((btn) => btn.value === timeRange);
//     return button ? button.label : "Today";
//   };

//   // Get current label for chart type
//   const getChartTypeLabel = () => {
//     const button = chartTypeButtons.find((btn) => btn.value === chartType);
//     return button ? button.label : "Line Chart";
//   };

//   // Sequence controller - FIXED: Prevent infinite loop
//   useEffect(() => {
//     if (isHistory) return;

//     const timer = setTimeout(() => {
//       if (step === 0 && descriptionData) {
//         setStep(1);
//       } else if (step === 1 && currentDataItems.length > 0) {
//         setStep(2);
//       } else if (step === 2 && chartDataItems.length > 0) {
//         const steps = [
//           "Preparing chart data...",
//           "Analyzing market trends...",
//           "Calculating price movements...",
//           "Finalizing visualization...",
//           "Almost done...",
//         ];
//         setLoadingSteps(steps);

//         setTimeout(() => {
//           setStep(3);
//         }, steps.length * 2000 + 3000);
//       }
//     }, 100);

//     return () => clearTimeout(timer);
//   }, [
//     step,
//     isHistory,
//     descriptionData,
//     currentDataItems.length,
//     chartDataItems.length,
//   ]);

//   // Early return if no data
//   if (!data || data.length === 0) {
//     return (
//       <div className="p-4 text-center text-gray-500 dark:text-gray-400">
//         No chart data available
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Step 0: Description */}
//       {descriptionData && (
//         <div className="prose dark:prose-invert max-w-none rounded-lg p-4">
//           {isHistory ? (
//             <StaticText text={descriptionData.data} />
//           ) : (
//             step >= 0 && <Typewriter text={descriptionData.data} />
//           )}
//         </div>
//       )}

//       {/* Step 1: Current Data Comparison */}
//       {currentDataItems.length > 0 && (isHistory || step >= 1) && (
//         <div className="bg-white dark:bg-[#1b1c1e] border border-[#A0AEC0] dark:border-gray-600 p-6 rounded-lg shadow">
//           <h3 className="font-bold text-lg mb-4 border-b pb-2 border-[#A0AEC0] dark:border-gray-600">
//             {isHistory
//               ? "Market Data Comparison"
//               : "Current Market Data Comparison"}
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {currentDataItems.map((currentData, index) => (
//               <div
//                 key={`${currentData.token}-${currentData.chain}-${index}`}
//                 className="border rounded-lg dark:bg-[#1b1c1e] border-[#A0AEC0] dark:border-gray-600"
//               >
//                 <div className="space-y-2">
//                   {Object.entries(currentData.data || {}).map(
//                     ([key, value]) => (
//                       <div key={key} className="flex justify-between px-4">
//                         <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
//                           {isHistory ? (
//                             <StaticText text={`${key}:`} />
//                           ) : (
//                             <Typewriter text={`${key}:`} speed={30} />
//                           )}
//                         </span>
//                         <span className="font-semibold text-sm">
//                           {isHistory ? (
//                             <StaticText text={String(value)} />
//                           ) : (
//                             <Typewriter
//                               text={String(value)}
//                               speed={30}
//                               delay={key.length * 50}
//                             />
//                           )}
//                         </span>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Step 2-3: Chart Loading & Chart Display */}
//       {chartDataItems.length > 0 && (isHistory || step >= 2) && (
//         <div ref={chartRef} className="space-y-6">
//           {/* Chart Controls - Fixed Mobile Layout */}
//           <div className="flex flex-col sm:flex-row justify-between gap-4">
//             {/* Mobile: Dropdowns for Time Range and Chart Type in one line */}
//             <div className="block sm:hidden w-full">
//               <div className="flex gap-2">
//                 {/* Time Range Dropdown */}
//                 <div className="relative flex-1">
//                   <button
//                     onClick={() => {
//                       setShowTimeRangeDropdown(!showTimeRangeDropdown);
//                       setShowChartTypeDropdown(false);
//                     }}
//                     className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium bg-white dark:bg-[#1b1c1e] border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     <span>{getTimeRangeLabel()}</span>
//                     <ChevronDown className="w-4 h-4 ml-2" />
//                   </button>
//                   {showTimeRangeDropdown && (
//                     <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1b1c1e] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
//                       {timeRangeButtons.map((button) => (
//                         <button
//                           key={button.value}
//                           onClick={() => {
//                             setTimeRange(button.value);
//                             setShowTimeRangeDropdown(false);
//                           }}
//                           className={`w-full text-left px-4 py-2 text-sm ${
//                             timeRange === button.value
//                               ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
//                               : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                           }`}
//                         >
//                           {button.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Chart Type Dropdown */}
//                 <div className="relative flex-1 z-50">
//                   <button
//                     onClick={() => {
//                       setShowChartTypeDropdown(!showChartTypeDropdown);
//                       setShowTimeRangeDropdown(false);
//                     }}
//                     className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium bg-white dark:bg-[#1b1c1e] border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
//                   >
//                     <span>{getChartTypeLabel()}</span>
//                     <ChevronDown className="w-4 h-4 ml-2" />
//                   </button>
//                   {showChartTypeDropdown && (
//                     <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1b1c1e] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
//                       {chartTypeButtons.map((button) => (
//                         <button
//                           key={button.value}
//                           onClick={() => {
//                             setChartType(button.value);
//                             setShowChartTypeDropdown(false);
//                           }}
//                           className={`w-full text-left px-4 py-2 text-sm ${
//                             chartType === button.value
//                               ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
//                               : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                           }`}
//                         >
//                           {button.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Desktop: Button groups */}
//             <div className="hidden sm:flex gap-6 w-full justify-between">
//               {/* Time Range Selector */}
//               <div className="inline-flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
//                 {timeRangeButtons.map((button) => (
//                   <button
//                     key={button.value}
//                     onClick={() => setTimeRange(button.value)}
//                     className={`px-4 py-2 text-sm font-medium transition-colors ${
//                       timeRange === button.value
//                         ? "bg-gray-700 text-white"
//                         : "bg-white dark:bg-[#1b1c1e] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                     } ${
//                       button.value !== "today"
//                         ? "border-l border-gray-300 dark:border-gray-600"
//                         : ""
//                     }`}
//                   >
//                     {button.label}
//                   </button>
//                 ))}
//               </div>

//               {/* Chart Type Selector */}
//               <div className="inline-flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
//                 {chartTypeButtons.map((button) => (
//                   <button
//                     key={button.value}
//                     onClick={() => setChartType(button.value)}
//                     className={`px-4 py-2 text-sm font-medium transition-colors ${
//                       chartType === button.value
//                         ? "bg-gray-700 text-white"
//                         : "bg-white dark:bg-[#1b1c1e] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
//                     } ${
//                       button.value === "candlestick"
//                         ? "border-l border-gray-300 dark:border-gray-600"
//                         : ""
//                     }`}
//                   >
//                     {button.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {isHistory || step === 3 ? (
//             <>
//               {/* Combined Comparison Chart */}
//               {chartDataItems.length > 1 && (
//                 <div className="bg-white dark:bg-[#1b1c1e] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
//                   <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
//                     Price Comparison Chart
//                   </h3>
//                   {typeof window !== "undefined" && (
//                     <Chart
//                       options={getComparisonChartOptions()}
//                       series={getComparisonChartSeries()}
//                       type="line"
//                       height={350}
//                     />
//                   )}
//                 </div>
//               )}

//               {/* Individual Charts */}
//               {chartDataItems.map((chartData, index) => {
//                 const key = `${chartData.token}-${chartData.chain}`;
//                 const chartSeries = getChartSeries(
//                   chartData.token,
//                   chartData.chain
//                 );

//                 // Skip if no valid data points
//                 if (!chartSeries[0]?.data?.length) {
//                   return (
//                     <div
//                       key={key}
//                       className="p-4 text-center text-gray-800 dark:text-gray-200"
//                     >
//                       No valid data points for {chartData.token} on{" "}
//                       {chartData.chain}
//                     </div>
//                   );
//                 }

//                 return (
//                   <div
//                     key={`${key}-${index}`}
//                     className="bg-white dark:bg-[#1b1c1e] border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow"
//                   >
//                     {typeof window !== "undefined" && (
//                       <div className="relative">
//                         <Chart
//                           options={getChartOptions(
//                             chartData.token,
//                             chartData.chain
//                           )}
//                           series={chartSeries}
//                           type={chartType === "line" ? "line" : "candlestick"}
//                           height={400}
//                         />
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </>
//           ) : (
//             <div className="bg-white dark:bg-[#1b1c1e] border border-gray-300 text-black dark:text-white dark:border-[#1b1c1e] p-6 rounded-lg shadow">
//               <div className="space-y-2">
//                 {loadingSteps.map((stepText, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center text-black dark:text-white"
//                   >
//                     <div
//                       className="w-4 h-4 rounded-full bg-[#1b1c1e] text-black dark:text-white mr-2 animate-pulse"
//                       style={{ animationDelay: `${idx * 0.2}s` }}
//                     />
//                     <Typewriter text={stepText} speed={20} delay={idx * 1000} />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Catoshi;















import React, { useState, useEffect, useRef, useMemo } from "react";
import Chart from "react-apexcharts";
import { Typewriter } from "@/lib/Typewriter";
import { ChevronDown } from "lucide-react";

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
  const [timeRange, setTimeRange] = useState("7D");
  const [chartType, setChartType] = useState("line");
  const [showTimeRangeDropdown, setShowTimeRangeDropdown] = useState(false);
  const [showChartTypeDropdown, setShowChartTypeDropdown] = useState(false);

  // Helper function to parse date strings consistently
  const parseDateString = (dateString) => {
    return new Date(dateString).getTime();
  };

  // FIXED: Properly process current data items with correct field names
const {
  currentDataItems,
  chartDataItems,
  descriptionData,
  processedChartData,
  processedLineData,
} = useMemo(() => {
  // Extract all data types from the response
  const description = data?.find(
    (item) => item.response_type === "chatoshi_description"
  ) || null;

  // FIXED: Get all current data items and format them properly with correct field names
  const currentItems = data?.filter(
    (item) => item.response_type === "chatoshi_current_data"
  ).map(item => {
    // Log the data to debug
    
    // Access the data object from the response
    const itemData = item.data.data || {};
    
    // Format the current data items to display in UI
    const formattedData = {
      chain: item.chain || 'Unknown',
      token: item.token || 'Token',
      data: {
        'Native Price': itemData['Native Price'] ? `$${parseFloat(itemData['Native Price']).toFixed(2)}` : 'N/A',
        'USD Price': itemData['Usd Price'] ? `$${parseFloat(itemData['Usd Price']).toFixed(2)}` : 'N/A',
        'Price Change': itemData['Price Change'] !== undefined ? 
          `${itemData['Price Change'] > 0 ? '+' : ''}${itemData['Price Change'].toFixed(2)}%` : 'N/A',
        'Buys': itemData['Buys'] ? itemData['Buys'].toLocaleString() : 'N/A',
        'Sells': itemData['Sells'] ? itemData['Sells'].toLocaleString() : 'N/A',
        'Volume': itemData['Volume'] ? `$${parseFloat(itemData['Volume']).toLocaleString(undefined, {maximumFractionDigits: 0})}` : 'N/A',
        'Liquidity': itemData['Usd Liquidity'] ? `$${parseFloat(itemData['Usd Liquidity']).toLocaleString(undefined, {maximumFractionDigits: 0})}` : 'N/A',
        'Market Cap': itemData['Market Cap'] ? `$${parseFloat(itemData['Market Cap']).toLocaleString(undefined, {maximumFractionDigits: 0})}` : 'N/A',
        'FDV': itemData['Fully Diluted Valuation'] ? `$${parseFloat(itemData['Fully Diluted Valuation']).toLocaleString(undefined, {maximumFractionDigits: 0})}` : 'N/A'
      }
    };
    
    return formattedData;
  }) || [];

  // Rest of your code remains the same...
  // Get all chart data items
  const chartItems = data?.filter(
    (item) => item.response_type === "chatoshi_chart"
  ) || [];

  // Process chart data based on selected time range
  const processedChart = {};
  const processedLine = {};

  chartItems.forEach((chartData) => {
    const key = `${chartData.token || 'token'}-${chartData.chain}`;
    
    let chartTimeData = [];
    if (chartData.data && chartData.data[timeRange]) {
      chartTimeData = chartData.data[timeRange] || [];
    }

    let lineTimeData = [];
    if (chartData.charts?.line_data && chartData.charts.line_data[timeRange]) {
      lineTimeData = chartData.charts.line_data[timeRange] || [];
    }

    chartTimeData.sort((a, b) => parseDateString(a.Date) - parseDateString(b.Date));
    lineTimeData.sort((a, b) => parseDateString(a.x) - parseDateString(b.x));

    processedChart[key] = chartTimeData;
    processedLine[key] = lineTimeData;
  });

  return {
    currentDataItems: currentItems,
    chartDataItems: chartItems,
    descriptionData: description,
    processedChartData: processedChart,
    processedLineData: processedLine,
  };
}, [data, timeRange]);

  // Dynamic Y-axis configuration based on price range
  const getDynamicYaxisConfig = (chartData, isCandle = false) => {
    if (!chartData || !chartData.length) return {};

    let allPrices = [];
    
    if (isCandle) {
      allPrices = chartData
        .flatMap((item) => [item.Open, item.High, item.Low, item.Close])
        .filter((price) => !isNaN(price) && price !== null);
    } else {
      allPrices = chartData
        .map((item) => item.y)
        .filter((price) => !isNaN(price) && price !== null);
    }

    if (allPrices.length === 0) return {};

    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;

    const padding = priceRange * 0.1 || 0.01;
    const yaxisMin = Math.max(0, minPrice - padding);
    const yaxisMax = maxPrice + padding;

    return {
      min: yaxisMin,
      max: yaxisMax,
      tickAmount: 6,
      forceNiceScale: true,
      labels: {
        style: {
          colors: "#64748b",
          fontSize: "12px",
          fontWeight: 500,
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
        },
      },
      decimalsInFloat: maxPrice < 1 ? 4 : maxPrice < 10 ? 3 : 2,
    };
  };

  // Chart options for LINE chart
  const getLineChartOptions = (token, chain) => {
    const key = `${token || 'token'}-${chain}`;
    const lineData = processedLineData[key] || [];
    const yaxisConfig = getDynamicYaxisConfig(lineData, false);
    
    const allPrices = lineData
      .map((item) => item.y)
      .filter((price) => !isNaN(price) && price !== null);

    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

    return {
      chart: {
        type: "line",
        height: 400,
        background: "transparent",
        foreColor: "#9ca3af",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          autoSelected: "zoom",
        },
        animations: {
          enabled: true,
          speed: 800,
        },
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true,
        },
      },
      title: {
        text: `${token || 'Token'} on ${chain}`,
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: "#364153",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "12px",
            fontWeight: 500,
          },
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM 'yy",
            day: "dd MMM",
            hour: "HH:mm",
          },
          rotate: 0,
        },
        axisBorder: {
          show: true,
          color: "#374151",
        },
        axisTicks: {
          show: true,
          color: "#374151",
        },
      },
      yaxis: {
        ...yaxisConfig,
        tooltip: {
          enabled: true,
        },
        opposite: true,
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "12px",
            fontWeight: 500,
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
          },
        },
        axisBorder: {
          show: true,
          color: "#374151",
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
        colors: ["#3b82f6"],
      },
      markers: {
        size: 0,
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        style: {
          fontSize: "13px",
          fontFamily: "Inter, sans-serif",
        },
        x: {
          format: "dd MMM yyyy HH:mm",
        },
        y: {
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
          },
          title: {
            formatter: () => "Price:",
          },
        },
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 10,
        },
      },
      states: {
        hover: {
          filter: {
            type: "lighten",
            value: 0.1,
          },
        },
        active: {
          filter: {
            type: "darken",
            value: 0.1,
          },
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: "10px",
                },
              },
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: "10px",
                },
              },
            },
          },
        },
      ],
    };
  };

  // Chart options for CANDLESTICK chart
  const getCandleChartOptions = (token, chain) => {
    const key = `${token || 'token'}-${chain}`;
    const chartData = processedChartData[key] || [];
    const yaxisConfig = getDynamicYaxisConfig(chartData, true);

    const allPrices = chartData
      .flatMap((item) => [item.Open, item.High, item.Low, item.Close])
      .filter((price) => !isNaN(price) && price !== null);

    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : 0;

    return {
      chart: {
        type: "candlestick",
        height: 400,
        background: "transparent",
        foreColor: "#9ca3af",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          autoSelected: "zoom",
        },
        animations: {
          enabled: true,
          speed: 800,
        },
        zoom: {
          enabled: true,
          type: "x",
          autoScaleYaxis: true,
        },
      },
      title: {
        text: `${token || 'Token'} on ${chain}`,
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: "#364153",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "12px",
            fontWeight: 500,
          },
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM 'yy",
            day: "dd MMM",
            hour: "HH:mm",
          },
          rotate: 0,
        },
        axisBorder: {
          show: true,
          color: "#374151",
        },
        axisTicks: {
          show: true,
          color: "#374151",
        },
      },
      yaxis: {
        ...yaxisConfig,
        tooltip: {
          enabled: true,
        },
        opposite: true,
        labels: {
          style: {
            colors: "#9ca3af",
            fontSize: "12px",
            fontWeight: 500,
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
          },
        },
        axisBorder: {
          show: true,
          color: "#374151",
        },
      },
      plotOptions: {
        candlestick: {
          colors: {
            upward: "#a3e635",
            downward: "#f87171",
          },
          wick: {
            useFillColor: true,
          },
        },
      },
      tooltip: {
        enabled: true,
        theme: "dark",
        style: {
          fontSize: "13px",
          fontFamily: "Inter, sans-serif",
        },
        x: {
          format: "dd MMM yyyy HH:mm",
        },
        custom: function ({ seriesIndex, dataPointIndex, w }) {
          const data = w.config.series[seriesIndex]?.data?.[dataPointIndex];
          if (data && data.y) {
            const [open, high, low, close] = data.y;
            const date = new Date(data.x).toLocaleString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
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
                    $${open?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) || "0.00"}
                  </div>
                  
                  <div style="color: #9ca3af;">High:</div>
                  <div style="font-weight: 700; color: #a3e635; text-align: right; font-family: 'Courier New', monospace;">
                    $${high?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) || "0.00"}
                  </div>
                  
                  <div style="color: #9ca3af;">Low:</div>
                  <div style="font-weight: 700; color: #f87171; text-align: right; font-family: 'Courier New', monospace;">
                    $${low?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) || "0.00"}
                  </div>
                  
                  <div style="color: #9ca3af;">Close:</div>
                  <div style="font-weight: 700; color: ${
                    isBullish ? "#a3e635" : "#f87171"
                  }; text-align: right; font-family: 'Courier New', monospace;">
                    $${close?.toFixed(maxPrice < 1 ? 6 : maxPrice < 10 ? 4 : 2) || "0.00"}
                  </div>
                </div>
                <div style="
                  margin-top: 12px; 
                  padding-top: 12px; 
                  border-top: 1px solid #374151; 
                  font-size: 13px; 
                  font-weight: 600;
                  color: ${isBullish ? "#a3e635" : "#f87171"};
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                ">
                  <span>${isBullish ? "▲" : "▼"} ${isBullish ? "Bullish" : "Bearish"}</span>
                  <span>${changePercent > 0 ? "+" : ""}${changePercent}%</span>
                </div>
              </div>
            `;
          }
          return "";
        },
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 10,
        },
      },
      stroke: {
        width: 2,
      },
      states: {
        hover: {
          filter: {
            type: "lighten",
            value: 0.1,
          },
        },
        active: {
          filter: {
            type: "darken",
            value: 0.1,
          },
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: "10px",
                },
              },
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: "10px",
                },
              },
            },
          },
        },
      ],
    };
  };

  // Get chart options based on selected type
  const getChartOptions = (token, chain) => {
    return chartType === "line"
      ? getLineChartOptions(token, chain)
      : getCandleChartOptions(token, chain);
  };

  const getChartSeries = (token, chain) => {
    const key = `${token || 'token'}-${chain}`;
    
    if (chartType === "line") {
      const lineData = processedLineData[key] || [];
      
      return [
        {
          name: `${token || 'Token'} (${chain})`,
          type: "line",
          data: lineData.map((item) => ({
            x: parseDateString(item.x),
            y: parseFloat(item.y) || 0,
          })),
        },
      ];
    } else {
      const chartData = processedChartData[key] || [];
      
      const candleData = chartData.map((item) => ({
        x: parseDateString(item.Date),
        y: [
          parseFloat(item.Open) || 0,
          parseFloat(item.High) || 0,
          parseFloat(item.Low) || 0,
          parseFloat(item.Close) || 0,
        ],
      }));
      
      return [
        {
          name: `${token || 'Token'} (${chain})`,
          type: "candlestick",
          data: candleData,
        },
      ];
    }
  };

  // Combined comparison chart for line data only
  const getComparisonChartOptions = () => {
    const allSeriesData = chartDataItems.flatMap((chartData) => {
      const key = `${chartData.token || 'token'}-${chartData.chain}`;
      const lineData = processedLineData[key] || [];
      return lineData.map((item) => item.y).filter((val) => !isNaN(val));
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
            reset: true,
          },
        },
      },
      title: {
        text: "Price Comparison",
        align: "left",
        style: {
          fontSize: "18px",
          fontWeight: "600",
          color: "#364153",
        },
      },
      xaxis: {
        type: "datetime",
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "11px",
          },
          datetimeFormatter: {
            year: "yyyy",
            month: "MMM 'yy",
            day: "dd MMM",
            hour: "HH:mm",
          },
        },
      },
      yaxis: {
        min: Math.max(0, minPrice - padding),
        max: maxPrice + padding,
        tickAmount: 6,
        forceNiceScale: true,
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontWeight: 500,
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
          },
        },
        tooltip: { enabled: true },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        theme: "dark",
        x: {
          format: "dd MMM yyyy HH:mm",
        },
        style: {
          fontSize: "12px",
        },
      },
      grid: {
        borderColor: "#374151",
        strokeDashArray: 4,
      },
    };
  };

  const getComparisonChartSeries = () => {
    return chartDataItems.map((chartData, index) => {
      const key = `${chartData.token || 'token'}-${chartData.chain}`;
      const lineData = processedLineData[key] || [];
      const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

      return {
        name: `${chartData.token || 'Token'}${chartData.chain ? ` (${chartData.chain})` : ''}`,
        data: lineData.map((item) => ({
          x: parseDateString(item.x),
          y: item.y,
        })),
        color: colors[index % colors.length],
      };
    });
  };

  // Time range buttons - matching API structure
  const timeRangeButtons = [
    { value: "today", label: "Today" },
    { value: "7D", label: "7D" },
    { value: "30D", label: "30D" },
    { value: "all", label: "All" },
  ];

  // Chart type buttons
  const chartTypeButtons = [
    { value: "line", label: "Line Chart" },
    { value: "candlestick", label: "Candle Chart" },
  ];

  // Get current label for time range
  const getTimeRangeLabel = () => {
    const button = timeRangeButtons.find((btn) => btn.value === timeRange);
    return button ? button.label : "7D";
  };

  // Get current label for chart type
  const getChartTypeLabel = () => {
    const button = chartTypeButtons.find((btn) => btn.value === chartType);
    return button ? button.label : "Line Chart";
  };

  // Sequence controller
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

        setTimeout(() => {
          setStep(3);
        }, steps.length * 2000 + 3000);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [
    step,
    isHistory,
    descriptionData,
    currentDataItems.length,
    chartDataItems.length,
  ]);

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
                key={`${currentData.chain}-${index}`}
                className="border rounded-lg dark:bg-[#1b1c1e] border-[#b3c1d3] dark:border-gray-600 p-4"
              >
                <h4 className="font-semibold text-md mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">
                  {currentData.chain?.toUpperCase() || ''} Market Data
                  {/* {currentData.token && <span className="ml-2 text-sm font-normal text-gray-500">({currentData.token})</span>} */}
                </h4>
                <div className="space-y-2">
                  {Object.entries(currentData.data || {}).map(
                    ([key, value]) => (
                      <div key={key} className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-1 last:border-0">
                        <span className="font-medium text-sm text-gray-600 dark:text-gray-300">
                          {isHistory ? (
                            <StaticText text={`${key}:`} />
                          ) : (
                            <Typewriter text={`${key}:`} speed={30} />
                          )}
                        </span>
                        <span className={`font-semibold text-sm ${
                          key.includes('Change') && value.includes('-') 
                            ? 'text-red-500' 
                            : key.includes('Change') && !value.includes('-') && value !== 'N/A'
                            ? 'text-green-500'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
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
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Step 2-3: Chart Loading & Chart Display */}
      {chartDataItems.length > 0 && (isHistory || step >= 2) && (
        <div ref={chartRef} className="space-y-6">
          {/* Chart Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Mobile: Dropdowns */}
            <div className="block sm:hidden w-full">
              <div className="flex gap-2">
                {/* Time Range Dropdown */}
                <div className="relative flex-1">
                  <button
                    onClick={() => {
                      setShowTimeRangeDropdown(!showTimeRangeDropdown);
                      setShowChartTypeDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium bg-white dark:bg-[#1b1c1e] border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span>{getTimeRangeLabel()}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {showTimeRangeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1b1c1e] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                      {timeRangeButtons.map((button) => (
                        <button
                          key={button.value}
                          onClick={() => {
                            setTimeRange(button.value);
                            setShowTimeRangeDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            timeRange === button.value
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {button.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Chart Type Dropdown */}
                <div className="relative flex-1">
                  <button
                    onClick={() => {
                      setShowChartTypeDropdown(!showChartTypeDropdown);
                      setShowTimeRangeDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium bg-white dark:bg-[#1b1c1e] border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <span>{getChartTypeLabel()}</span>
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </button>
                  {showChartTypeDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-[#1b1c1e] border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
                      {chartTypeButtons.map((button) => (
                        <button
                          key={button.value}
                          onClick={() => {
                            setChartType(button.value);
                            setShowChartTypeDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm ${
                            chartType === button.value
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {button.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop: Button groups */}
            <div className="hidden sm:flex gap-6 w-full justify-between">
              {/* Time Range Selector */}
              <div className="inline-flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
                {timeRangeButtons.map((button) => (
                  <button
                    key={button.value}
                    onClick={() => setTimeRange(button.value)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      timeRange === button.value
                        ? "bg-gray-700 text-white"
                        : "bg-white dark:bg-[#1b1c1e] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } ${
                      button.value !== "today"
                        ? "border-l border-gray-300 dark:border-gray-600"
                        : ""
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>

              {/* Chart Type Selector */}
              <div className="inline-flex rounded-md shadow-sm border border-gray-300 dark:border-gray-600 overflow-hidden">
                {chartTypeButtons.map((button) => (
                  <button
                    key={button.value}
                    onClick={() => setChartType(button.value)}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      chartType === button.value
                        ? "bg-gray-700 text-white"
                        : "bg-white dark:bg-[#1b1c1e] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    } ${
                      button.value === "candlestick"
                        ? "border-l border-gray-300 dark:border-gray-600"
                        : ""
                    }`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isHistory || step === 3 ? (
            <>
              {/* Combined Comparison Chart (only for line charts) */}
              {chartDataItems.length > 1 && chartType === "line" && (
                <div className="bg-white dark:bg-[#1b1c1e] p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200">
                    Price Comparison Chart ({getTimeRangeLabel()})
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

              {/* Individual Charts */}
              {chartDataItems.map((chartData, index) => {
                const key = `${chartData.token || 'token'}-${chartData.chain}`;
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
                      No valid data points for {chartData.chain}
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
                          type={chartType === "line" ? "line" : "candlestick"}
                          height={400}
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
                    <Typewriter text={stepText} speed={20} delay={idx * 1000} />
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