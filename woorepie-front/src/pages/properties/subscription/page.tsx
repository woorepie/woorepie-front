"use client"

import { useState } from "react"
import { Link } from "react-router-dom"

// 청약 데이터 타입 정의
interface SubscriptionProperty {
  id: string
  location: string
  name: string
  price: string
  dabsAmount: string
  expectedYield: string
  startDate: string
  endDate: string
  publisher: {
    name: string
    image: string
  }
}

// 샘플 데이터
const sampleSubscriptions: SubscriptionProperty[] = [
  {
    id: "1",
    location: "서울 · 다산동",
    name: "교보타워",
    price: "50억",
    dabsAmount: "DABS 300억 청약",
    expectedYield: "기대 수익률 4.5%",
    startDate: "2025/03/01",
    endDate: "2025/03/31",
    publisher: {
      name: "대한부동산투자회사",
      image: "/abstract-profile.png",
    },
  },
  {
    id: "2",
    location: "서울 · 상암동",
    name: "코엑스",
    price: "30억",
    dabsAmount: "DABS 300억 청약",
    expectedYield: "기대 수익률 4.5%",
    startDate: "2025/04/01",
    endDate: "2025/04/30",
    publisher: {
      name: "대한부동산투자회사",
      image: "/abstract-profile.png",
    },
  },
  {
    id: "3",
    location: "부산 · 해운대",
    name: "마린시티",
    price: "40억",
    dabsAmount: "DABS 250억 청약",
    expectedYield: "기대 수익률 5.2%",
    startDate: "2025/03/15",
    endDate: "2025/04/15",
    publisher: {
      name: "해운대부동산투자회사",
      image: "/abstract-profile.png",
    },
  },
]

const SubscriptionPage = () => {
  const [activeTab, setActiveTab] = useState("ongoing")

  // 진행 중인 청약과 마감된 청약을 필터링 (실제로는 API에서 가져올 것)
  const ongoingSubscriptions = sampleSubscriptions.slice(0, 2)
  const closedSubscriptions = sampleSubscriptions.slice(2)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">청약</h1>

      <div className="mb-8">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 ${
              activeTab === "ongoing" ? "font-bold text-blue-600 border-b-2 border-blue-600" : ""
            }`}
            onClick={() => setActiveTab("ongoing")}
          >
            진행 중인 청약
          </button>
          <button
            className={`px-4 py-2 ${
              activeTab === "closed" ? "font-bold text-blue-600 border-b-2 border-blue-600" : ""
            }`}
            onClick={() => setActiveTab("closed")}
          >
            마감된 청약
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {(activeTab === "ongoing" ? ongoingSubscriptions : closedSubscriptions).map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto flex items-center justify-center">
                <img
                  src={`/placeholder.svg?key=sg4l8&height=300&width=400&query=building ${property.name}`}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-1">{property.location}</div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-bold">
                      {property.name} | {property.price}
                    </h2>
                    <div className="bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold">
                      C
                    </div>
                  </div>
                </div>

                <div className="space-y-1 mb-6">
                  <div className="text-sm">{property.dabsAmount}</div>
                  <div className="text-sm">{property.expectedYield}</div>
                </div>

                <div className="flex items-center mt-4">
                  <img
                    src={property.publisher.image || "/placeholder.svg"}
                    alt={property.publisher.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <div className="text-xs text-gray-500">{property.publisher.name}</div>
                    <div className="text-xs text-gray-500">
                      {property.startDate} ~ {property.endDate}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/properties/${property.id}`}
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  청약하기
                </Link>
              </div>
            </div>
          </div>
        ))}

        {(activeTab === "ongoing" && ongoingSubscriptions.length === 0) ||
        (activeTab === "closed" && closedSubscriptions.length === 0) ? (
          <div className="text-center py-8 text-gray-500">
            {activeTab === "ongoing" ? "진행 중인 청약이 없습니다." : "마감된 청약이 없습니다."}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default SubscriptionPage
