"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

const PropertyFilterPage = () => {
  const [filters, setFilters] = useState({
    city: "",
    neighborhood: "",
    yieldMin: 0,
    yieldMax: 100,
    dividendMin: 0,
    dividendMax: 100,
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">매물 필터</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City Filter */}
          <div>
            <label className="block mb-2 font-medium">시</label>
            <select
              className="w-full p-2 border rounded-md"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <option value="">Select</option>
              <option value="서울">서울</option>
              <option value="부산">부산</option>
              <option value="인천">인천</option>
              <option value="대구">대구</option>
            </select>
            <button className="text-sm text-blue-600 mt-1" onClick={() => setFilters({ ...filters, city: "" })}>
              Clear
            </button>
          </div>

          {/* Neighborhood Filter */}
          <div>
            <label className="block mb-2 font-medium">세부 행정동</label>
            <select
              className="w-full p-2 border rounded-md"
              value={filters.neighborhood}
              onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
            >
              <option value="">Select</option>
              <option value="강남구">강남구</option>
              <option value="서초구">서초구</option>
              <option value="마포구">마포구</option>
              <option value="송파구">송파구</option>
            </select>
            <button className="text-sm text-blue-600 mt-1" onClick={() => setFilters({ ...filters, neighborhood: "" })}>
              Clear
            </button>
          </div>
        </div>

        {/* Keywords */}
        <div className="mt-6">
          <label className="block mb-2 font-medium">추천 키워드</label>
          <div className="flex flex-wrap gap-2">
            {[
              "부산 배당율 4.2%",
              "서울 배당율 4.2%",
              "성수동 아크로포레스트",
              "핫한 지역",
              "거래량 상위",
              "아직 뜨지 않은 지역",
              "우리파이 추천 매물",
              "정직한 임차인",
            ].map((keyword, index) => (
              <button key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {keyword}
              </button>
            ))}
          </div>
        </div>

        {/* Yield Range */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <label className="font-medium">수익률</label>
            <button
              className="text-sm text-blue-600"
              onClick={() => setFilters({ ...filters, yieldMin: 0, yieldMax: 100 })}
            >
              Clear
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.yieldMax}
            onChange={(e) => setFilters({ ...filters, yieldMax: Number.parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.yieldMin}</span>
            <span>{filters.yieldMax}</span>
          </div>
        </div>

        {/* Dividend Range */}
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <label className="font-medium">배당률</label>
            <button
              className="text-sm text-blue-600"
              onClick={() => setFilters({ ...filters, dividendMin: 0, dividendMax: 100 })}
            >
              Clear
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.dividendMax}
            onChange={(e) => setFilters({ ...filters, dividendMax: Number.parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{filters.dividendMin}</span>
            <span>{filters.dividendMax}</span>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            onClick={() => {
              setFilters({
                city: "",
                neighborhood: "",
                yieldMin: 0,
                yieldMax: 100,
                dividendMin: 0,
                dividendMax: 100,
              })
            }}
          >
            Clear all
          </button>
          <Link to="/properties" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Apply
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PropertyFilterPage
