"use client"

import { useState } from "react"
import { mockDisclosures } from "../../data/mockData"

const DisclosurePage = () => {
  const [filter, setFilter] = useState("all")

  const filteredDisclosures = filter === "all" ? mockDisclosures : mockDisclosures.filter((d) => d.category === filter)

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
            <button
              className={`px-4 py-2 rounded-md ${filter === "financial" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("financial")}
            >
              재무
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === "business" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("business")}
            >
              사업
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === "management" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("management")}
            >
              경영
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredDisclosures.map((disclosure) => (
            <div key={disclosure.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {disclosure.category}
                    </span>
                    <span className="text-sm text-gray-500">{disclosure.date}</span>
                  </div>
                  <h3 className="font-bold">{disclosure.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">{disclosure.summary}</p>
                </div>
                <button className="text-blue-600 hover:text-blue-800">자세히 보기</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DisclosurePage
