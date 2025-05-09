"use client"

import { useState } from "react"
import { mockTransactions } from "../../../data/mockData"

const MyTransactionsPage = () => {
  const [filter, setFilter] = useState("all")

  const filteredTransactions = filter === "all" ? mockTransactions : mockTransactions.filter((t) => t.type === filter)

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">거래내역</h2>

      <div className="mb-6">
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
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyTransactionsPage
