"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Notice } from "../../types/notice/notice"
import { getNotices } from "../../api/notice"

const DisclosurePage = () => {
  const [filter, setFilter] = useState("all")
  const [disclosures, setDisclosures] = useState<Notice[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getNotices()
        console.log("✅ 공시 리스트 응답:", result)
        setDisclosures(result)
      } catch (e) {
        console.error("❌ 공시 데이터를 불러오는 데 실패했습니다.", e)
      }
    }

    fetchData()
  }, [])

  // 유니크한 estate 이름들 추출
  const uniqueEstateNames = Array.from(new Set(disclosures.map(d => d.estateName)))

  const filteredDisclosures =
    filter === "all" ? disclosures : disclosures.filter((d) => d.estateName === filter)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">공시 보기</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <div className="relative">
            <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button
                className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                  filter === "all" 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("all")}
              >
                전체 ({disclosures.length})
              </button>
              {uniqueEstateNames.map((estateName) => {
                const count = disclosures.filter(d => d.estateName === estateName).length
                return (
                  <button
                    key={estateName}
                    className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                      filter === estateName 
                        ? "bg-blue-600 text-white shadow-md" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setFilter(estateName)}
                  >
                    {estateName} ({count})
                  </button>
                )
              })}
            </div>
            
            {/* 스크롤 표시 그라데이션 */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600">
            {filter === "all" 
              ? `전체 ${filteredDisclosures.length}건의 공시`
              : `"${filter}" ${filteredDisclosures.length}건의 공시`
            }
          </div>
        </div>

        <div className="space-y-4">
          {filteredDisclosures.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg mb-2">공시가 없습니다</p>
              <p className="text-sm">
                {filter === "all" 
                  ? "아직 등록된 공시가 없습니다."
                  : `"${filter}" 매물에 대한 공시가 없습니다.`
                }
              </p>
            </div>
          ) : (
            filteredDisclosures.map((disclosure) => (
              <div key={disclosure.noticeId} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        {disclosure.estateName}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(disclosure.noticeDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900">{disclosure.noticeTitle}</h3>
                  </div>
                  <button
                    className="ml-4 px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors font-medium"
                    onClick={() => navigate(`/disclosure/${disclosure.noticeId}`)}
                  >
                    자세히 보기
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default DisclosurePage
