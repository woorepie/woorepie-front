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

// 가격 데이터 타입 정의
export interface PriceData {
  month: string;
  price: number;
}

interface PropertyPriceChartProps {
  data: PriceData[];
  title?: string;
}

// 커스텀 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-700">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`가격: ${entry.value?.toLocaleString()}원`}
          </p>
        ))}
      </div>
    )
  }

  return null
}

const PropertyPriceChart = ({ data, title = "가격 변동" }: PropertyPriceChartProps) => {
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
        <div className="flex items-center">
          <div className="w-3 h-3 bg-[#8884d8] rounded-full mr-1"></div>
          <span>매물 가격</span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
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
            dataKey="price"
            name="매물 가격"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PropertyPriceChart
