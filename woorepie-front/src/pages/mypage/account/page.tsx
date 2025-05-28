"use client"

import { useState, useEffect } from "react"
import { customerService } from "../../../api/customer/customerService"
import type { CustomerAccount } from "../../../types/customer/customeraccount"

const MyAccountPage = () => {
  const [accounts, setAccounts] = useState<CustomerAccount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchAccountData()
  }, [])

  const fetchAccountData = async () => {
    try {
      const data = await customerService.getCustomerAccount()
      console.log('Account Data:', data)

      if (data) {
        setAccounts(data)
      } else {
        setError("계좌 정보를 불러오는데 실패했습니다.")
      }
    } catch (error) {
      console.error("Failed to fetch account data:", error)
      setError("계좌 정보를 불러오는데 실패했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  if (!accounts.length) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">보유 자산 현황</h2>
        <div className="text-center text-gray-500 mb-6">
          현재 계좌 정보가 없습니다.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">보유 자산 현황</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-left">
              <th className="px-4 py-2">매물 이름</th>
              <th className="px-4 py-2">보유 토큰 개수</th>
              <th className="px-4 py-2">토큰 현재가</th>
              <th className="px-4 py-2">보유 토큰 가치</th>
              <th className="px-4 py-2">매물 시세</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(account => (
              <tr key={account.accountId} className="border-b">
                <td className="px-4 py-2">{account.estateName}</td>
                <td className="px-4 py-2">{account.accountTokenAmount.toLocaleString()} 개</td>
                <td className="px-4 py-2">{formatCurrency(account.estateTokenPrice)}</td>
                <td className="px-4 py-2 text-blue-600">{formatCurrency(account.accountTokenPrice)}</td>
                <td className="px-4 py-2">{formatCurrency(Number(account.estatePrice))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyAccountPage
