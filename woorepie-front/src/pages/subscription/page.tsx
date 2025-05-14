"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

// 청약 리스트 아이템 타입
interface SubscriptionListItem {
  id: string
  propertyId: string
  propertyName: string
  propertyImage?: string
  location: string
  price: string
  tokenAmount: string
  expectedYield: string
  company: string
  subscriptionPeriod: string
  isActive: boolean
}

// 샘플 청약 리스트 데이터
const sampleSubscriptionList: SubscriptionListItem[] = [
  {
    id: "1",
    propertyId: "1",
    propertyName: "교보타워",
    propertyImage: "/modern-glass-office.png",
    location: "서울 • 강남구",
    price: "50억",
    tokenAmount: "DABS 50만개 발행",
    expectedYield: "6.5%",
    company: "(주)우주부동산",
    subscriptionPeriod: "23.04.30~24.01",
    isActive: true,
  },
  {
    id: "2",
    propertyId: "2",
    propertyName: "코엑스",
    propertyImage: "/modern-commercial-building.png",
    location: "서울 • 삼성동",
    price: "30억",
    tokenAmount: "DABS 30만개 발행",
    expectedYield: "5.8%",
    company: "(주)우주부동산",
    subscriptionPeriod: "23.01.02~23.07",
    isActive: false,
  },
  {
    id: "3",
    propertyId: "3",
    propertyName: "판교 테크원타워",
    propertyImage: "/modern-office-building.png",
    location: "경기 • 성남시",
    price: "45억",
    tokenAmount: "DABS 45만개 발행",
    expectedYield: "7.2%",
    company: "(주)우주부동산",
    subscriptionPeriod: "23.06.15~23.12",
    isActive: true,
  },
  {
    id: "4",
    propertyId: "4",
    propertyName: "해운대 마린시티",
    propertyImage: "/luxury-apartment-building.png",
    location: "부산 • 해운대구",
    price: "25억",
    tokenAmount: "DABS 25만개 발행",
    expectedYield: "6.0%",
    company: "(주)우주부동산",
    subscriptionPeriod: "23.03.10~23.09",
    isActive: false,
  },
]

const SubscriptionListPage = () => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all")

  useEffect(() => {
    // 실제 구현에서는 API에서 청약 데이터를 가져올 것
    setTimeout(() => {
      setSubscriptions(sampleSubscriptionList)
      setLoading(false)
    }, 500)
  }, [])

  // 필터링된 청약 목록
  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === "all") return true
    if (filter === "active") return sub.isActive
    if (filter === "closed") return !sub.isActive
    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">청약 목록</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 rounded-md ${
              filter === "active" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            청약중
          </button>
          <button
            onClick={() => setFilter("closed")}
            className={`px-4 py-2 rounded-md ${
              filter === "closed" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            청약마감
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-100 rounded-lg h-48 animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map((subscription) => (
              <Link key={subscription.id} to={`/subscription/${subscription.id}`} className="block">
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 flex flex-col md:flex-row">
                  {/* 왼쪽: 이미지 */}
                  <div className="md:w-1/2 h-48 md:h-auto bg-gray-200 relative">
                    <img
                      src={subscription.propertyImage || "/placeholder.svg"}
                      alt={subscription.propertyName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 오른쪽: 정보 */}
                  <div className="md:w-1/2 p-6 relative">
                    {/* 청약중 배지 */}
                    {subscription.isActive && (
                      <div className="absolute top-0 right-6 -translate-y-1/2 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        입
                      </div>
                    )}

                    <div className="text-sm text-gray-600 mb-1">{subscription.location}</div>
                    <h3 className="font-bold text-xl mb-2">
                      {subscription.propertyName} | {subscription.price}
                    </h3>

                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex items-center">
                        <span className="text-gray-600">• {subscription.tokenAmount}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-600">• 기대 수익률 {subscription.expectedYield}</span>
                      </div>
                    </div>

                    <div className="flex items-center mt-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                        <span className="text-xs text-gray-600">회사</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{subscription.company}</div>
                        <div className="text-xs text-gray-500">{subscription.subscriptionPeriod}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">조건에 맞는 청약 정보가 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SubscriptionListPage
