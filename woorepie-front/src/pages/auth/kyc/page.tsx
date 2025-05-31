"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { customerService } from "@/api/customer/customerService"
import { register } from "@/api/auth"

declare global {
  interface Window {
    daum: any
  }
}

interface SignupData {
  customerName: string
  customerEmail: string
  customerPassword: string
  customerPhoneNumber: string
  customerAddress: string
  customerAddressDetail: string
  customerDateOfBirth: string
}

// 날짜를 LocalDate 형식(YYYY-MM-DD)으로 변환
const convertToLocalDate = (dateStr: string): string => {
  if (!dateStr) return ""
  // YYYY-MM-DD 형식이 아닌 경우 변환
  return dateStr.includes('/') ? dateStr.replace(/\//g, '-') : dateStr
}

const KycPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    birthdate: "",
    address: "",
    addressDetail: "",
  })
  const [idPhoto, setIdPhoto] = useState<File | null>(null)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAddressScriptLoaded, setIsAddressScriptLoaded] = useState(false)

  useEffect(() => {
    // 카카오 주소 검색 API 스크립트 로드
    const script = document.createElement("script")
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    
    // 스크립트 로드 완료 확인
    script.onload = () => {
      console.log("Daum Postcode script loaded")
      setIsAddressScriptLoaded(true)
    }
    
    script.onerror = () => {
      console.error("Failed to load Daum Postcode script")
      setIsAddressScriptLoaded(false)
    }
    
    document.head.appendChild(script)

    // 세션 스토리지에서 회원가입 데이터 가져오기
    const signupDataStr = sessionStorage.getItem("signupData")
    if (!signupDataStr) {
      // 데이터가 없으면 회원가입 페이지로 리다이렉트
      window.location.href = "/auth/signup"
      return
    }

    try {
      const signupData: SignupData = JSON.parse(signupDataStr)
      setFormData({
        name: signupData.customerName,
        email: signupData.customerEmail,
        phone: signupData.customerPhoneNumber,
        birthdate: "",
        address: "",
        addressDetail: "",
      })
    } catch (error) {
      console.error("Failed to parse signup data:", error)
      window.location.href = "/auth/signup"
    }

    // 컴포넌트 언마운트 시 스크립트 제거
    return () => {
      const scriptElement = document.querySelector(`script[src="${script.src}"]`)
      if (scriptElement) {
        document.head.removeChild(scriptElement)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIdPhoto(e.target.files[0])
    }
  }

  const handleDeleteFile = () => {
    setIdPhoto(null)
  }

  const handleSearchAddress = () => {
    if (!isAddressScriptLoaded || !window.daum?.Postcode) {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }

    new window.daum.Postcode({
      oncomplete: (data: any) => {
        // 선택한 주소 데이터를 폼에 반영
        setFormData(prev => ({
          ...prev,
          address: data.address,
          // 참고항목이 있으면 괄호와 함께 추가
          addressDetail: data.buildingName ? `(${data.buildingName})` : ''
        }))

        // 상세주소 입력 필드로 포커스 이동
        const detailInput = document.getElementById('addressDetail')
        if (detailInput) {
          detailInput.focus()
        }
      }
    }).open()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 신분증 사진 확인
      if (!idPhoto || !idPhoto.type) {
        setError("유효하지 않은 파일입니다.")
        setIsLoading(false)
        return
      }

      // 약관 동의 확인
      if (!termsAgreed) {
        setError("이용약관 및 개인정보 수집에 동의해주세요.")
        setIsLoading(false)
        return
      }

      // 생년월일 확인
      if (!formData.birthdate) {
        setError("생년월일을 입력해주세요.")
        setIsLoading(false)
        return
      }

      console.log("KYC 인증 시작")

      // 1. S3 Presigned URL 요청
      const presignedUrlResponse = await customerService.getPresignedUrl(
        formData.email,
        idPhoto.type
      )
      
      console.log("Presigned URL 받음:", presignedUrlResponse)

      // 2. S3에 이미지 업로드
      await customerService.uploadImageToS3(presignedUrlResponse.url, idPhoto)

      console.log("이미지 업로드 완료")

      // 세션 스토리지에서 회원가입 데이터 가져오기
      const signupDataStr = sessionStorage.getItem("signupData")
      if (!signupDataStr) {
        throw new Error("회원가입 데이터를 찾을 수 없습니다.")
      }

      const signupData: SignupData = JSON.parse(signupDataStr)

      // 3. 회원가입 API 호출
      const response = await register({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPassword: signupData.customerPassword,
        customerPhoneNumber: formData.phone,
        customerAddress: `${formData.address} ${formData.addressDetail}`.trim(),
        customerDateOfBirth: formData.birthdate,
        customerIdentificationUrlKey: presignedUrlResponse.key,
      })

      console.log("회원가입 응답:", response)

      if (response.success) {
        // 세션 스토리지 클리어
        sessionStorage.removeItem("signupData")

        // 로그인 페이지로 이동
        window.location.href = "/auth/login"
      } else {
        setError(response.message || "회원가입 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("KYC 인증 중 오류:", error)
      setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-2">✓</div>
              <span className="text-sm font-medium">회원가입</span>
            </div>
            <div className="w-8 h-1 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">2</div>
              <span className="text-sm font-medium">KYC 인증</span>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-4">KYC 인증</h1>
        <p className="text-gray-600 mb-6 text-sm text-center">KYC 인증을 하지 않으면, 매물 청약, 매도, 매수가 불가합니다.</p>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              전화번호
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
              생년월일
            </label>
            <div className="relative">
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                required
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">달력에서 생년월일을 선택해주세요.</p>
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              주소
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                className="flex-1 p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="주소를 검색하세요"
                readOnly
                required
              />
              <button
                type="button"
                onClick={handleSearchAddress}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                주소 검색
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                id="addressDetail"
                name="addressDetail"
                value={formData.addressDetail}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
                placeholder="상세 주소를 입력하세요"
                required
              />
              {formData.addressDetail && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, addressDetail: '' }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">상세 주소를 정확히 입력해주세요.</p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">신분증 사진 업로드</label>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
              {idPhoto ? (
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
                    <span className="text-sm">{idPhoto.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteFile}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <input
                    type="file"
                    id="idPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="idPhoto"
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                  >
                    파일 선택
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
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">(필수) 이용약관 및 개인정보 수집에 동의합니다.</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white text-sm font-medium ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "처리 중..." : "KYC 인증하기"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default KycPage
