"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { estateService } from "../../../api/estate"
import type { EstateDetail } from "../../../types/estate/estateDetail"
import PropertyPriceChart, { type PriceData } from "../../../components/PropertyPriceChart"
import { useAuth } from "../../../context/AuthContext"
import { tradeService } from "../../../api/trade"
import { customerService } from "../../../api/trade"
import type { RedisCustomerTradeValue } from "../../../types/trade/trade"

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
  const { isAuthenticated } = useAuth()
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<EstateDetail | null>(null)
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [priceData, setPriceData] = useState<PriceData[]>(samplePriceData)
  const [activeTab, setActiveTab] = useState<"buy" | "sell" | "myOrders">("buy")
  const [myBuyOrders, setMyBuyOrders] = useState<RedisCustomerTradeValue[]>([])
  const [mySellOrders, setMySellOrders] = useState<RedisCustomerTradeValue[]>([])
  const fetchMyOrders = async () => {
  try {
    let buyRes = await customerService.getCustomerBuyOrders()
    let sellRes = await customerService.getCustomerSellOrders()

    // ✅ 단일 객체인 경우 배열로 감싸기
    if (buyRes && !Array.isArray(buyRes)) buyRes = [buyRes]
    if (sellRes && !Array.isArray(sellRes)) sellRes = [sellRes]

    console.log("전체 매수 주문 (buyRes):", buyRes)
    console.log("전체 매도 주문 (sellRes):", sellRes)
    console.log("현재 매물 ID:", id)

    const estateIdNum = Number(id)
    const filteredBuy = buyRes.filter((o) => o.estateId === estateIdNum)
    const filteredSell = sellRes.filter((o) => o.estateId === estateIdNum)

    console.log("필터링된 매수 주문:", filteredBuy)
    console.log("필터링된 매도 주문:", filteredSell)

    setMyBuyOrders(filteredBuy)
    setMySellOrders(filteredSell)
  } catch (err) {
    console.error("❌ 내 주문 불러오기 실패:", err)
  }
}

  // 호가창 관련 타입 정의를 간소화합니다
  const [orderSummary, setOrderSummary] = useState({
    price: 10000, // 기본값, 실제로는 매물가격/토큰발행수로 계산
    buyQuantity: 120,
    sellQuantity: 85,
  })

  useEffect(() => {
  if (isAuthenticated && id) {
    fetchMyOrders()
  }
}, [isAuthenticated, id])

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        if (!id) return

        // 부동산 상세 정보 조회
        const propertyData = await estateService.getEstateDetail(Number(id))
        console.log("부동산 상세 정보:", propertyData)
        setProperty(propertyData)

        // 토큰 가격 설정
        if (propertyData.estateTokenPrice) {
          setPrice(propertyData.estateTokenPrice.toString())
          setOrderSummary(prev => ({
            ...prev,
            price: propertyData.estateTokenPrice,
          }))
        }

      } catch (error) {
        console.error("부동산 데이터 조회 실패:", error)
      }
    }

    fetchPropertyData()
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
      console.log(import.meta.env.VITE_KAKAO_MAP_API_KEY)

      // 카카오맵 API 스크립트 로드
      const script = document.createElement("script")
      script.async = true
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`
      document.head.appendChild(script)

      script.onload = () => {
        window.kakao.maps.load(() => {
          // 매물별 위도/경도 설정
          let lat = 37.5665
          let lng = 126.978

          // 위도/경도 정보를 가져옵니다
          if (property.estateLatitude && property.estateLongitude) {
            lat = parseFloat(property.estateLatitude)
            lng = parseFloat(property.estateLongitude)
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
          const imageSrc = "/marker.png"
          const imageSize = new window.kakao.maps.Size(64, 69)
          const imageOption = { offset: new window.kakao.maps.Point(32, 69) }

          const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

          // 마커 생성
          const marker = new window.kakao.maps.Marker({
            position: coords,
            map: map,
            image: markerImage,
            title: property.estateName,
          })

          // 마커 애니메이션
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
                <div class="overlay-title">${property.estateName}</div>
                <div class="overlay-price">${property.estatePrice.toLocaleString()}원</div>
              </div>
              <div class="overlay-arrow"></div>
            </div>
          `

          // 커스텀 오버레이 생성
          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: coords,
            content: content,
            yAnchor: 1.3,
            zIndex: 3,
          })

          // 오버레이를 항상 표시하도록 설정
          customOverlay.setMap(map)

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
    const handleOrder = async () => {
  if (!property || !quantity) {
    alert("수량 또는 매물 정보가 없습니다.")
    return
  }

  const payload = {
    estateId: Number(id),
    tradeTokenAmount: Number(quantity),
    tokenPrice: property.estateTokenPrice
  }

  try {
    if (orderType === "buy") {
      await tradeService.buyEstate(payload)
      alert("매수 주문이 완료되었습니다.")
    } else {
      await tradeService.sellEstate(payload)
      alert("매도 주문이 완료되었습니다.")
    }

    setQuantity("")

    // ✅ 여기서 내 주문 다시 불러오기
    fetchMyOrders()

  } catch (error) {
    console.error("주문 실패:", error)
    alert("주문 처리 중 오류가 발생했습니다.")
  }
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
        <div className={isAuthenticated ? "lg:w-2/3" : "lg:w-full"}>
          <h1 className="text-3xl font-bold mb-4">{property.estateName}</h1>
          <div className="text-2xl font-bold mb-6">
            {property.estatePrice.toLocaleString()}원 / {property.tokenAmount.toLocaleString()} DABS
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex">
              <span className="w-24 text-gray-600">중개인:</span>
              <span className="font-medium">{property.agentName}</span>
            </div>
            <div className="flex">
              <span className="w-24 text-gray-600">주소:</span>
              <span className="font-medium">{property.estateAddress}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <div className="bg-gray-100 px-4 py-2 rounded-md">
              <span className="text-gray-600 mr-2">토큰 가격:</span>
              <span className="font-bold">{property.estateTokenPrice.toLocaleString()}원</span>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-md">
              <span className="text-gray-600 mr-2">배당률:</span>
              <span className="font-bold text-green-600">{(property.dividendYield * 100).toFixed(2)}%</span>
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
                  <div className="text-gray-600 text-sm mb-1">배당률</div>
                  <div className="font-bold">{(property.dividendYield * 100).toFixed(2)}%</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <div className="text-gray-600 text-sm mb-1">토큰 가격</div>
                  <div className="font-bold">{property.estateTokenPrice.toLocaleString()}원</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <div className="text-gray-600 text-sm mb-1">대지면적</div>
                  <div className="font-bold">{property.totalEstateArea}평({(property.totalEstateArea * 3.3058).toFixed(2)}m²)</div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md text-center">
                  <div className="text-gray-600 text-sm mb-1">건물면적</div>
                  <div className="font-bold">{property.tradedEstateArea}평({(property.tradedEstateArea * 3.3058).toFixed(2)}m²)</div>
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
                  <p>전체 대지면적: {property.totalEstateArea}평({(property.totalEstateArea * 3.3058).toFixed(2)}m²)</p>
                  <p>거래 대지면적: {property.tradedEstateArea}평({(property.tradedEstateArea * 3.3058).toFixed(2)}m²)</p>
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
              <a href={property.subGuideUrl} target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md hover:bg-gray-100 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>공시</span>
              </a>
              <a href={property.securitiesReportUrl} target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md hover:bg-gray-100 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>증권신고서</span>
              </a>
              <a href={property.appraisalReportUrl} target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md hover:bg-gray-100 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>감정평가서</span>
              </a>
              <a href={property.investmentExplanationUrl} target="_blank" rel="noopener noreferrer" className="p-4 border rounded-md hover:bg-gray-100 flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mb-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>투자설명서</span>
              </a>
            </div>
          </div>
        </div>

        {/* 오른쪽: 거래 패널 - 로그인한 사용자에게만 표시 */}
        {isAuthenticated ? (
          <div className="lg:w-1/3">
            <div className="bg-white p-4 rounded-lg shadow-md sticky top-24">
              <h2 className="text-xl font-bold mb-4">거래 패널</h2>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <div className="font-medium">토큰 가격</div>
                  <div>{property.estateTokenPrice.toLocaleString()}/1DABS</div>
                </div>
                <div className="flex justify-between mb-4">
                  <div className="font-medium">토큰 수량</div>
                  <div>{property.tokenAmount.toLocaleString()} DABS</div>
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
                        {[...myBuyOrders.filter((order) => order.tradeTokenAmount > 0).map((order) => (
                          <tr key={`buy-${order.timestamp}`} className="border-b">
                            <td className="p-2 text-right">{order.tokenPrice.toLocaleString()}</td>
                            <td className="p-2 text-right">{Math.abs(order.tradeTokenAmount)}</td>
                            <td className="p-2 text-center">
                              <span className="px-1.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">매수</span>
                            </td>
                            <td className="p-2 text-center">
                              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">대기중</span>
                            </td>
                          </tr>
                        )),
                        ...mySellOrders.filter((order) => order.tradeTokenAmount < 0).map((order) => (
                          <tr key={`sell-${order.timestamp}`} className="border-b">
                            <td className="p-2 text-right">{order.tokenPrice.toLocaleString()}</td>
                            <td className="p-2 text-right">{Math.abs(order.tradeTokenAmount)}</td>
                            <td className="p-2 text-center">
                              <span className="px-1.5 py-0.5 rounded-full text-xs bg-red-100 text-red-800">매도</span>
                            </td>
                            <td className="p-2 text-center">
                              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">대기중</span>
                            </td>
                          </tr>
                        ))]}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:w-1/3">
            <div className="bg-white p-4 rounded-lg shadow-md sticky top-24 text-center">
              <h2 className="text-xl font-bold mb-4">거래하기</h2>
              <p className="text-gray-600 mb-4">매물 거래를 위해서는 로그인이 필요합니다.</p>
              <Link
                to="/auth/login"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                로그인하기
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyDetailPage