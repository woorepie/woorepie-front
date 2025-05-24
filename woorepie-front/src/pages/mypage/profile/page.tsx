"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { customerService } from "@/api/customer"
import type { Customer } from "@/types/customer/customer"

const MyProfilePage = () => {
  const [profile, setProfile] = useState<Customer | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchCustomerData()
  }, [])

  const fetchCustomerData = async () => {
    try {
      const response = await customerService.getCustomerInfo()
      console.log('Raw API Response:', response)
      
      if (response.status === 200 && response.data) {
        setProfile(response.data)
        setFormData(response.data)
      } else {
        setError("고객 정보를 불러오는데 실패했습니다.")
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to fetch customer data:", error)
      setError("고객 정보를 불러오는데 실패했습니다.")
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (!formData) return

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditing(false)
    // TODO: API를 통한 프로필 업데이트 구현
    if (formData) {
      setProfile(formData)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>
  }

  if (!profile || !formData) {
    return <div className="text-center py-8">데이터를 찾을 수 없습니다.</div>
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount)
  }

  const formatPhoneNumber = (phone: string) => {
    // 기존 하이픈 제거
    const numbers = phone.replace(/-/g, '')
    // 패턴에 따라 하이픈 추가
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    }
    // 지역번호가 02인 경우
    if (numbers.startsWith('02')) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
    }
    // 기타 지역번호나 다른 패턴의 경우
    return numbers.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">내 정보</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            정보 수정하기
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">이름</label>
              <input
                type="text"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">이메일</label>
              <input
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">전화번호</label>
              <input
                type="tel"
                name="customerPhoneNumber"
                value={formData.customerPhoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">주소</label>
              <input
                type="text"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          </div>
          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => {
                setFormData(profile)
                setIsEditing(false)
              }}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              취소
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              저장
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gray-500 mb-1">이름</h3>
              <p className="font-medium">{profile.customerName}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">이메일</h3>
              <p className="font-medium">{profile.customerEmail}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">전화번호</h3>
              <p className="font-medium">{formatPhoneNumber(profile.customerPhoneNumber)}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">주소</h3>
              <p className="font-medium">{profile.customerAddress}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">계좌번호</h3>
              <p className="font-medium">{profile.accountNumber}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">계좌 잔액</h3>
              <p className="font-medium">{formatCurrency(profile.accountBalance)}</p>
            </div>
            <div>
              <h3 className="text-gray-500 mb-1">보유 토큰 가치</h3>
              <p className="font-medium">{formatCurrency(profile.totalAccountTokenPrice)}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-gray-500 mb-1">가입일</h3>
              <p className="font-medium">{formatDate(profile.customerJoinDate)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProfilePage
