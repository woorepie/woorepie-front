"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    if (!passwordRegex.test(password)) {
      setError("비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.")
      return
    }

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    // 비밀번호 변경 로직 (실제로는 API 호출)
    setSuccess(true)
    setError("")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">비밀번호 재설정</h1>
      </div>

      {success ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-center">
            <div className="text-green-600 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">비밀번호가 변경되었습니다</h2>
            <p className="text-gray-600 mb-4">새 비밀번호로 로그인할 수 있습니다.</p>
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              로그인 페이지로 이동
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              새 비밀번호
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md"
              placeholder="새 비밀번호를 입력하세요"
              required
            />
            <p className="text-sm text-gray-500 mt-1">영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.</p>
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">
              새 비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border rounded-md"
              placeholder="새 비밀번호를 다시 한 번 입력하세요"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            비밀번호 변경
          </button>
        </form>
      )}
    </div>
  )
}

export default ResetPasswordPage
