import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the chart
const mockData = {
  prices: [
    { date: "09:00", open: 58200, high: 58400, low: 58000, close: 58300, volume: 120 },
    { date: "10:00", open: 58300, high: 58500, low: 58200, close: 58400, volume: 80 },
    { date: "11:00", open: 58400, high: 58700, low: 58300, close: 58600, volume: 150 },
    { date: "12:00", open: 58600, high: 58800, low: 58500, close: 58700, volume: 90 },
    { date: "13:00", open: 58700, high: 58700, low: 58400, close: 58500, volume: 70 },
    { date: "14:00", open: 58500, high: 58600, low: 58300, close: 58400, volume: 60 },
    { date: "15:00", open: 58400, high: 58500, low: 58300, close: 58350, volume: 50 },
    { date: "16:00", open: 58350, high: 58400, low: 58200, close: 58250, volume: 40 },
    { date: "17:00", open: 58250, high: 58300, low: 58100, close: 58150, volume: 30 },
    { date: "18:00", open: 58150, high: 58200, low: 58000, close: 58050, volume: 45 },
    { date: "19:00", open: 58050, high: 58100, low: 57900, close: 57950, volume: 55 },
    { date: "20:00", open: 57950, high: 58000, low: 57800, close: 57850, volume: 65 },
    { date: "21:00", open: 57850, high: 57900, low: 57700, close: 57750, volume: 75 },
    { date: "22:00", open: 57750, high: 57800, low: 57600, close: 57650, volume: 85 },
    { date: "23:00", open: 57650, high: 57700, low: 57500, close: 57600, volume: 95 },
    { date: "00:00", open: 57600, high: 57700, low: 57500, close: 57650, volume: 105 },
    { date: "01:00", open: 57650, high: 57800, low: 57600, close: 57750, volume: 115 },
    { date: "02:00", open: 57750, high: 57900, low: 57700, close: 57850, volume: 125 },
    { date: "03:00", open: 57850, high: 58000, low: 57800, close: 57950, volume: 135 },
    { date: "04:00", open: 57950, high: 58100, low: 57900, close: 58050, volume: 145 },
    { date: "05:00", open: 58050, high: 58200, low: 58000, close: 58150, volume: 155 },
    { date: "06:00", open: 58150, high: 58300, low: 58100, close: 58250, volume: 165 },
    { date: "07:00", open: 58250, high: 58400, low: 58200, close: 58350, volume: 175 },
    { date: "08:00", open: 58350, high: 58500, low: 58300, close: 58450, volume: 185 },
    { date: "09:00", open: 58450, high: 58600, low: 58400, close: 58550, volume: 195 },
    { date: "10:00", open: 58550, high: 58700, low: 58500, close: 58650, volume: 205 },
    { date: "11:00", open: 58650, high: 58800, low: 58600, close: 58750, volume: 215 },
    { date: "12:00", open: 58750, high: 58900, low: 58700, close: 58850, volume: 225 },
    { date: "13:00", open: 58850, high: 59000, low: 58800, close: 58950, volume: 235 },
    { date: "14:00", open: 58950, high: 59100, low: 58900, close: 59050, volume: 245 },
  ],
  maValues: {
    ma10: 58533.15,
    ma30: 58848.54,
    ma60: 58364.33,
  },
  highLow: {
    high: 59100.0,
    low: 57500.0,
  },
  percentChange: 1.76,
}

