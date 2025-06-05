// ✅ filter/page.tsx (dividendRange: string 타입으로 정리)
// ✅ filter/page.tsx (dividendRange: string 타입으로 정리)
"use client"

import { Dispatch, SetStateAction } from "react"

interface FilterProps {
  filters: {
    city: string
    neighborhood: string
    dividendRange: string
    showWooriOnly: boolean
  }
  setFilters: Dispatch<SetStateAction<{
    city: string
    neighborhood: string
    dividendRange: string
    showWooriOnly: boolean
  }>>
  onApply: () => void
}

const PropertyFilter = ({ filters, setFilters, onApply }: FilterProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          className="text-blue-600 text-sm"
          onClick={() => setFilters({
            city: "",
            neighborhood: "",
            dividendRange: "all",
            showWooriOnly: false,
          })}
        >
          Clear all
        </button>
      </div>

      {/* 시 선택 */}
      <div className="mb-6">
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
        <button className="text-sm text-blue-600 mt-1" onClick={() => setFilters({ ...filters, city: "" })}>Clear</button>
      </div>

      {/* 세부 행정동 */}
      <div className="mb-6">
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
        <button className="text-sm text-blue-600 mt-1" onClick={() => setFilters({ ...filters, neighborhood: "" })}>Clear</button>
      </div>

      {/* 우리에프앤아이 매물 */}
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.showWooriOnly}
            onChange={(e) => setFilters({ ...filters, showWooriOnly: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium">우리에프앤아이 매물 보기</span>
        </label>
      </div>

      {/* 배당률 구간 */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">배당률</label>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="dividendRange"
              value="all"
              checked={filters.dividendRange === "all"}
              onChange={(e) => setFilters({ ...filters, dividendRange: e.target.value })}
            />
            <span>전체</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="dividendRange"
              value="lt0.03"
              checked={filters.dividendRange === "lt0.03"}
              onChange={(e) => setFilters({ ...filters, dividendRange: e.target.value })}
            />
            <span>3% 미만</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="dividendRange"
              value="0.03to0.05"
              checked={filters.dividendRange === "0.03to0.05"}
              onChange={(e) => setFilters({ ...filters, dividendRange: e.target.value })}
            />
            <span>3%~5%</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="dividendRange"
              value="gt0.05"
              checked={filters.dividendRange === "gt0.05"}
              onChange={(e) => setFilters({ ...filters, dividendRange: e.target.value })}
            />
            <span>5% 초과</span>
          </label>
        </div>
      </div>

      {/* Apply 버튼 */}
      <button
        onClick={onApply}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Apply
      </button>
    </div>
  )
}

export default PropertyFilter
