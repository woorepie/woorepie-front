"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { subscriptionService } from "../../api/subscription"
import type { SubscriptionList } from "../../types/subscription/subscription"

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
  businessName: string
  subscriptionPeriod: string
  isActive: boolean
}


const SubscriptionListPage = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "active" | "closed" | "upcoming">("all")
  const [showWooriOnly, setShowWooriOnly] = useState(false)

  useEffect(() => {
    subscriptionService.getActiveSubscriptions()
      .then((data: SubscriptionList[]) => {
        // 마감일 기준 내림차순 정렬
        const sorted = [...data].sort((a, b) => {
          const dateA = a.subEndDate ? new Date(a.subEndDate).getTime() : 0;
          const dateB = b.subEndDate ? new Date(b.subEndDate).getTime() : 0;
          return dateB - dateA;
        });
        console.log("/subscription/list API 응답:", sorted);
        // API 데이터 → UI 데이터 변환
        const mapped = sorted.map(item => ({
          id: String(item.estateId),
          propertyId: String(item.estateId),
          propertyName: item.estateName,
          propertyImage: item.estateImageUrl,
          location: `${item.estateState} • ${item.estateCity}`,
          price: item.estatePrice.toLocaleString() + "원",
          tokenAmount: `DABS ${item.tokenAmount.toLocaleString()}개 발행`,
          expectedYield: item.dividendYield ? `${(item.dividendYield * 100).toFixed(2)}%` : "-",
          company: item.agentName,
          businessName: item.businessName,
          subscriptionPeriod: item.subStartDate 
            ? `${new Date(item.subStartDate).toLocaleDateString()} ~ ${new Date(item.subEndDate).toLocaleDateString()}`
            : "청약 예정",
          isActive: item.subState === "READY" || item.subState === "RUNNING", // Ready, Running만 청약중
        }))
        setSubscriptions(mapped)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // 필터링된 청약 목록
  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (filter === "all") return true
    if (filter === "active") return sub.isActive
    if (filter === "closed") return !sub.isActive
    if (filter === "upcoming") return !sub.subscriptionPeriod || sub.subscriptionPeriod === "청약 예정"
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
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-md ${
              filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
            }`}
          >
            청약예정
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
          <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-md cursor-pointer">
            <input
              type="checkbox"
              checked={showWooriOnly}
              onChange={(e) => setShowWooriOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-800">우리에프앤아이 매물 보기</span>
          </label>
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
                  <div className="md:w-1/2 h-64 md:h-80 bg-gray-200 relative">
                    <img
                      src={subscription.propertyImage || "/placeholder.svg"}
                      alt={subscription.propertyName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 오른쪽: 정보 */}
                  <div className="md:w-1/2 p-8 relative">
                    {/* 청약중 배지 */}
                    {subscription.isActive && (
                      <div className="absolute top-6 right-6 -translate-y-1/2 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        입
                      </div>
                    )}
                    {!subscription.subStartDate && (
                      <div className="absolute top-6 right-6 -translate-y-1/2 w-10 h-10 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold">
                        예
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
                        <span className="text-xs text-gray-600">{subscription.businessName}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{subscription.company}</div>
                        <div className="text-xs text-gray-500">
                          {subscription.subscriptionPeriod}
                        </div>
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
