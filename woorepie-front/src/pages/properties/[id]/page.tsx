"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import type { Property } from "../../../types/property"
import { mockProperties } from "../../../data/mockData"

// 호가 데이터 타입 정의
// interface OrderBookEntry {
//   price: number
//   quantity: number
//   accumulated: number
// }

// 호가창 관련 타입 정의를 간소화합니다
interface OrderSummary {
  price: number
  buyQuantity: number
  sellQuantity: number
}

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)

  // 호가창 데이터 (실제로는 API에서 가져올 것)
  // const [sellOrders, setSellOrders] = useState<OrderBookEntry[]>([
  //   { price: 10500, quantity: 15, accumulated: 15 },
  //   { price: 10400, quantity: 22, accumulated: 37 },
  //   { price: 10300, quantity: 18, accumulated: 55 },
  //   { price: 10200, quantity: 30, accumulated: 85 },
  //   { price: 10100, quantity: 25, accumulated: 110 },
  // ])

  // const [buyOrders, setBuyOrders] = useState<OrderBookEntry[]>([
  //   { price: 10000, quantity: 20, accumulated: 20 },
  //   { price: 9900, quantity: 35, accumulated: 55 },
  //   { price: 9800, quantity: 15, accumulated: 70 },
  //   { price: 9700, quantity: 28, accumulated: 98 },
  //   { price: 9600, quantity: 42, accumulated: 140 },
  // ])

  // 컴포넌트 내부에서 호가창 데이터 상태를 간소화합니다
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    price: 10000, // 기본값, 실제로는 매물가격/토큰발행수로 계산
    buyQuantity: 120,
    sellQuantity: 85,
  })

  useEffect(() => {
    // 실제 구현에서는 API에서 매물 데이터를 가져올 것
    const foundProperty = mockProperties.find((p) => p.id === id)
    setProperty(foundProperty || null)

    // 매물 가격으로 초기 가격 설정
    // if (foundProperty && foundProperty.tokenPrice) {
    //   setPrice(foundProperty.tokenPrice.replace(/,/g, ""))
    // }

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
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          {property.city} &gt; {property.district}
        </div>
        <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            {property.price} / {property.tokenAmount}DABS
          </div>
          <div>임차인 {property.tenant}</div>
          <div>{property.subscriptionPeriod}</div>
          <div>{property.availableTokens} DABS 청약 가능</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Property Image */}
          <div className="bg-gray-200 h-96 rounded-lg mb-8 flex items-center justify-center">
            {property.image ? (
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400">Image caption goes here</div>
            )}
          </div>

          {/* Order Book */}
          {/* <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-bold mb-4">호가창</h2>
            <div className="overflow-hidden rounded-lg border">
              {/* Sell Orders */}
          {/* <div className="space-y-1 p-3 bg-gray-50">
                {sellOrders.map((order, index) => (
                  <div key={`sell-${index}`} className="flex justify-between text-sm">
                    <span className="text-red-600 font-medium">{order.price.toLocaleString()}</span>
                    <span className="text-gray-600">{order.quantity}</span>
                    <span className="text-gray-500 text-xs bg-gray-200 px-1 rounded">{order.accumulated}</span>
                  </div>
                ))}
              </div> */}

          {/* Current Price */}
          {/* <div className="py-2 px-3 border-y border-gray-200 bg-blue-50">
                <div className="flex justify-between font-bold">
                  <span>현재가</span>
                  <span>{Number(property.tokenPrice.replace(/,/g, "")).toLocaleString()}</span>
                </div>
              </div> */}

          {/* Buy Orders */}
          {/* <div className="space-y-1 p-3 bg-gray-50">
                {buyOrders.map((order, index) => (
                  <div key={`buy-${index}`} className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium">{order.price.toLocaleString()}</span>
                    <span className="text-gray-600">{order.quantity}</span>
                    <span className="text-gray-500 text-xs bg-gray-200 px-1 rounded">{order.accumulated}</span>
                  </div>
                ))}
              </div>
            </div>
          </div> */}

          {/* Property Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">매물 소개</h2>
            <div className="mb-4">
              <div className="flex gap-4 mb-2">
                <div>예상 수익률 : {property.expectedYield}</div>
                <div>목표 매각가 : {property.targetPrice}</div>
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

          {/* Building Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">건물 정보</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium mb-2">토지 건물</h3>
                <div className="text-gray-700">
                  <p>용도지역</p>
                  <p>전체 대지면적: 27평(89m2)</p>
                  <p>거래 대지면적: 27평(89m2)</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">공시지가</h3>
                <div className="bg-gray-100 h-40 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">위치</h2>
            <p className="text-gray-700 mb-4">{property.address}</p>
            <div className="bg-gray-200 h-80 rounded-lg"></div>
          </div>

          {/* Nearby Information */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">주변 정보</h2>
              <button className="text-blue-600">View all</button>
            </div>
            <p className="text-gray-700 mb-6">
              공공데이터 기반 / 뉴스 크롤링 기반 정보 불러오기가 가능하다면 불러옵니다
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-2">Category 5 min read</div>
                  <h3 className="font-bold mb-2">Blog title heading will go here</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
                  </p>
                  <a href="#" className="text-blue-600 text-sm">
                    Read more &gt;
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Documents */}
          <div>
            <h2 className="text-2xl font-bold mb-4">투자 관련 문서</h2>
            <div className="flex gap-4">
              <button className="px-4 py-2 border rounded-md">공시</button>
              <button className="px-4 py-2 border rounded-md">+</button>
              <button className="px-4 py-2 border rounded-md">+</button>
            </div>
          </div>
        </div>

        {/* Order Form */}
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
