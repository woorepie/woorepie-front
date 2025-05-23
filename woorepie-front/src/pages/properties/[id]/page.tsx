"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import type { Property } from "../../../types/mock/propertyMock"
import { mockProperties } from "../../../data/mockData"
import PropertyPriceChart, { type PriceData } from "../../../components/PropertyPriceChart"

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any
  }
}

// 샘플 공시지가 데이터
const samplePriceData: PriceData[] = [
  { month: "Jan", publicPrice: 120, averagePrice: 100 },
  { month: "Feb", publicPrice: 150, averagePrice: 110 },
  { month: "Mar", publicPrice: 200, averagePrice: 130 },
  { month: "Apr", publicPrice: 230, averagePrice: 140 },
  { month: "May", publicPrice: 270, averagePrice: 160 },
  { month: "Jun", publicPrice: 300, averagePrice: 180 },
  { month: "Jul", publicPrice: 350, averagePrice: 200 },
  { month: "Aug", publicPrice: 380, averagePrice: 220 },
  { month: "Sep", publicPrice: 350, averagePrice: 240 },
  { month: "Oct", publicPrice: 400, averagePrice: 260 },
  { month: "Nov", publicPrice: 480, averagePrice: 280 },
  { month: "Dec", publicPrice: 700, averagePrice: 300 },
]

// 샘플 체결 내역 데이터
const sampleTradeHistory = [
  { id: 1, time: "14:32:15", price: 10000, quantity: 5, type: "buy" },
  { id: 2, time: "14:30:22", price: 10050, quantity: 3, type: "sell" },
  { id: 3, time: "14:28:45", price: 10000, quantity: 2, type: "buy" },
  { id: 4, time: "14:25:18", price: 9950, quantity: 10, type: "sell" },
  { id: 5, time: "14:22:33", price: 10000, quantity: 1, type: "buy" },
]

