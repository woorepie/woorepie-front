"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { estateService } from "../../../api/estate"
import { tradeService } from "../../../api/trade"
import type { EstateDetail } from "../../../types/estate/estateDetail"
import PropertyPriceChart, { type PriceData } from "../../../components/PropertyPriceChart"
import { useAuth } from "../../../context/AuthContext"

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

interface PropertyDetailPageProps {}

const PropertyDetailPage: React.FC<PropertyDetailPageProps> = () => {
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
  const [isLoading, setIsLoading] = useState(false)

  // 호가창 관련 타입 정의를 간소화합니다
  const [orderSummary, setOrderSummary] = useState({
    price: 10000, // 기본값, 실제로는 매물가격/토큰발행수로 계산
    buyQuantity: 120,
    sellQuantity: 85,
  })

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        if (!id) return

        // 부동산 상세 정보 조회
        const propertyData = await estateService.getEstateDetail(Number(id))
        console.log("부동산 상세 정보:", propertyData)
        setProperty(propertyData)

        // 토큰 가격 설정
        const tokenPrice = propertyData.estateTokenPrice || (propertyData.estatePrice / propertyData.tokenAmount)
        setPrice(tokenPrice.toString())
        setOrderSummary(prev => ({
          ...prev,
          price: tokenPrice,
        }))

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

  // 주문 처리 함수 수정
  const handleOrder = async () => {
    if (!price || !quantity || !property?.estateId) {
      alert("가격과 수량을 모두 입력해주세요.")
      return
    }

    if (!isAuthenticated) {
      alert("로그인이 필요한 서비스입니다.")
      return
    }

    setIsLoading(true)
    try {
      const request = {
        estateId: property.estateId,
        tradeTokenAmount: Number(quantity),
        tokenPrice: Number(price)
      }

      if (orderType === "buy") {
        await tradeService.buyEstate(request)
        alert("매수 주문이 접수되었습니다.")
      } else {
        await tradeService.sellEstate(request)
        alert("매도 주문이 접수되었습니다.")
      }
      
      setQuantity("")
    } catch (error) {
      console.error('Order failed:', error)
      alert("주문 처리 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!property) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
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
        {isAuthenticated && (
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
                    disabled={isLoading}
                    className={`w-full py-3 rounded-md ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {isLoading ? '처리중...' : '매수하기'}
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
                  <button
                    onClick={handleOrder}
                    disabled={isLoading}
                    className={`w-full py-3 rounded-md ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white`}
                  >
                    {isLoading ? '처리중...' : '매도하기'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PropertyDetailPage 