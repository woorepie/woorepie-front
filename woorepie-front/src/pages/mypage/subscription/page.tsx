"use client"

import { useState, useEffect } from "react"
import { customerService } from "../../../api/customer/customerService"
import type { CustomerSubscription } from "../../../types/customer/customerSubscription"

const MySubscriptionPage = () => {
  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      const data = await customerService.getCustomerSubscription()
      setSubscriptions(data)
    } catch (error) {
      console.error("청약 정보 조회 실패:", error)
      setError("청약 정보를 불러오는 데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount)

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">청약 정보</h2>

      {isLoading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-8">{error}</div>
      ) : !subscriptions.length ? (
        <div className="text-center text-gray-500 py-8">
          현재 청약 정보가 없습니다.
        </div>
      ) : (
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">매물 정보</th>
                  <th className="p-3 text-right">수량</th>
                  <th className="p-3 text-right">토큰 가격</th>
                  <th className="p-3 text-right">총 가격</th>
                  <th className="p-3 text-center">청약 결과</th>
                  <th className="p-3 text-right">신청 날짜</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.subId} className="border-b">
                    <td className="p-3">{sub.estateName}</td>
                    <td className="p-3 text-right">{sub.subTokenAmount.toLocaleString()}</td>
                    <td className="p-3 text-right">{formatCurrency(sub.subTokenPrice)}</td>
                    <td className="p-3 text-right">
                      {formatCurrency(sub.subTokenAmount * sub.subTokenPrice)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          sub.subStatus === "대기중"
                            ? "bg-yellow-100 text-yellow-800"
                            : sub.subStatus === "청약 성공"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {sub.subStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">{formatDate(sub.subDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default MySubscriptionPage
