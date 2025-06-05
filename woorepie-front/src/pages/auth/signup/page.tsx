"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { register, checkEmailDuplicate } from "@/api/auth"
import { checkPhoneDuplicate } from "@/api/auth"


declare global {
  interface Window {
    daum: any
  }
}

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
    verificationCode: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [emailCheckMessage, setEmailCheckMessage] = useState("")
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const navigate = useNavigate()
  const [isPhoneDuplicateChecked, setIsPhoneDuplicateChecked] = useState(false)
  const [phoneCheckMessage, setPhoneCheckMessage] = useState("")

  // 전화번호 중복 확인
  useEffect(() => {
  setIsPhoneDuplicateChecked(false)
  setPhoneCheckMessage("")
}, [formData.phoneNumber])


  useEffect(() => {
    // 카카오 주소 검색 API 스크립트 로드
    const script = document.createElement("script")
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // 이메일이 변경되면 인증 상태 초기화
  useEffect(() => {
    setIsEmailVerified(false)
    setEmailCheckMessage("")
  }, [formData.email])

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

  const handleAddressSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        // 선택한 주소 데이터를 폼에 반영
        setFormData(prev => ({
          ...prev,
          baseAddress: data.address,
        }))
      },
    }).open()
  }

  const handleEmailCheck = async () => {
    if (!formData.email) {
      setEmailCheckMessage("이메일을 입력해주세요.")
      return
    }

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setEmailCheckMessage("올바른 이메일 형식이 아닙니다.")
      return
    }

    try {
      const response = await checkEmailDuplicate(formData.email)
      if (response.success) {
        setIsEmailVerified(true)
        setEmailCheckMessage(response.message)
      } else {
        setIsEmailVerified(false)
        setEmailCheckMessage(response.message)
      }
    } catch (error) {
      setIsEmailVerified(false)
      setEmailCheckMessage("이메일 중복 확인 중 오류가 발생했습니다.")
    }
  }

  const handleSendVerificationCode = () => {
    if (!formData.phoneNumber) {
      setError("전화번호를 입력해주세요.")
      return
    }
    // 실제로는 API 호출하여 인증번호 전송
    setIsCodeSent(true)
    setError("")
  }

 const handlePhoneDuplicateCheck = async () => {
  if (!formData.phoneNumber) {
    setPhoneCheckMessage("전화번호를 입력해주세요.")
    return
  }

  try {
    const isAvailable = await checkPhoneDuplicate(formData.phoneNumber.replace(/-/g, ""))
    setIsPhoneDuplicateChecked(true)
    setPhoneCheckMessage("사용 가능한 전화번호입니다.") // 여기서 직접 메시지 설정
  } catch (err: any) {
    setIsPhoneDuplicateChecked(false)
    setPhoneCheckMessage(
      err.response?.data?.message || "전화번호 중복 확인 중 오류가 발생했습니다."
    )
  }
}



  const handleVerifyCode = () => {
    // 인증번호 유효성 검사
    if (formData.verificationCode.length !== 6 || !/^\d+$/.test(formData.verificationCode)) {
      setError("6자리 숫자 인증번호를 입력해주세요.")
      return
    }

    // 인증번호 확인 로직 (실제로는 API 호출)
    setIsPhoneVerified(true)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // 입력 유효성 검사
    if (!formData.email || !formData.password || !formData.confirmPassword || 
        !formData.name || !formData.phoneNumber) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    if (!isEmailVerified) {
      setError("이메일 중복 확인이 필요합니다.")
      return
    }

    if (!isPhoneVerified) {
      setError("전화번호 인증이 필요합니다.")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    try {
      setIsLoading(true)
      // 회원가입 시에는 KYC 인증 페이지로 이동하여 신분증 업로드를 진행
      sessionStorage.setItem('signupData', JSON.stringify({
        customerEmail: formData.email,
        customerPassword: formData.password,
        customerName: formData.name,
        customerPhoneNumber: formData.phoneNumber.replace(/-/g, ''), // 하이픈 제거
      }))
      
      navigate("/auth/kyc") // KYC 인증 페이지로 이동
    } catch (err) {
      setError("회원가입 정보 저장 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="이메일 입력"
                required
                readOnly={isEmailVerified}
              />
              <button
                type="button"
                onClick={handleEmailCheck}
                disabled={isEmailVerified}
                className={`px-4 py-2 rounded-md ${
                  isEmailVerified
                    ? "bg-green-500 text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isEmailVerified ? "확인완료" : "중복확인"}
              </button>
            </div>
            {emailCheckMessage && (
              <p className={`mt-1 text-sm ${
                isEmailVerified ? "text-green-600" : "text-red-600"
              }`}>
                {emailCheckMessage}
              </p>
            )}
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="비밀번호 다시 입력"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              placeholder="이름 입력"
              required
            />
          </div>

          <div className="mb-4">
  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
    전화번호
  </label>

            {/* 전화번호 입력 + 중복확인 */}
            <div className="flex gap-2 mb-2">
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
                readOnly={isPhoneVerified}
              />
              <button
                type="button"
                onClick={handlePhoneDuplicateCheck}
                disabled={isPhoneVerified || isPhoneDuplicateChecked}
                className={`px-4 py-2 rounded-md ${
                  isPhoneDuplicateChecked ? "bg-green-500" : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isPhoneDuplicateChecked ? "확인완료" : "중복확인"}
              </button>
            </div>
            {phoneCheckMessage && (
              <p className={`text-sm ${isPhoneDuplicateChecked ? "text-green-600" : "text-red-600"} mb-2`}>
                {phoneCheckMessage}
              </p>
            )}

            {/* 인증번호 전송 버튼 */}
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={!isPhoneDuplicateChecked || isPhoneVerified}
                className={`w-full py-2 rounded-md text-white font-medium ${
                  isPhoneVerified
                    ? "bg-green-500"
                    : !isPhoneDuplicateChecked
                    ? "bg-gray-400"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPhoneVerified ? "인증완료" : "인증번호 전송"}
              </button>
            </div>

            {/* 인증번호 입력 & 확인 */}
            {isCodeSent && !isPhoneVerified && (
              <div className="flex gap-2">
                <input
                  type="text"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  확인
                </button>
              </div>
            )}
          </div>


          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "다음" : "다음"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage
