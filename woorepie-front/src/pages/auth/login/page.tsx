"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "@/api/auth"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: ""
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name === 'phoneNumber') {
      // 숫자와 하이픈만 입력 가능
      const sanitizedValue = value.replace(/[^\d-]/g, '')
      
      // 자동으로 하이픈 추가
      let formattedNumber = sanitizedValue
      if (sanitizedValue.length <= 13) {
        formattedNumber = sanitizedValue
          .replace(/[^\d]/g, '')
          .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedNumber
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 입력 유효성 검사
    if (!formData.email || !formData.password || !formData.phoneNumber) {
      setError("이메일, 비밀번호, 전화번호를 모두 입력해주세요.")
      return
    }

    try {
      setIsLoading(true)
      const response = await login({
        customerEmail: formData.email,
        customerPassword: formData.password,
        customerPhoneNumber: formData.phoneNumber.replace(/-/g, ''), // 하이픈 제거
      })

      if (response.success) {
        navigate("/")
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8">로그인</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="이메일 입력"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="비밀번호 입력"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="전화번호 입력 (예: 010-1234-5678)"
              maxLength={13}
              required
            />
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
              로그인 상태 유지
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
