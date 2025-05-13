"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"

// 공시지가 데이터 타입 정의
export interface PriceData {
  month: string
  publicPrice: number
  averagePrice?: number
}

interface PropertyPriceChartProps {
  data: PriceData[]
  title?: string
}

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-700">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {entry.name === "publicPrice" ? "해당 매물 공시지가: " : "지역 평균 공시지가: "}
            {entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }

  return null
}

const PropertyPriceChart = ({ data, title = "공시지가" }: PropertyPriceChartProps) => {
  const [focusBar, setFocusBar] = useState<string | null>(null)

  const handleMouseMove = (state: any) => {
    if (state.isTooltipActive) {
      setFocusBar(state.activeLabel)
    } else {
      setFocusBar(null)
    }
  }

  return (
    <div className="w-full">
      <div className="font-medium text-gray-800 mb-2">{title}</div>
      <div className="flex items-center text-xs text-gray-600 mb-4">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-[#8884d8] rounded-full mr-1"></div>
          <span>해당 매물 공시지가</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#82ca9d] rounded-full mr-1"></div>
          <span>지역 평균 공시지가</span>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setFocusBar(null)}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={{ stroke: "#E5E7EB" }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: "#E5E7EB" }}
              tickLine={{ stroke: "#E5E7EB" }}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend display={false} />
            <Line
              type="monotone"
              dataKey="publicPrice"
              name="해당 매물 공시지가"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="averagePrice"
              name="지역 평균 공시지가"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6, stroke: "#82ca9d", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default PropertyPriceChart
