"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login } from "@/api/auth"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 입력 유효성 검사
    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 모두 입력해주세요.")
      return
    }

    try {
      setIsLoading(true)
      // 실제 구현에서는 API 호출을 통해 로그인 처리
      // const response = await loginApi(formData.email, formData.password);

      // 로그인 성공 시뮬레이션 (1초 후)
      setTimeout(() => {
        // 로그인 성공 후 사용자 정보 저장
        login({
          customerEmail: formData.email,
          customerPassword: formData.password,
          customerPhoneNumber: "",
        })

        setIsLoading(false)
        navigate("/")
      }, 1000)
    } catch (err) {
      setIsLoading(false)
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
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

          <div className="mb-6">
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
