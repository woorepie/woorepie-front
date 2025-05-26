"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { agentService } from "@/api/agent"
import type { AgentCompany, AgentRepresentative } from "@/types/agent/agent"

const AgentRepresentativePage = () => {
  const navigate = useNavigate()
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
  const [powerOfAttorney, setPowerOfAttorney] = useState<File | null>(null)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [error, setError] = useState("")
  const [companyData, setCompanyData] = useState<AgentCompany | null>(null)

  useEffect(() => {
    // 저장된 법인 정보 불러오기
    const savedCompanyData = sessionStorage.getItem('agentCompanyData')
    if (!savedCompanyData) {
      navigate('/auth/agent/company')
      return
    }
    setCompanyData(JSON.parse(savedCompanyData))
  }, [navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleVerifyEmail = async () => {
    // 이메일 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("유효한 이메일 주소를 입력해주세요.")
      return
    }

    try {
      const response = await agentService.checkEmailDuplicate(formData.email)
      
      if (response.success) {
        setEmailVerified(true)
        setError("")
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError("이메일 중복 확인 중 오류가 발생했습니다.")
    }
  }

  const handleSendCode = async () => {
    // 전화번호 유효성 검사
    const phoneRegex = /^010\d{8}$/
    if (!phoneRegex.test(formData.phone)) {
      setError("유효한 전화번호를 입력해주세요. (예: 010xxxxxxxx)")
      return
    }

    // 임시로 인증번호 발송 성공 처리
    setCodeSent(true)
    setError("")
  }

  const handleVerifyCode = async () => {
    // 인증번호 유효성 검사
    if (formData.verificationCode.length !== 6 || !/^\d+$/.test(formData.verificationCode)) {
      setError("6자리 숫자 인증번호를 입력해주세요.")
      return
    }

    // 임시로 인증번호 확인 성공 처리
    setCodeVerified(true)
    setError("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPowerOfAttorney(e.target.files[0])
    }
  }

  const handleDeleteFile = () => {
    setPowerOfAttorney(null)
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

    // 비밀번호 일치 확인
    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    // 위임장 확인
    if (!powerOfAttorney) {
      setError("위임장을 업로드해주세요.")
      return
    }

    // 약관 동의 확인
    if (!termsAgreed) {
      setError("이용약관 및 개인정보 수집에 동의해주세요.")
      return
    }

    try {
      if (!companyData) {
        setError("법인 정보를 찾을 수 없습니다.")
        return
      }

      // 대행인 정보 생성
      const representativeData: AgentRepresentative = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      }

      // 세션 스토리지에 대행인 정보 저장
      sessionStorage.setItem('agentRepresentativeData', JSON.stringify(representativeData))
      if (powerOfAttorney) {
        sessionStorage.setItem('powerOfAttorneyName', powerOfAttorney.name)
      }

      // KYC 인증 페이지로 이동
      navigate("/auth/agent/kyc")
    } catch (error) {
      console.error("대행인 정보 저장 중 오류:", error)
      setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-2">✓</div>
            <span className="font-medium">법인 정보 입력</span>
          </div>
          <div className="w-8 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">2</div>
            <span className="font-medium">대행인 정보 입력</span>
          </div>
          <div className="w-8 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-2">
              3
            </div>
            <span className="text-gray-500">KYC 인증</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">대행인 정보 입력</h1>

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
            <div className="mb-4">
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
            <label className="block mb-2 font-medium">위임장</label>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
              {powerOfAttorney ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600 mr-2"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    <span>{powerOfAttorney.name}</span>
                  </div>
                  <button type="button" onClick={handleDeleteFile} className="text-red-600 hover:text-red-800">
                    첨부 파일 삭제
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <input
                    type="file"
                    id="powerOfAttorney"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="powerOfAttorney"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                  >
                    첨부파일 선택
                  </label>
                </div>
              )}
            </div>
          </div>

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

export default AgentRepresentativePage