export default function FinancialChart() {
  const [selectedPeriod, setSelectedPeriod] = useState("7Days")

  return (
    <Card className="w-[90%] mr-auto overflow-hidden relative">
      <CardContent className="p-0">
        <div className="p-2 text-xs border-b flex flex-wrap gap-2">
          <span>MA 10 close 0 SMA 0</span>
          <span className="font-medium">{mockData.maValues.ma10.toFixed(2)}</span>
          <span>MA 30 close 0 SMA 0</span>
          <span className="font-medium">{mockData.maValues.ma30.toFixed(2)}</span>
          <span>MA 60 close 0 SMA 0</span>
          <span className="font-medium">{mockData.maValues.ma60.toFixed(2)}</span>
        </div>

        <div className="relative h-[100px] md:h-[200px]">
          {/* Price indicators */}
          <div className="absolute right-2 top-2 text-xs">
            <Badge variant="outline" className="bg-zinc-800 text-white mb-1 block">
              High
            </Badge>
            <span className="block text-right">{mockData.highLow.high.toFixed(2)}</span>
          </div>

          <div className="absolute right-2 bottom-20 text-xs">
            <Badge variant="outline" className="bg-zinc-800 text-white mb-1 block">
              Low
            </Badge>
            <span className="block text-right">{mockData.highLow.low.toFixed(2)}</span>
          </div>

          {/* Candlestick Chart */}
          <div className="w-full h-full">
            <CandlestickChart data={mockData.prices} />
          </div>
        </div>

        {/* Volume Chart */}
        <div className="h-[80px] border-t">
          <VolumeChart data={mockData.prices} />
        </div>

        {/* Time period selector */}
        <div className="border-t p-2">
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
            <TabsList className="grid grid-cols-4 h-8">
              <TabsTrigger value="7Days" className="text-xs h-7">
                7 Days
              </TabsTrigger>
              <TabsTrigger value="30Days" className="text-xs h-7">
                30 Days
              </TabsTrigger>
              <TabsTrigger value="90Days" className="text-xs h-7">
                90 Days
              </TabsTrigger>
              <TabsTrigger value="YTD" className="text-xs h-7">
                YTD
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>


        {/* Close button */}
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6">
          <X className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

// Candlestick Chart Component
function CandlestickChart({ data }) {
  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%" className="candlestick-chart">
        <g>
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`grid-${i}`}
              x1="0%"
              y1={`${i * 20}%`}
              x2="100%"
              y2={`${i * 20}%`}
              stroke="#e5e5e5"
              strokeWidth="1"
            />
          ))}

          {/* Candlesticks */}
          {data.map((item, index) => {
            const x = (index / data.length) * 100
            const width = 0.8 * (100 / data.length)

            // Calculate normalized positions
            const range = 59100 - 57500
            const normalizePrice = (price) => 100 - ((price - 57500) / range) * 100

            const openY = normalizePrice(item.open)
            const closeY = normalizePrice(item.close)
            const highY = normalizePrice(item.high)
            const lowY = normalizePrice(item.low)

            const isUp = item.close >= item.open
            const bodyHeight = Math.abs(closeY - openY)
            const bodyY = isUp ? closeY : openY

            return (
              <g key={`candle-${index}`}>
                {/* Wick */}
                <line
                  x1={`${x + width / 2}%`}
                  y1={`${highY}%`}
                  x2={`${x + width / 2}%`}
                  y2={`${lowY}%`}
                  stroke={isUp ? "black" : "#888888"}
                  strokeWidth="1"
                />

                {/* Body */}
                <rect
                  x={`${x}%`}
                  y={`${bodyY}%`}
                  width={`${width}%`}
                  height={`${bodyHeight || 0.5}%`}
                  fill={isUp ? "black" : "#d1d1d1"}
                  stroke={isUp ? "black" : "#888888"}
                />
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}

// Volume Chart Component
function VolumeChart({ data } ) {
  const maxVolume = Math.max(...data.map((item) => item.volume))

  return (
    <div className="w-full h-full relative">
      <svg width="100%" height="100%">
        <g>
          {data.map((item, index) => {
            const x = (index / data.length) * 100
            const width = 0.8 * (100 / data.length)
            const height = (item.volume / maxVolume) * 100
            const y = 100 - height

            const isUp = item.close >= item.open

            return (
              <rect
                key={`volume-${index}`}
                x={`${x}%`}
                y={`${y}%`}
                width={`${width}%`}
                height={`${height}%`}
                fill={isUp ? "black" : "#d1d1d1"}
              />
            )
          })}
        </g>
      </svg>
    </div>
  )
}

