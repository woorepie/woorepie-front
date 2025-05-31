"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { customerService } from "@/api/customer/customerService"
import type { Customer } from "@/types/customer/customer"
import { logout } from "@/api/auth"

const MyProfilePage = () => {
  const [profile, setProfile] = useState<Customer | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isChargePopupOpen, setIsChargePopupOpen] = useState(false)
  const [chargeAmount, setChargeAmount] = useState("")
  const [isCharging, setIsCharging] = useState(false)
  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")

  useEffect(() => {
    fetchCustomerData()
  }, [])

  const fetchCustomerData = async () => {
    try {
      const data = await customerService.getCustomerInfo()
      console.log('Customer Data:', data)
      
      if (data) {
        setProfile(data)
        setFormData(data)
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newForm = {
      ...passwordForm,
      [name]: value
    }
    setPasswordForm(newForm)
    setPasswordError("")
    
    // 새 비밀번호 확인 실시간 검증
    if (name === "newPassword" || name === "confirmPassword") {
      if (newForm.confirmPassword && newForm.newPassword !== newForm.confirmPassword) {
        setConfirmError("새 비밀번호가 일치하지 않습니다.")
      } else {
        setConfirmError("")
      }
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setConfirmError("새 비밀번호가 일치하지 않습니다.")
      return
    }

    try {
      // 비밀번호 변경 API 호출
      await customerService.modifyPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      )
      
      // 성공한 경우에만 로그아웃 및 페이지 이동
      await logout()
      window.location.href = "/auth/login"
      return // 성공 시 여기서 함수 종료
    } catch (error) {
      // 실패 시 에러 메시지만 표시
      console.error("Failed to change password:", error)
      setPasswordError("비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.")
    }
  }

  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chargeAmount || isCharging) return

    try {
      setIsCharging(true)
      const amount = parseInt(chargeAmount)
      await customerService.chargeAccountBalance(amount)
      await fetchCustomerData() // Refresh the data
      setIsChargePopupOpen(false)
      setChargeAmount("")
    } catch (error) {
      console.error("Failed to charge account:", error)
      setError("충전에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setIsCharging(false)
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
            <div className="pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsPasswordPopupOpen(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                비밀번호 변경하기 {'>'}
              </button>
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
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-gray-500 mb-1">계좌 잔액</h3>
                <p className="font-medium">{formatCurrency(profile.accountBalance)}</p>
              </div>
              <button
                onClick={() => setIsChargePopupOpen(true)}
                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                충전하기
              </button>
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

      {/* Password Change Popup */}
      {isPasswordPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">비밀번호 변경</h3>
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">현재 비밀번호</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">새 비밀번호</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">새 비밀번호 확인</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full p-2 border rounded-md ${
                      confirmError ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {confirmError && (
                    <p className="text-red-500 text-sm mt-1">{confirmError}</p>
                  )}
                </div>
                {passwordError && (
                  <div className="text-red-600 text-sm">{passwordError}</div>
                )}
              </div>
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordPopupOpen(false)
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    })
                    setPasswordError("")
                    setConfirmError("")
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={!!confirmError}
                >
                  변경하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Charge Popup */}
      {isChargePopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4">계좌 충전</h3>
            <form onSubmit={handleChargeSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  충전 금액
                </label>
                <input
                  type="number"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  placeholder="충전할 금액을 입력하세요"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsChargePopupOpen(false)
                    setChargeAmount("")
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isCharging}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400"
                >
                  {isCharging ? "충전 중..." : "충전하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyProfilePage
