"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

const PropertyPriceChart = ({ data }: PropertyPriceChartProps) => {
  const [focusBar, setFocusBar] = useState<string | null>(null)

  const handleMouseMove = (state: any) => {
    if (state.isTooltipActive) {
      setFocusBar(state.activeLabel)
    } else {
      setFocusBar(null)
    }
  }

  const prices = data.map(d => d.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const margin = Math.max((max - min) * 0.02, 500_000)

  return (
    <div className="w-full">
      <div className="text-sm text-gray-500 mb-4">
        ※ 본 가격 정보는 매년 1월 1일 기준 공시가격입니다.<br />
        &nbsp;&nbsp;&nbsp;공시가격은 실거래가와 일부 차이가 있을 수 있습니다.
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setFocusBar(null)}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={{ stroke: "#E5E7EB" }}
          />
          <YAxis
            domain={[min - margin, max + margin]}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={{ stroke: "#E5E7EB" }}
            tickFormatter={(value) => `${(value / 1_0000_0000).toFixed(1)}억`}
          />
          <Tooltip content={<CustomTooltip />} />
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
