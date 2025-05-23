"use client"

import { useState } from "react"
import { Building } from "lucide-react"

interface SaleItem {
  id: string
  propertyName: string
  seller: string
  quantity: number
  price: number
  totalPrice: number
  commission: number
  rate: string
}

const SaleApproval = () => {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([
    {
      id: "1",
      propertyName: "강남 오피스텔 A동",
      seller: "김판매",
      quantity: 20,
      price: 15000,
      totalPrice: 3000000,
      commission: 300000,
      rate: "4.2%",
    },
    {
      id: "2",
      propertyName: "분당 상가 B호",
      seller: "박소유",
      quantity: 20,
      price: 15000,
      totalPrice: 3000000,
      commission: 300000,
      rate: "4.2%",
    },
    {
      id: "3",
      propertyName: "송파 아파트 C호",
      seller: "정판매",
      quantity: 20,
      price: 15000,
      totalPrice: 3000000,
      commission: 300000,
      rate: "4.2%",
    },
    {
      id: "4",
      propertyName: "마포 오피스 D층",
      seller: "윤소유",
      quantity: 20,
      price: 15000,
      totalPrice: 3000000,
      commission: 300000,
      rate: "4.2%",
    },
    {
      id: "5",
      propertyName: "용산 상가 E호",
      seller: "한판매",
      quantity: 20,
      price: 15000,
      totalPrice: 3000000,
      commission: 300000,
      rate: "4.2%",
    },
  ])

  const handleApprove = (id: string) => {
    // 승인 처리 로직
    console.log(`Approved sale ${id}`)
  }

  const handleReject = (id: string) => {
    // 거부 처리 로직
    console.log(`Rejected sale ${id}`)
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">매각 승인</h1>

      <div className="bg-gray-50 rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                매물 정보
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매자</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">수량</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">총액</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {saleItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building size={20} className="text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.propertyName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{item.seller}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                  {item.totalPrice.toLocaleString()}
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
                  <div className="text-right mt-1 text-sm text-gray-500">{item.rate}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SaleApproval
