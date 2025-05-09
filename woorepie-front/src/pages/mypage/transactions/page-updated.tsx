"use client"

import { useState } from "react"
import { mockTransactions } from "../../../data/mockData"

const MyTransactionsPage = () => {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTransactions = mockTransactions
    .filter((t) => filter === "all" || t.type === filter)
    .filter((t) => t.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) || t.date.includes(searchTerm))

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">거래내역</h2>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
          <div className="flex space-x-4">
            <button
              className={`px-4 py-2 rounded-md ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("all")}
            >
              전체
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === "buy" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("buy")}
            >
              매수
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === "sell" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("sell")}
            >
              매도
            </button>
            <button
              className={`px-4 py-2 rounded-md ${filter === "dividend" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => setFilter("dividend")}
            >
              배당
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="pl-8 pr-4 py-2 border rounded-md w-full md:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
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
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-b">
                <td className="p-3">{transaction.date}</td>
                <td className="p-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                      <svg
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
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    </div>
                    {transaction.tokenName}
                  </div>
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      transaction.type === "buy"
                        ? "bg-green-100 text-green-800"
                        : transaction.type === "sell"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {transaction.type === "buy" ? "매수" : transaction.type === "sell" ? "매도" : "배당"}
                  </span>
                </td>
                <td className="p-3 text-right">{transaction.quantity}</td>
                <td className="p-3 text-right">{transaction.price.toLocaleString()}</td>
                <td className="p-3 text-right">{transaction.total.toLocaleString()}</td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
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
