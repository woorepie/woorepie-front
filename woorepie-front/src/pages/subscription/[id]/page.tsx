"use client"

import { useParams, Link, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"

// 청약 상세 정보 타입
interface SubscriptionDetailInfo {
  id: string
  propertyId: string
  propertyName: string
  propertyImage?: string
  location: string
  price: string
  totalTokens: number
  availableTokens: number
  tokenPrice: number
  tenant: string
  subscriptionPeriod: string
  expectedYield: string
  targetPrice: string
  description: string
}

// 샘플 청약 상세 데이터
const sampleSubscriptionDetails: SubscriptionDetailInfo[] = [
  {
    id: "1",
    propertyId: "1",
    propertyName: "교보타워",
    propertyImage: "/modern-glass-office.png",
    location: "서울 > 강남구",
    price: "50억",
    totalTokens: 500000,
    availableTokens: 351000,
    tokenPrice: 10000,
    tenant: "(주) ○○○법무법인",
    subscriptionPeriod: "25/04/30~25/05/20",
    expectedYield: "6.5%",
    targetPrice: "55억",
    description:
      "Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet. Arcu id augue ut feugiat donec porttitor neque. Mauris, neque ultricies eu vestibulum, bibendum quam lorem id. Dolor lacus, eget nunc lectus in tellus, pharetra, porttitor.",
  },
  {
    id: "2",
    propertyId: "2",
    propertyName: "코엑스",
    propertyImage: "/modern-commercial-building.png",
    location: "서울 > 삼성동",
    price: "30억",
    totalTokens: 300000,
    availableTokens: 120000,
    tokenPrice: 10000,
    tenant: "(주) ○○○엔터테인먼트",
    subscriptionPeriod: "25/03/15~25/04/15",
    expectedYield: "5.8%",
    targetPrice: "35억",
    description:
      "Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, urna. Viverra purus et erat auctor aliquam. Risus, volutpat vulputate posuere purus sit congue convallis aliquet.",
  },
]

// 샘플 뉴스 데이터
const sampleNews = [
  {
    id: 1,
    category: "부동산",
    readTime: "5 min read",
    title: "강남 오피스 시장 동향",
    description:
      "강남 지역 오피스 시장이 활기를 띠고 있습니다. 최근 거래량이 증가하고 임대료도 상승세를 보이고 있습니다.",
  },
  {
    id: 2,
    category: "투자",
    readTime: "3 min read",
    title: "부동산 토큰화의 미래",
    description:
      "부동산 토큰화가 투자 시장에 새로운 바람을 일으키고 있습니다. 소액으로도 프리미엄 부동산에 투자할 수 있는 기회가 확대되고 있습니다.",
  },
  {
    id: 3,
    category: "경제",
    readTime: "4 min read",
    title: "금리 인상과 부동산 시장",
    description: "중앙은행의 금리 인상이 부동산 시장에 미치는 영향을 분석합니다. 투자자들은 어떤 전략을 취해야 할까요?",
  },
]

const SubscriptionDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [subscriptionDetail, setSubscriptionDetail] = useState<SubscriptionDetailInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    // 실제 구현에서는 API에서 청약 상세 데이터를 가져올 것
    const foundSubscription = sampleSubscriptionDetails.find((sub) => sub.id === id)
    setSubscriptionDetail(foundSubscription || null)
    setLoading(false)
  }, [id])

  // 청약 신청 핸들러
  const handleSubscribe = () => {
    if (subscriptionDetail) {
      navigate(`/subscription/${subscriptionDetail.id}/detail`)
    }
  }

  // 카카오맵 초기화
  useEffect(() => {
    if (subscriptionDetail && mapRef.current) {
      // 카카오맵 API 스크립트 로드
      const script = document.createElement("script")
      script.async = true
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`
      document.head.appendChild(script)

      script.onload = () => {
        window.kakao.maps.load(() => {
          // 매물별 위도/경도 설정 (실제로는 DB에서 가져와야 함)
          const lat = 37.5665
          const lng = 126.978

          const coords = new window.kakao.maps.LatLng(lat, lng)
          const options = {
            center: coords,
            level: 3,
            mapTypeId: window.kakao.maps.MapTypeId.ROADMAP,
          }

          const map = new window.kakao.maps.Map(mapRef.current, options)
          const marker = new window.kakao.maps.Marker({
            position: coords,
            map: map,
          })

          setMapLoaded(true)
        })
      }

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [subscriptionDetail])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!subscriptionDetail) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">청약 정보를 찾을 수 없습니다</h1>
        <Link to="/subscription/list" className="text-blue-600 hover:underline">
          청약 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const progressPercentage =
    ((subscriptionDetail.totalTokens - subscriptionDetail.availableTokens) / subscriptionDetail.totalTokens) * 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/subscription/list" className="text-blue-600 hover:underline flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          청약 목록으로 돌아가기
        </Link>
      </div>

      {/* 상단 청약 정보 및 이미지 섹션 */}
      <div className="mb-12 bg-white rounded-2xl overflow-hidden shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* 왼쪽: 청약 기본 정보 (4/12) */}
          <div className="lg:col-span-4 p-8 border-r border-gray-100">
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-3">
              {subscriptionDetail.location}
            </div>
            <h1 className="text-3xl font-bold mb-2">{subscriptionDetail.propertyName}</h1>
            <div className="text-xl font-bold mb-6 text-gray-800">
              {subscriptionDetail.price} / {subscriptionDetail.totalTokens.toLocaleString()} DABS
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">임차인</div>
                  <div className="font-medium">{subscriptionDetail.tenant}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">청약기간</div>
                  <div className="font-medium">{subscriptionDetail.subscriptionPeriod}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-gray-500">청약 가능</div>
                  <div className="font-medium">
                    {subscriptionDetail.availableTokens.toLocaleString()}/
                    {subscriptionDetail.totalTokens.toLocaleString()} DABS
                  </div>
                </div>
              </div>
            </div>

            {/* 청약 진행 상태 */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">청약 진행률</span>
                <span className="font-bold text-blue-600">{progressPercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">예상 수익률</div>
                <div className="font-bold text-xl text-green-600">{subscriptionDetail.expectedYield}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="text-sm text-gray-500 mb-1">목표 매각가</div>
                <div className="font-bold text-xl">{subscriptionDetail.targetPrice}</div>
              </div>
            </div>
          </div>

          {/* 중앙: 매물 이미지 (5/12) */}
          <div className="lg:col-span-5 h-full">
            <div className="h-full bg-gray-100 relative">
              {subscriptionDetail.propertyImage ? (
                <img
                  src={subscriptionDetail.propertyImage || "/placeholder.svg"}
                  alt={subscriptionDetail.propertyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 h-full flex items-center justify-center">
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
          </div>

          {/* 오른쪽: 청약 버튼만 표시 (3/12) */}
          <div className="lg:col-span-3 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 p-8">
            <div className="w-full flex flex-col items-center justify-center">
              <button
                onClick={handleSubscribe}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`w-full py-8 px-6 rounded-xl bg-white text-blue-600 text-2xl font-bold shadow-lg transition-all duration-300 ${
                  isHovered ? "transform scale-105 shadow-xl" : "hover:shadow-xl hover:bg-blue-50"
                }`}
              >
                청약하기
              </button>

              <div className="flex flex-col items-center space-y-3 mt-6">
                <Link
                  to={`/properties/${subscriptionDetail.propertyId}`}
                  className="text-white hover:text-blue-100 transition-colors duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  매물 보기
                </Link>
                <Link
                  to="/market"
                  className="text-white hover:text-blue-100 transition-colors duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  거래소
                </Link>
                <button className="text-white hover:text-blue-100 transition-colors duration-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  공시 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 매물 소개 섹션 */}
      <div className="mb-12 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          매물 소개
        </h2>
        <p className="text-gray-700 leading-relaxed">{subscriptionDetail.description}</p>
      </div>

      {/* 주변 정보 섹션 */}
      <div className="mb-12 bg-white rounded-2xl p-8 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            주변 정보
          </h2>
          <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
            공공데이터 / 뉴스 크롤링 기반
          </div>
        </div>

        {/* 지도 */}
        <div className="mb-8">
          <div ref={mapRef} className="h-[300px] rounded-xl bg-gray-200 overflow-hidden">
            {/* 카카오맵이 로드되기 전 표시할 이미지 */}
            {!mapLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>

        {/* 관련 뉴스 */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              관련 뉴스
            </h3>
            <Link
              to="#"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-medium"
            >
              전체 보기
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleNews.map((news) => (
              <div
                key={news.id}
                className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-40 bg-gray-200"></div>
                <div className="p-5">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span className="px-2 py-1 bg-gray-100 rounded-full">{news.category}</span>
                    <span>{news.readTime}</span>
                  </div>
                  <h4 className="font-bold text-lg mb-2">{news.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{news.description}</p>
                  <Link
                    to="#"
                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-sm font-medium flex items-center"
                  >
                    자세히 보기
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 투자 관련 문서 */}
      <div className="mb-12 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          투자 관련 문서
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-6 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all duration-200 flex flex-col items-center shadow-sm hover:shadow-md">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-medium">공시</span>
          </button>
          <button className="p-6 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all duration-200 flex flex-col items-center shadow-sm hover:shadow-md">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-medium">등기부등본</span>
          </button>
          <button className="p-6 border border-gray-100 rounded-xl hover:bg-blue-50 hover:border-blue-100 transition-all duration-200 flex flex-col items-center shadow-sm hover:shadow-md">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className="font-medium">감정평가서</span>
          </button>
        </div>
      </div>

      {/* 고객 문의 */}
      <div className="mb-12 bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          고객 문의
        </h2>
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <p className="text-gray-700 mb-6">청약 관련 문의사항이 있으신가요? 아래 연락처로 문의해주세요.</p>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="mb-4 md:mb-0 bg-white p-4 rounded-xl shadow-sm flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium mb-1">이메일</div>
                <a href="mailto:support@woore.com" className="text-blue-600 hover:underline">
                  support@woore.com
                </a>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <div className="font-medium mb-1">전화</div>
                <a href="tel:1588-1234" className="text-blue-600 hover:underline">
                  1588-1234
                </a>
                <div className="text-sm text-gray-500">평일 09:00 - 18:00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionDetailPage
