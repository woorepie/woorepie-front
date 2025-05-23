"use client"

import type React from "react"

import { useState } from "react"

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    verificationCode: "",
  })
  const [emailVerified, setEmailVerified] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleVerifyEmail = () => {
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("유효한 이메일 주소를 입력해주세요.")
      return
    }

    // 이메일 중복 확인 로직 (실제로는 API 호출)
    setEmailVerified(true)
    setError("")
  }

  const handleSendCode = () => {
    // 전화번호 유효성 검사
    const phoneRegex = /^010\d{8}$/
    if (!phoneRegex.test(formData.phone)) {
      setError("유효한 전화번호를 입력해주세요. (예: 010xxxxxxxx)")
      return
    }

    // 인증번호 발송 로직 (실제로는 API 호출)
    setCodeSent(true)
    setError("")
  }

  const handleVerifyCode = () => {
    // 인증번호 유효성 검사
    if (formData.verificationCode.length !== 6 || !/^\d+$/.test(formData.verificationCode)) {
      setError("6자리 숫자 인증번호를 입력해주세요.")
      return
    }

    // 인증번호 확인 로직 (실제로는 API 호출)
    setCodeVerified(true)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 모든 필드 유효성 검사
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    // 이메일 인증 확인
    if (!emailVerified) {
      setError("이메일 중복 확인이 필요합니다.")
      return
    }

    // 전화번호 인증 확인
    if (!codeVerified) {
      setError("전화번호 인증이 필요합니다.")
      return
    }

    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      setError("비밀번호는 영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.")
      return
    }

    // 비밀번호 일치 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    // 약관 동의 확인
    if (!termsAgreed) {
      setError("이용약관 및 개인정보 수집에 동의해주세요.")
      return
    }

    try {
      // 세션 스토리지에 회원가입 데이터 저장
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }
      sessionStorage.setItem("signupData", JSON.stringify(signupData))
      
      // KYC 페이지로 이동
      window.location.href = "/auth/kyc"
    } catch (error) {
      setError("처리 중 오류가 발생했습니다.")
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">1</div>
            <span className="font-medium">회원가입</span>
          </div>
          <div className="w-8 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-2">
              2
            </div>
            <span className="text-gray-500">KYC 인증</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">회원가입</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              이메일
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 p-3 border rounded-md"
                placeholder="이메일을 입력하세요"
                disabled={emailVerified}
                required
              />
              <button
                type="button"
                onClick={handleVerifyEmail}
                className={`px-4 py-3 rounded-md ${
                  emailVerified ? "bg-green-100 text-green-800" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={emailVerified}
              >
                {emailVerified ? "확인됨" : "이메일 중복 확인"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-medium">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="비밀번호를 입력하세요"
              required
            />
            <p className="text-sm text-gray-500 mt-1">영문, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.</p>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="비밀번호를 다시 한 번 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 font-medium">
              전화번호
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 p-3 border rounded-md"
                placeholder="전화번호를 입력하세요 (예: 010xxxxxxxx)"
                disabled={codeSent}
                required
              />
              <button
                type="button"
                onClick={handleSendCode}
                className={`px-4 py-3 rounded-md ${
                  codeSent ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={codeSent && codeVerified}
              >
                {codeVerified ? "확인됨" : codeSent ? "재전송" : "인증번호 받기"}
              </button>
            </div>
          </div>

          {codeSent && (
            <div className="mb-6">
              <label htmlFor="verificationCode" className="block mb-2 font-medium">
                인증번호 6자리
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="verificationCode"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  className="flex-1 p-3 border rounded-md"
                  placeholder="인증번호 6자리 숫자를 입력하세요"
                  maxLength={6}
                  disabled={codeVerified}
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyCode}
                  className={`px-4 py-3 rounded-md ${
                    codeVerified ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  disabled={codeVerified}
                >
                  확인
                </button>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={termsAgreed}
                onChange={(e) => setTermsAgreed(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm">(필수) 이용약관 및 개인정보 수집에 동의합니다.</span>
            </label>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            회원 가입
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
