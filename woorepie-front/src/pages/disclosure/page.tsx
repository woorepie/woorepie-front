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

  const filteredDisclosures =
    filter === "all" ? disclosures : disclosures.filter((d) => d.estateName === filter)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">공시 보기</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("all")}
            >
              전체
            </button>
            {/* estateName 필터가 필요하다면 여기에 버튼 추가 */}
          </div>
        </div>

        <div className="space-y-4">
          {filteredDisclosures.map((disclosure) => (
            <div key={disclosure.noticeId} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {disclosure.estateName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(disclosure.noticeDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold">{disclosure.noticeTitle}</h3>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800"
                  onClick={() => navigate(`/disclosure/${disclosure.noticeId}`)}
                >
                  자세히 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DisclosurePage
