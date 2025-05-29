import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { customerService } from "../../api/customer/customerService"

const MyPage = () => {
  const location = useLocation()

  const [pendingSubscriptionCount, setPendingSubscriptionCount] = useState(0)
  const [transactionCount, setTransactionCount] = useState(0)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // 1. 대기중 청약 수
        const subs = await customerService.getCustomerSubscription()
        const pending = subs.filter((s) => s.subStatus === "대기중").length
        setPendingSubscriptionCount(pending)

        // 2. 전체 거래 수
        const trades = await customerService.getCustomerTrade()
        setTransactionCount(trades.length)
      } catch (error) {
        console.error("마이페이지 사이드 뱃지 정보 불러오기 실패:", error)
      }
    }

    fetchCounts()
  }, [])

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-blue-50 text-blue-600 font-medium" : ""
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* 사이드바 메뉴 */}
        <div className="w-full md:w-1/4">
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <Link
              to="/mypage"
              className={`block px-4 py-3 hover:bg-blue-50 border-b border-gray-200 ${isActive("/mypage")}`}
            >
              내 정보
            </Link>

            <Link
              to="/mypage/account"
              className={`block px-4 py-3 hover:bg-blue-50 border-b border-gray-200 ${isActive("/mypage/account")}`}
            >
              계좌 정보
            </Link>

            <Link
              to="/mypage/subscription"
              className={`block px-4 py-3 hover:bg-blue-50 border-b border-gray-200 ${isActive("/mypage/subscription")}`}
            >
              <div className="flex justify-between items-center">
                <span>청약 정보</span>
                {pendingSubscriptionCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {pendingSubscriptionCount > 99 ? "99+" : pendingSubscriptionCount}
                  </span>
                )}
              </div>
            </Link>

            <Link
              to="/mypage/transactions"
              className={`block px-4 py-3 hover:bg-blue-50 border-b border-gray-200 ${isActive("/mypage/transactions")}`}
            >
              <div className="flex justify-between items-center">
                <span>거래내역</span>
                {transactionCount > 0 && (
                  <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {transactionCount > 99 ? "99+" : transactionCount}
                  </span>
                )}
              </div>
            </Link>

            {/* ✅ 토큰 정보 메뉴 완전 제거됨 */}
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="w-full md:w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage
