"use client"

import { useState } from "react"
import { DollarSign } from "lucide-react"

interface DividendItem {
  id: string
  productName: string
  dividendRate: string
  quantity: number
  price: number
  totalAmount: number
  beneficiaries: string
}

const DividendApproval = () => {
  const [dividendItems, setDividendItems] = useState<DividendItem[]>([
    {
      id: "1",
      productName: "강남 오피스텔 펀드",
      dividendRate: "5.2%",
      quantity: 20,
      price: 15000,
      totalAmount: 3000000,
      beneficiaries: "250명",
    },
    {
      id: "2",
      productName: "분당 상가 리츠",
      dividendRate: "4.8%",
      quantity: 20,
      price: 15000,
      totalAmount: 3000000,
      beneficiaries: "180명",
    },
    {
      id: "3",
      productName: "송파 아파트 펀드",
      dividendRate: "6.1%",
      quantity: 20,
      price: 15000,
      totalAmount: 3000000,
      beneficiaries: "320명",
    },
    {
      id: "4",
      productName: "마포 오피스 리츠",
      dividendRate: "5.5%",
      quantity: 20,
      price: 15000,
      totalAmount: 3000000,
      beneficiaries: "290명",
    },
    {
      id: "5",
      productName: "용산 상가 펀드",
      dividendRate: "4.5%",
      quantity: 20,
      price: 15000,
      totalAmount: 3000000,
      beneficiaries: "210명",
    },
  ])

  const handleApprove = (id: string) => {
    // 승인 처리 로직
    console.log(`Approved dividend ${id}`)
  }

  const handleReject = (id: string) => {
    // 거부 처리 로직
    console.log(`Rejected dividend ${id}`)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">배당금 승인</h1>

      <div className="bg-gray-50 rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">배당률</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">총액</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dividendItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <DollarSign size={20} className="text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.dividendRate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.totalAmount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handleApprove(item.id)}
                      className="px-4 py-1 bg-[#0F62FE] text-white rounded text-sm"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(item.id)}
                      className="px-4 py-1 bg-gray-200 text-gray-700 rounded text-sm"
                    >
                      거부
                    </button>
                  </div>
                  <div className="text-right mt-1 text-sm text-gray-500">{item.dividendRate}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DividendApproval
