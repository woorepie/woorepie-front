"use client"

import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { mockProperties } from "../../../data/mockData"

// 청약 상태 타입
type SubscriptionStatus = "pending" | "completed" | "canceled" | "failed"

// 청약 정보 타입
interface SubscriptionDetail {
  id: string
  propertyId: string
  propertyName: string
  propertyImage?: string
  subscriptionNumber: string
  status: SubscriptionStatus
  quantity: number
  price: number
  totalAmount: number
  paymentMethod: "bank" | "card" | "crypto"
  paymentStatus: "pending" | "completed" | "failed"
  subscriptionDate: string
  completionDate?: string
  userName: string
  userEmail: string
  userPhone: string
  userAddress: string
}

// 샘플 청약 데이터
const sampleSubscriptions: SubscriptionDetail[] = [
  {
    id: "1",
    propertyId: "property1",
    propertyName: "강남 역삼동 오피스빌딩",
    propertyImage: "/modern-glass-office.png",
    subscriptionNumber: "SUB20250514001",
    status: "completed",
    quantity: 5,
    price: 10000,
    totalAmount: 50000,
    paymentMethod: "bank",
    paymentStatus: "completed",
    subscriptionDate: "2025-05-14",
    completionDate: "2025-05-15",
    userName: "홍길동",
    userEmail: "hong@example.com",
    userPhone: "010-1234-5678",
    userAddress: "서울시 강남구 역삼동 123-456",
  },
  {
    id: "2",
    propertyId: "property2",
    propertyName: "부산 해운대 상가건물",
    propertyImage: "/modern-commercial-building.png",
    subscriptionNumber: "SUB20250510002",
    status: "pending",
    quantity: 10,
    price: 8000,
    totalAmount: 80000,
    paymentMethod: "card",
    paymentStatus: "pending",
    subscriptionDate: "2025-05-10",
    userName: "김철수",
    userEmail: "kim@example.com",
    userPhone: "010-9876-5432",
    userAddress: "부산시 해운대구 우동 789-101",
  },
]

const SubscriptionEndPage = () => {
  const { id } = useParams<{ id: string }>()
  const [subscription, setSubscription] = useState<SubscriptionDetail | null>(null)
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 실제 구현에서는 API에서 청약 데이터를 가져올 것
    const foundSubscription = sampleSubscriptions.find((sub) => sub.id === id)
    setSubscription(foundSubscription || null)

    if (foundSubscription) {
      // 관련 매물 정보 가져오기
      const foundProperty = mockProperties.find((p) => p.id === foundSubscription.propertyId)
      setProperty(foundProperty || null)
    }

    setLoading(false)
  }, [id])

  // 청약 상태에 따른 배지 색상 및 텍스트
  const getStatusBadge = (status: SubscriptionStatus) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-sm">대기중</span>
      case "completed":
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">완료</span>
      case "canceled":
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-sm">취소됨</span>
      case "failed":
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-md text-sm">실패</span>
      default:
        return null
    }
  }

  // 결제 방법 텍스트
  const getPaymentMethodText = (method: "bank" | "card" | "crypto") => {
    switch (method) {
      case "bank":
        return "계좌이체"
      case "card":
        return "신용카드"
      case "crypto":
        return "암호화폐"
      default:
        return ""
    }
  }

  // 청약 취소 처리
  const handleCancelSubscription = () => {
    if (window.confirm("청약을 취소하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 실제 구현에서는 API를 통해 청약 취소 처리
      alert("청약이 취소되었습니다.")
      // 상태 업데이트
      setSubscription((prev) => (prev ? { ...prev, status: "canceled" } : null))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">청약 정보를 찾을 수 없습니다</h1>
        <Link to="/mypage" className="text-blue-600 hover:underline">
          마이페이지로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/mypage" className="text-blue-600 hover:underline flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          마이페이지로 돌아가기
        </Link>
      </div>

      {/* 상단 청약 정보 및 상태 섹션 */}
      <div className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 왼쪽: 청약 기본 정보 (3/12) */}
          <div className="lg:col-span-3">
            <h1 className="text-2xl font-bold mb-4">청약 상세</h1>
            <div className="text-xl font-bold mb-2">{subscription.propertyName}</div>
            <div className="mb-6 flex items-center">
              {getStatusBadge(subscription.status)}
              <span className="ml-2 text-gray-600">
                {subscription.status === "completed"
                  ? "청약 완료"
                  : subscription.status === "pending"
                    ? "청약 진행중"
                    : ""}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex">
                <span className="w-24 text-gray-600">청약 번호:</span>
                <span className="font-medium">{subscription.subscriptionNumber}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-600">청약 일자:</span>
                <span className="font-medium">{subscription.subscriptionDate}</span>
              </div>
              {subscription.completionDate && (
                <div className="flex">
                  <span className="w-24 text-gray-600">완료 일자:</span>
                  <span className="font-medium">{subscription.completionDate}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <div className="bg-gray-100 px-4 py-2 rounded-md w-full">
                <span className="text-gray-600 mr-2">청약 수량:</span>
                <span className="font-bold">{subscription.quantity} DABS</span>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-md w-full">
                <span className="text-gray-600 mr-2">토큰 가격:</span>
                <span className="font-bold">{subscription.price.toLocaleString()}원</span>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-md w-full">
                <span className="text-gray-600 mr-2">총 금액:</span>
                <span className="font-bold">{subscription.totalAmount.toLocaleString()}원</span>
              </div>
            </div>

            {subscription.status === "pending" && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCancelSubscription}
                  className="border border-red-600 text-red-600 px-6 py-2 rounded-md hover:bg-red-50 w-full"
                >
                  청약 취소하기
                </button>
              </div>
            )}
          </div>

          {/* 중앙: 매물 이미지 (6/12) */}
          <div className="lg:col-span-6 bg-gray-200 h-96 rounded-lg overflow-hidden flex items-center justify-center">
            {subscription.propertyImage ? (
              <img
                src={subscription.propertyImage || "/placeholder.svg"}
                alt={subscription.propertyName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p>이미지를 불러올 수 없습니다</p>
              </div>
            )}
          </div>

          {/* 오른쪽: 결제 정보 패널 (3/12) */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-lg font-bold mb-4">결제 정보</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">결제 방법</div>
                  <div className="font-medium">{getPaymentMethodText(subscription.paymentMethod)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">결제 상태</div>
                  <div className="font-medium">
                    {subscription.paymentStatus === "completed" ? (
                      <span className="text-green-600">결제 완료</span>
                    ) : subscription.paymentStatus === "pending" ? (
                      <span className="text-yellow-600">결제 대기중</span>
                    ) : (
                      <span className="text-red-600">결제 실패</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">결제 금액</div>
                  <div className="font-bold text-lg">{subscription.totalAmount.toLocaleString()}원</div>
                </div>
              </div>

              {subscription.paymentMethod === "bank" && subscription.paymentStatus === "pending" && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-2">계좌이체 안내</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    아래 계좌로 청약금을 입금해 주세요. 입금자명은 반드시 청약자 본인 이름으로 해주세요.
                  </p>
                  <div className="bg-white p-3 rounded-md text-sm">
                    <div className="flex justify-between mb-1">
                      <span>은행명:</span>
                      <span className="font-medium">우리은행</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>계좌번호:</span>
                      <span className="font-medium">1002-123-456789</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>예금주:</span>
                      <span className="font-medium">(주)우리부동산</span>
                    </div>
                    <div className="flex justify-between">
                      <span>입금금액:</span>
                      <span className="font-bold">{subscription.totalAmount.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              )}

              {subscription.status === "completed" && (
                <div className="mt-6">
                  <Link
                    to={`/properties/${subscription.propertyId}`}
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    매물 상세 보기
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 청약자 정보 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">청약자 정보</h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">이름</div>
              <div className="font-medium">{subscription.userName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">이메일</div>
              <div className="font-medium">{subscription.userEmail}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">전화번호</div>
              <div className="font-medium">{subscription.userPhone}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">주소</div>
              <div className="font-medium">{subscription.userAddress}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 청약 진행 상태 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">청약 진행 상태</h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="relative">
            {/* 진행 상태 라인 */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 z-0">
              <div
                className={`h-full bg-blue-600 transition-all duration-500 ${
                  subscription.status === "pending" ? "w-1/3" : subscription.status === "completed" ? "w-full" : "w-0"
                }`}
              ></div>
            </div>

            {/* 진행 상태 단계 */}
            <div className="flex justify-between relative z-10">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    subscription.status === "pending" || subscription.status === "completed"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  1
                </div>
                <div className="text-sm font-medium">청약 신청</div>
                <div className="text-xs text-gray-500">{subscription.subscriptionDate}</div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    subscription.paymentStatus === "completed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  2
                </div>
                <div className="text-sm font-medium">결제 완료</div>
                <div className="text-xs text-gray-500">
                  {subscription.paymentStatus === "completed" ? subscription.completionDate : "-"}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    subscription.status === "completed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
                <div className="text-sm font-medium">청약 완료</div>
                <div className="text-xs text-gray-500">
                  {subscription.status === "completed" ? subscription.completionDate : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* 상태 메시지 */}
          <div className="mt-8 p-4 rounded-md bg-gray-50">
            {subscription.status === "pending" && subscription.paymentStatus === "pending" && (
              <p className="text-yellow-600">청약 신청이 완료되었습니다. 결제가 확인되면 청약이 최종 완료됩니다.</p>
            )}
            {subscription.status === "pending" && subscription.paymentStatus === "completed" && (
              <p className="text-blue-600">결제가 확인되었습니다. 청약 처리가 진행 중입니다.</p>
            )}
            {subscription.status === "completed" && (
              <p className="text-green-600">
                청약이 성공적으로 완료되었습니다. 토큰은 청약 완료 후 24시간 이내에 지갑으로 전송됩니다.
              </p>
            )}
            {subscription.status === "canceled" && (
              <p className="text-gray-600">청약이 취소되었습니다. 결제된 금액은 환불 처리됩니다.</p>
            )}
            {subscription.status === "failed" && (
              <p className="text-red-600">청약 처리 중 오류가 발생했습니다. 고객센터로 문의해주세요.</p>
            )}
          </div>
        </div>
      </div>

      {/* 문의 및 도움말 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">문의 및 도움말</h2>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">청약 취소는 어떻게 하나요?</h3>
              <p className="text-gray-600">
                청약 상태가 '대기중'인 경우에만 취소가 가능합니다. 페이지 상단의 '청약 취소하기' 버튼을 클릭하여 취소할
                수 있습니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">결제는 언제까지 해야 하나요?</h3>
              <p className="text-gray-600">
                청약 신청 후 24시간 이내에 결제를 완료해야 합니다. 기한 내 결제가 확인되지 않으면 청약이 자동으로
                취소됩니다.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">토큰은 언제 받을 수 있나요?</h3>
              <p className="text-gray-600">
                청약이 완료되면 24시간 이내에 등록된 지갑 주소로 토큰이 전송됩니다. 토큰 전송이 완료되면 이메일로 알림을
                보내드립니다.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-600">
                추가 문의사항은{" "}
                <a href="mailto:support@woore.com" className="text-blue-600 hover:underline">
                  support@woore.com
                </a>{" "}
                또는 고객센터(1588-1234)로 연락주세요.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionEndPage
