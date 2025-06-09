"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { login, requestSmsVerification, verifySmsCode } from "@/api/auth"

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    verificationCode: ""
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAgent, setIsAgent] = useState(false)
  const [isVerificationSent, setIsVerificationSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isVerificationSent) {
      setIsVerificationSent(false)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [timeLeft, isVerificationSent])

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

  const handleRequestVerification = async () => {
    if (!formData.phoneNumber) {
      setError("전화번호를 입력해주세요.")
      return
    }

    try {
      setIsLoading(true)
      const phoneNumber = formData.phoneNumber.replace(/-/g, '')
      const response = await requestSmsVerification(phoneNumber)

      if (response.success) {
        setIsVerificationSent(true)
        setTimeLeft(180) // 3분 = 180초
        setError("")
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError("인증번호 발송 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!formData.verificationCode) {
      setError("인증번호를 입력해주세요.")
      return
    }

    try {
      setIsLoading(true)
      const phoneNumber = formData.phoneNumber.replace(/-/g, '')
      const response = await verifySmsCode(phoneNumber, formData.verificationCode)

      if (response.success) {
        setIsVerified(true)
        setError("")
      } else {
        setError(response.message)
      }
    } catch (err) {
      setError("인증번호 확인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
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

    if (!isVerified) {
      setError("전화번호 인증을 완료해주세요.")
      return
    }

    try {
      setIsLoading(true)
      const loginData = isAgent ? {
        agentEmail: formData.email,
        agentPassword: formData.password,
        agentPhoneNumber: formData.phoneNumber.replace(/-/g, ''), // 하이픈 제거
      } : {
        customerEmail: formData.email,
        customerPassword: formData.password,
        customerPhoneNumber: formData.phoneNumber.replace(/-/g, ''), // 하이픈 제거
      }

      const response = await login(loginData, isAgent)

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8">{isAgent ? '중개인 로그인' : '고객 로그인'}</h1>

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

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="전화번호 입력 (예: 010-1234-5678)"
                maxLength={13}
                required
                disabled={isVerified}
              />
              <button
                type="button"
                onClick={handleRequestVerification}
                disabled={isLoading || isVerified || !formData.phoneNumber}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isLoading || isVerified || !formData.phoneNumber
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isVerified ? "인증완료" : "인증요청"}
              </button>
            </div>
          </div>

          {isVerificationSent && !isVerified && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                  인증번호
                </label>
                <span className="text-sm text-red-600">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50"
                  placeholder="인증번호 6자리 입력"
                  maxLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isLoading || !formData.verificationCode}
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    isLoading || !formData.verificationCode
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  확인
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
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
              type="button"
              onClick={() => setIsAgent(!isAgent)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isAgent ? '고객 로그인으로 전환' : '중개인이신가요?'}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isVerified}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading || !isVerified ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } mb-4`}
          >
            {isLoading ? "로그인 중..." : (isAgent ? "중개인 로그인" : "로그인")}
          </button>

          <button
            type="button"
            onClick={() => navigate(isAgent ? '/auth/agent/company' : '/auth/signup')}
            className="w-full py-3 px-4 rounded-md text-gray-700 font-medium border-2 border-gray-300 hover:bg-gray-50"
          >
            {isAgent ? "중개인 회원가입" : "일반 회원가입"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
