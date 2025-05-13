"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import type { Property } from "../../../types/property"
import { mockProperties } from "../../../data/mockData"

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any
  }
}

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

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
      {/* 매물 기본 정보 섹션 */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <div className="text-sm text-gray-500 mb-2">
              {property.city} · {property.district}
            </div>
            <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
            <div className="text-lg mb-2">임대인: {property.tenant}</div>
            <div className="text-lg mb-4">청약기간: {property.subscriptionPeriod}</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                {property.price} / {property.tokenAmount}DABS
              </div>
              <div className="bg-gray-100 px-3 py-1 rounded-full">{property.availableTokens} DABS 청약 가능</div>
              <div className="bg-gray-100 px-3 py-1 rounded-full">
                <span className="text-green-600">{property.dividendRate}</span> 배당률
              </div>
            </div>
          </div>
          <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto rounded-lg overflow-hidden">
            <img
              src={property.image || "/placeholder.svg?height=400&width=600&query=modern building"}
              alt={property.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 매물 소개 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">매물 소개</h2>
            <div className="mb-4">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="bg-gray-100 px-3 py-1 rounded-full">예상 수익률: {property.expectedYield}</div>
                <div className="bg-gray-100 px-3 py-1 rounded-full">목표 매각가: {property.targetPrice}</div>
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
                <div className="bg-gray-100 p-4 rounded-lg">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-XUjIsCA9UhFKkCDFdBfNCE2es3VdNR.png"
                    alt="공시지가 그래프"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 위치 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">위치</h2>
            <p className="text-gray-700 mb-4">{property.address}</p>
            <div className="relative">
              <div ref={mapRef} className="h-[400px] rounded-lg bg-gray-200">
                {/* 카카오맵이 로드되기 전 표시할 이미지 */}
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 주변 정보 */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">주변 정보</h2>
              <button className="text-blue-600 hover:underline">View all</button>
            </div>
            <p className="text-gray-700 mb-6">
              공공데이터 기반 / 뉴스 크롤링 기반 정보 불러오기가 가능하다면 불러옵니다
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg overflow-hidden">
                  <div className="h-40 bg-gray-200">
                    <img src="/quiet-suburban-street.png" alt="주변 정보" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">Category</span>
                      <span className="text-xs text-gray-500">5 min read</span>
                    </div>
                    <h3 className="font-bold mb-2">Blog title heading will go here</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
                    </p>
                    <a href="#" className="text-blue-600 text-sm">
                      Read more &gt;
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 투자 관련 문서 */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">투자 관련 문서</h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 border rounded-md hover:bg-gray-100">공시</button>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-100">등기부등본</button>
              <button className="px-4 py-2 border rounded-md hover:bg-gray-100">감정평가서</button>
            </div>
          </div>
        </div>

        {/* 주문 폼 (우측 사이드바) */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <div className="mb-6">
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
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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

            {/* 주문 유형 선택 탭 */}
            <div className="mb-4">
              <div className="flex mb-4">
                <button
                  className={`flex-1 py-2 ${
                    orderType === "buy" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setOrderType("buy")}
                >
                  매수
                </button>
                <button
                  className={`flex-1 py-2 ${
                    orderType === "sell" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => setOrderType("sell")}
                >
                  매도
                </button>
              </div>

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
              </div>
            </div>

            {/* 주문 버튼 */}
            <button
              onClick={handleOrder}
              className={`w-full py-3 rounded-md ${
                orderType === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              } text-white`}
            >
              {orderType === "buy" ? "매수하기" : "매도하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage
