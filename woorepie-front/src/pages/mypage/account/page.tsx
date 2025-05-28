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

  const isAllZero = accounts.length > 0 && accounts.every(account =>
    account.accountTokenAmount === 0 && account.accountTokenPrice === 0
  )

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">보유 자산 현황</h2>

      {isAllZero && (
        <div className="text-center text-gray-500 mb-6">
          아직 보유한 토큰이 없습니다. 투자를 시작해보세요!
        </div>
      )}

      <div className="space-y-6">
        {accounts.map((account) => (
          <div
            key={account.accountId}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-500 mb-1">부동산 이름</h3>
                <p className="font-medium">{account.estateName}</p>
              </div>
              <div>
                <h3 className="text-gray-500 mb-1">보유 토큰</h3>
                <p className="font-medium">{account.accountTokenAmount.toLocaleString()} 개</p>
              </div>
              <div>
                <h3 className="text-gray-500 mb-1">토큰 현재가</h3>
                <p className="font-medium">{formatCurrency(account.estateTokenPrice)}</p>
              </div>
              <div>
                <h3 className="text-gray-500 mb-1">보유 토큰 가치</h3>
                <p className="font-medium text-blue-600">{formatCurrency(account.accountTokenPrice)}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-gray-500 mb-1">부동산 총 가치</h3>
                <p className="font-medium">{formatCurrency(Number(account.estatePrice))}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAccountPage
