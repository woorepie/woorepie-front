"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState("")

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()

    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("유효한 이메일 주소를 입력해주세요.")
      return
    }

    // 전화번호 유효성 검사
    const phoneRegex = /^010\d{8}$/
    if (!phoneRegex.test(phone)) {
      setError("유효한 전화번호를 입력해주세요. (예: 010xxxxxxxx)")
      return
    }

    // 인증번호 발송 로직 (실제로는 API 호출)
    setCodeSent(true)
    setError("")
  }

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault()

    // 인증번호 유효성 검사
    if (verificationCode.length !== 6 || !/^\d+$/.test(verificationCode)) {
      setError("6자리 숫자 인증번호를 입력해주세요.")
      return
    }

    // 인증번호 확인 로직 (실제로는 API 호출)
    setVerified(true)
    setError("")
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">비밀번호를 잊으셨나요?</h1>
        <p className="text-gray-600 mt-2">
          회원정보에 등록한 이메일과 전화번호가 모두 같아야,
          <br />
          인증번호를 받을 수 있습니다.
        </p>
      </div>

      {verified ? (
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
            <h2 className="text-xl font-bold mb-2">인증이 완료되었습니다</h2>
            <p className="text-gray-600 mb-4">비밀번호 재설정 페이지로 이동합니다.</p>
            <Link to="/auth/reset-password" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              비밀번호 재설정
            </Link>
          </div>
        </div>
      ) : (
        <form className="bg-white p-6 rounded-lg shadow-md">
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              이메일
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-md"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 font-medium">
              전화번호
            </label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 border rounded-md"
              placeholder="전화번호를 입력하세요 (예: 010xxxxxxxx)"
              required
            />
          </div>

          {!codeSent ? (
            <button
              type="button"
              onClick={handleSendCode}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              인증번호 받기
            </button>
          ) : (
            <>
              <div className="mb-6">
                <label htmlFor="verificationCode" className="block mb-2 font-medium">
                  인증번호 6자리
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="flex-1 p-3 border rounded-md"
                    placeholder="인증번호 6자리 숫자를 입력하세요"
                    maxLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    확인
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendCode}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                인증번호 다시 받기
              </button>
            </>
          )}
        </form>
      )}
    </div>
  )
}

export default ForgotPasswordPage
