"use client"

import { useState } from "react"
import { FileText } from "lucide-react"

interface DisclosureItem {
  id: string
  title: string
  type: string
  author: string
  publishDate: string
  status: "draft" | "published" | "archived"
}

const Disclosure = () => {
  const [disclosureItems, setDisclosureItems] = useState<DisclosureItem[]>([
    {
      id: "1",
      title: "2023년 1분기 실적 공시",
      type: "재무 공시",
      publishDate: "2023-04-15",
      author: "김재무",
      status: "published",
    },
    {
      id: "2",
      title: "신규 부동산 펀드 출시 안내",
      type: "상품 공시",
      publishDate: "2023-05-01",
      author: "이상품",
      status: "published",
    },
    {
      id: "3",
      title: "이사회 구성원 변경 안내",
      type: "지배구조 공시",
      publishDate: "2023-05-10",
      author: "박인사",
      status: "draft",
    },
    {
      id: "4",
      title: "투자 위험 고지 안내",
      type: "위험 공시",
      publishDate: "2023-05-20",
      author: "최위험",
      status: "draft",
    },
    {
      id: "5",
      title: "2022년 연간 실적 보고서",
      type: "재무 공시",
      publishDate: "2023-03-15",
      author: "김재무",
      status: "archived",
    },
  ])

  const handlePublish = (id: string) => {
    setDisclosureItems(disclosureItems.map((item) => (item.id === id ? { ...item, status: "published" } : item)))
  }

  const handleArchive = (id: string) => {
    setDisclosureItems(disclosureItems.map((item) => (item.id === id ? { ...item, status: "archived" } : item)))
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">공시 등록</h1>

      <div className="bg-gray-50 rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">유형</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">게시일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {disclosureItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <FileText size={20} className="text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.publishDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === "published"
                        ? "bg-green-100 text-green-800"
                        : item.status === "archived"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {item.status === "published" ? "게시됨" : item.status === "archived" ? "보관됨" : "초안"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <div className="flex justify-end space-x-2">
                    {item.status === "draft" && (
                      <button
                        onClick={() => handlePublish(item.id)}
                        className="px-4 py-1 bg-[#0F62FE] text-white rounded text-sm"
                      >
                        게시
                      </button>
                    )}
                    {item.status === "published" && (
                      <button
                        onClick={() => handleArchive(item.id)}
                        className="px-4 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                      >
                        보관
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Disclosure