// 샘플 주문 내역 데이터
const sampleMyOrders = [
  { id: 101, price: 10100, quantity: 5, type: "buy", status: "waiting" },
  { id: 102, price: 9900, quantity: 8, type: "sell", status: "waiting" },
]

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [priceData, setPriceData] = useState<PriceData[]>(samplePriceData)
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "myOrders">("buy")

  // 호가창 관련 타입 정의를 간소화합니다
  const [orderSummary, setOrderSummary] = useState({
    price: 10000, // 기본값, 실제로는 매물가격/토큰발행수로 계산
    buyQuantity: 120,
    sellQuantity: 85,
  })

  useEffect(() => {
    // 실제 구현에서는 API에서 매물 데이터를 가져올 것
    const foundProperty = mockProperties.find((p) => p.id === id)
    setProperty(foundProperty || null)

    // 매물 가격과 토큰 발행량으로 토큰 가격 계산
    if (foundProperty) {
      const tokenPrice = foundProperty.tokenPrice.replace(/,/g, "")
      setPrice(tokenPrice)

      // 여기서 orderSummary의 price도 업데이트
      setOrderSummary((prev) => ({
        ...prev,
        price: Number(tokenPrice),
      }))

      // 실제 구현에서는 여기서 공시지가 데이터를 API에서 가져올 것
      // fetchPriceData(foundProperty.id).then(data => setPriceData(data))
    }
  }, [id])

  // 수량 또는 가격이 변경될 때 총액 계산
  useEffect(() => {
    if (price && quantity) {
      setTotalAmount(Number(price) * Number(quantity))
    } else {
      setTotalAmount(0)
    }
  }, [price, quantity])

  // 카카오맵 초기화
  useEffect(() => {
    if (property && mapRef.current) {
      // 카카오맵 API 스크립트 로드
      const script = document.createElement("script")
      script.async = true
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`
      document.head.appendChild(script)

      script.onload = () => {
        window.kakao.maps.load(() => {
          // 매물별 위도/경도 설정 (실제로는 DB에서 가져와야 함)
          // 여기서는 예시로 매물 ID에 따라 다른 위치를 보여줌
          let lat = 37.5665
          let lng = 126.978

          // mockData에서 위도/경도 정보를 가져옵니다
          if (property.latitude && property.longitude) {
            lat = property.latitude
            lng = property.longitude
          }

          const coords = new window.kakao.maps.LatLng(lat, lng)
          const options = {
            center: coords,
            level: 3,
            mapTypeId: window.kakao.maps.MapTypeId.ROADMAP,
            draggable: true,
            scrollwheel: true,
          }

          const map = new window.kakao.maps.Map(mapRef.current, options)

          // 커스텀 마커 이미지 생성
          const imageSrc = "/marker.png" // 커스텀 마커 이미지 경로
          const imageSize = new window.kakao.maps.Size(64, 69) // 마커 이미지 크기
          const imageOption = { offset: new window.kakao.maps.Point(32, 69) } // 마커 이미지 옵션 (이미지 중심점)

          const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

          // 마커 생성 - Animation.DROP 속성 제거
          const marker = new window.kakao.maps.Marker({
            position: coords,
            map: map,
            image: markerImage,
            title: property.name,
          })

          // 마커 애니메이션 대신 CSS 애니메이션 적용
          // 마커 요소에 클래스 추가
          setTimeout(() => {
            if (marker && marker.a) {
              const markerNode = marker.a
              if (markerNode) {
                markerNode.classList.add("marker-bounce")
              }
            }
          }, 100)

          // 커스텀 오버레이 내용
          const content = `
            <div class="custom-overlay">
              <div class="overlay-content">
                <div class="overlay-title">${property.name}</div>
                <div class="overlay-price">${property.price}</div>
              </div>
              <div class="overlay-arrow"></div>
            </div>
          `

          // 커스텀 오버레이 생성
          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: coords,
            content: content,
            yAnchor: 1.3, // 오버레이 위치 조정
            zIndex: 3,
          })

          // 오버레이를 항상 표시하도록 설정
          customOverlay.setMap(map)

          // 마커 클릭 이벤트 등록
          window.kakao.maps.event.addListener(marker, "click", () => {
            // alert 제거
          })

          // 지도 컨트롤 추가
          const zoomControl = new window.kakao.maps.ZoomControl()
          map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT)

          const mapTypeControl = new window.kakao.maps.MapTypeControl()
          map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT)

          setMapLoaded(true)
        })
      }

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    }
  }, [property])

  // 주문 처리 함수
  const handleOrder = () => {
    if (!price || !quantity) {
      alert("가격과 수량을 모두 입력해주세요.")
      return
    }

    // 실제 구현에서는 API를 통해 주문 처리
    alert(`${orderType === "buy" ? "매수" : "매도"} 주문이 접수되었습니다.`)
    setQuantity("")
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">매물을 찾을 수 없습니다</h1>
        <Link to="/properties" className="text-blue-600 hover:underline">
          매물 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 새로운 레이아웃: 상단 정보 + 거래 패널 */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 왼쪽: 매물 기본 정보 */}
        <div className="lg:w-2/3">
          <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
          <div className="text-2xl font-bold mb-6">
            {property.price} / {property.tokenAmount}
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex">
              <span className="w-24 text-gray-600">임대인:</span>
              <span className="font-medium">{property.tenant || "(주) ○○○법무법인"}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-gray-600">청약기간:</span>
              <span className="font-medium">{property.subscriptionPeriod || "25/04/30~25/05/20"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="bg-gray-100 px-4 py-2 rounded-md">
              <span className="text-gray-600 mr-2">토큰 가격:</span>
              <span className="font-bold">{property.tokenPrice}원</span>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-md">
              <span className="text-gray-600 mr-2">배당률:</span>
              <span className="font-bold text-green-600">{property.dividendRate}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              매물 정보 다운로드
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50">
              공유하기
            </button>
          </div>

          {/* 매물 이미지/지도 */}
          <div className="mt-8 mb-12">
            <div className="bg-gray-200 h-96 rounded-lg overflow-hidden">
              <div ref={mapRef} className="h-full w-full">
                {/* 카카오맵이 로드되기 전 표시할 이미지 */}
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 매물 소개 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">매물 소개</h2>
            <div className="mb-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <div className="text-gray-600 text-sm mb-1">예상 수익률</div>
                  <div className="font-bold">{property.expectedYield}</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <div className="text-gray-600 text-sm mb-1">목표 매각가</div>
                  <div className="font-bold">{property.targetPrice}</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <div className="text-gray-600 text-sm mb-1">대지면적</div>
                  <div className="font-bold">27평(89m²)</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <div className="text-gray-600 text-sm mb-1">건물면적</div>
                  <div className="font-bold">81평(268m²)</div>
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget
              vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate
              arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
            </p>
            <p className="text-gray-700 mb-4">
              Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed
              auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at
              donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
            </p>
          </div>

          {/* 건물 정보 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">건물 정보</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium mb-4">용도지역</h3>
                <div className="text-gray-700 space-y-2">
                  <p>전체 대지면적: 27평(89m²)</p>
                  <p>거래 대지면적: 27평(89m²)</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-4">공시지가</h3>
                <div className="bg-white p-4 rounded-lg">
                  <PropertyPriceChart data={priceData} />
                </div>
              </div>
            </div>
          </div>

          {/* 투자 관련 문서 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">투자 관련 문서</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 border rounded-md hover:bg-gray-100 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-2 text-gray-600"
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
                <span>공시</span>
              </button>
              <button className="p-4 border rounded-md hover:bg-gray-100 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-2 text-gray-600"
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
                <span>등기부등본</span>
              </button>
              <button className="p-4 border rounded-md hover:bg-gray-100 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-2 text-gray-600"
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
                <span>감정평가서</span>
              </button>
              <button className="p-4 border rounded-md hover:bg-gray-100 flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 mb-2 text-gray-600"
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
                <span>투자설명서</span>
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽: 거래 패널 - sticky 포지셔닝 적용 */}
        <div className="lg:w-1/3">
          <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
            <h2 className="text-xl font-bold mb-4">거래 패널</h2>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <div className="font-medium">토큰 가격</div>
                <div>{property.tokenPrice}/1DABS</div>
              </div>
              <div className="flex justify-between mb-4">
                <div className="font-medium">잔고</div>
                <div>{property.balance}KRW</div>
              </div>
            </div>

            {/* 간소화된 주문 현황 */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center mb-3 font-medium">현재 주문 현황</div>
              <div className="flex justify-between items-center">
                <div className="text-green-600">
                  <div className="text-sm">매수</div>
                  <div className="font-bold">{orderSummary.buyQuantity} DABS</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">현재가</div>
                  <div className="font-bold">{orderSummary.price.toLocaleString()} KRW</div>
                </div>
                <div className="text-red-600">
                  <div className="text-sm">매도</div>
                  <div className="font-bold">{orderSummary.sellQuantity} DABS</div>
                </div>
              </div>
            </div>

            {/* 탭 네비게이션 */}
            <div className="mb-4">
              <div className="flex border-b">
                <button
                  className={`flex-1 py-2 px-4 text-center ${
                    activeTab === "buy" ? "border-b-2 border-green-600 text-green-600 font-medium" : "text-gray-500"
                  }`}
                  onClick={() => {
                    setActiveTab("buy")
                    setOrderType("buy")
                  }}
                >
                  매수
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-center ${
                    activeTab === "sell" ? "border-b-2 border-red-600 text-red-600 font-medium" : "text-gray-500"
                  }`}
                  onClick={() => {
                    setActiveTab("sell")
                    setOrderType("sell")
                  }}
                >
                  매도
                </button>
                <button
                  className={`flex-1 py-2 px-4 text-center ${
                    activeTab === "myOrders" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("myOrders")}
                >
                  내 주문
                </button>
              </div>
            </div>

            {/* 탭 컨텐츠 */}
            {activeTab === "buy" && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm">가격 (KRW)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full p-3 border rounded-md"
                    placeholder="가격을 입력하세요"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">* 토큰 가격은 매물가격/토큰발행수로 고정됩니다</p>
                </div>
                <div>
                  <label className="block mb-1 text-sm">수량 (DABS)</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full p-3 border rounded-md"
                    placeholder="수량을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">총액 (KRW)</label>
                  <div className="p-3 bg-gray-100 rounded-md">{totalAmount.toLocaleString()}</div>
                </div>
                <button
                  onClick={handleOrder}
                  className="w-full py-3 rounded-md bg-green-600 hover:bg-green-700 text-white"
                >
                  매수하기
                </button>
              </div>
            )}

            {activeTab === "sell" && (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm">가격 (KRW)</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full p-3 border rounded-md"
                    placeholder="가격을 입력하세요"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">* 토큰 가격은 매물가격/토큰발행수로 고정됩니다</p>
                </div>
                <div>
                  <label className="block mb-1 text-sm">수량 (DABS)</label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full p-3 border rounded-md"
                    placeholder="수량을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm">총액 (KRW)</label>
                  <div className="p-3 bg-gray-100 rounded-md">{totalAmount.toLocaleString()}</div>
                </div>
                <button onClick={handleOrder} className="w-full py-3 rounded-md bg-red-600 hover:bg-red-700 text-white">
                  매도하기
                </button>
              </div>
            )}

            {activeTab === "myOrders" && (
              <div>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-right">가격</th>
                        <th className="p-2 text-right">수량</th>
                        <th className="p-2 text-center">유형</th>
                        <th className="p-2 text-center">상태</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleMyOrders.map((order) => (
                        <tr key={order.id} className="border-b">
                          <td className="p-2 text-right">{order.price.toLocaleString()}</td>
                          <td className="p-2 text-right">{order.quantity}</td>
                          <td className="p-2 text-center">
                            <span
                              className={`px-1.5 py-0.5 rounded-full text-xs ${
                                order.type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {order.type === "buy" ? "매수" : "매도"}
                            </span>
                          </td>
                          <td className="p-2 text-center">
                            <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                              {order.status === "waiting" ? "대기중" : "완료"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 최근 체결 내역 */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="font-medium mb-2">최근 체결 내역</h3>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-1 text-left">시간</th>
                      <th className="p-1 text-right">가격</th>
                      <th className="p-1 text-right">수량</th>
                      <th className="p-1 text-center">유형</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sampleTradeHistory.map((trade) => (
                      <tr key={trade.id} className="border-b">
                        <td className="p-1">{trade.time}</td>
                        <td className="p-1 text-right">{trade.price.toLocaleString()}</td>
                        <td className="p-1 text-right">{trade.quantity}</td>
                        <td className="p-1 text-center">
                          <span
                            className={`px-1 py-0.5 rounded-full text-xs ${
                              trade.type === "buy" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {trade.type === "buy" ? "매수" : "매도"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage
