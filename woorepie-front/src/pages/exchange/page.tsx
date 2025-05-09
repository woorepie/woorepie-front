"use client"

import { useState } from "react"
import { mockTokens } from "../../data/mockData"

const ExchangePage = () => {
  const [selectedToken, setSelectedToken] = useState(mockTokens[0])
  const [orderType, setOrderType] = useState("buy")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">거래소</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Token List */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">토큰 목록</h2>
            <div className="mb-4">
              <input type="text" className="w-full p-2 border rounded-md" placeholder="토큰 검색" />
            </div>
            <div className="space-y-2">
              {mockTokens.map((token) => (
                <button
                  key={token.id}
                  className={`w-full p-3 rounded-md text-left ${
                    selectedToken.id === token.id ? "bg-blue-100 border border-blue-300" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedToken(token)}
                >
                  <div className="font-medium">{token.name}</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{token.price} KRW</span>
                    <span className={token.priceChange >= 0 ? "text-green-600" : "text-red-600"}>
                      {token.priceChange >= 0 ? "+" : ""}
                      {token.priceChange}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Price Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedToken.name}</h2>
              <div className="text-2xl font-bold">
                {selectedToken.price} KRW
                <span className={`ml-2 text-sm ${selectedToken.priceChange >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {selectedToken.priceChange >= 0 ? "+" : ""}
                  {selectedToken.priceChange}%
                </span>
              </div>
            </div>
            <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">차트가 여기에 표시됩니다</p>
            </div>
          </div>

          {/* Order Book */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">호가창</h2>
              <div className="space-y-2">
                {/* Sell Orders */}
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((i) => (
                    <div key={`sell-${i}`} className="flex justify-between">
                      <span className="text-red-600">{(selectedToken.price * (1 + i * 0.01)).toFixed(0)}</span>
                      <span>{Math.floor(Math.random() * 100)}</span>
                    </div>
                  ))}
                </div>

                {/* Current Price */}
                <div className="py-2 border-y border-gray-200 my-2">
                  <div className="flex justify-between font-bold">
                    <span>{selectedToken.price}</span>
                    <span>{Math.floor(Math.random() * 100)}</span>
                  </div>
                </div>

                {/* Buy Orders */}
                <div className="space-y-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={`buy-${i}`} className="flex justify-between">
                      <span className="text-green-600">{(selectedToken.price * (1 - i * 0.01)).toFixed(0)}</span>
                      <span>{Math.floor(Math.random() * 100)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">주문하기</h2>
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
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="가격을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">수량 (DABS)</label>
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full p-2 border rounded-md"
                      placeholder="수량을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">총액 (KRW)</label>
                    <div className="p-2 bg-gray-100 rounded-md">
                      {price && quantity
                        ? (Number.parseFloat(price) * Number.parseFloat(quantity)).toLocaleString()
                        : "0"}
                    </div>
                  </div>
                </div>
              </div>
              <button
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
    </div>
  )
}

export default ExchangePage
