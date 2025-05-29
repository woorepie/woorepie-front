"use client"

import { useEffect, useState } from "react"
import { customerService } from "../../../api/customer/customerService"
import type { CustomerTrade } from "../../../types/customer/customerTrade"

const MyTransactionsPage = () => {
  const [filter, setFilter] = useState<"ALL" | "BUY" | "SELL" | "DIVIDEND">("ALL")
  const [searchTerm, setSearchTerm] = useState("")
  const [trades, setTrades] = useState<CustomerTrade[]>([])

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const data = await customerService.getCustomerTrade()
        setTrades(data)
      } catch (error) {
        console.error("거래내역 불러오기 실패:", error)
      }
    }

    fetchTrades()
  }, [])

  const filteredTransactions = trades
    .filter((t) => filter === "ALL" || t.tradeType === filter)
    .filter(
      (t) =>
        t.estateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.tradeDate.includes(searchTerm)
    )

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">거래내역</h2>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <div className="flex space-x-4">
            {(["ALL", "BUY", "SELL", "DIVIDEND"] as const).map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-md ${filter === type ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                onClick={() => setFilter(type)}
              >
                {type === "ALL" ? "전체" : type === "BUY" ? "매수" : type === "SELL" ? "매도" : "배당"}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="토큰명 또는 날짜 검색"
              className="pl-8 pr-4 py-2 border rounded-md w-full md:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">날짜</th>
              <th className="p-3 text-left">토큰명</th>
              <th className="p-3 text-center">거래 유형</th>
              <th className="p-3 text-right">수량</th>
              <th className="p-3 text-right">가격</th>
              <th className="p-3 text-right">총액</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.tradeId} className="border-b">
                  <td className="p-3">{transaction.tradeDate}</td>
                  <td className="p-3">{transaction.estateName}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        transaction.tradeType === "BUY"
                          ? "bg-green-100 text-green-800"
                          : transaction.tradeType === "SELL"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {transaction.tradeType === "BUY"
                        ? "매수"
                        : transaction.tradeType === "SELL"
                        ? "매도"
                        : "배당"}
                    </span>
                  </td>
                  <td className="p-3 text-right">{transaction.tradeTokenAmount}</td>
                  <td className="p-3 text-right">{transaction.tradeTokenPrice.toLocaleString()}</td>
                  <td className="p-3 text-right">
                    {(transaction.tradeTokenAmount * transaction.tradeTokenPrice).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  거래 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyTransactionsPage
