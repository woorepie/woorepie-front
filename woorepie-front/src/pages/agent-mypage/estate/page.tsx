"use client"

import { useEffect, useState } from "react"
import { agentService } from "../../../api/agent"
import type { GetAgentEstateListResponse } from "../../../types/agent/agent"

const MyAccountPage = () => {
  const [estates, setEstates] = useState<GetAgentEstateListResponse[]>([])
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await agentService.getAgentEstateList()
        setEstates(data)
      } catch (error) {
        console.error("대행인 매물 조회 실패:", error)
      }
    }

    fetchData()
  }, [])

  const filteredEstates = estates.filter(e =>
    e.estateName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">내 매물</h2>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">매물 정보</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 border rounded-md"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">매물명</th>
                <th className="p-3 text-right">총 발행 수량</th>
                <th className="p-3 text-right">토큰 가격</th>
                <th className="p-3 text-right">최근 배당률</th>
                <th className="p-3 text-right">상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredEstates.map((estate) => (
                <tr key={estate.estateId} className="border-b">
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      {estate.estateName}
                    </div>
                  </td>
                  <td className="p-3 text-right">{estate.tokenAmount.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    {estate.estateTokenPrice !== null
                      ? `${estate.estateTokenPrice.toLocaleString()} 원`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-right">{estate.dividendYield ?? "0.00"}%</td>
                  <td className="p-3 text-right">{estate.estateStatus}</td>
                </tr>
              ))}
              {filteredEstates.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    등록된 매물이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MyAccountPage
