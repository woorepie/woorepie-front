"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { customerService } from "@/api/customer/customerService"
import { register } from "@/api/auth"

interface SignupData {
  name: string
  email: string
  password: string
  phone: string
}

// 날짜 형식 변환 함수 (YYYY/MM/DD -> YYYY-MM-DD)
const convertToLocalDate = (dateStr: string): string => {
  if (!dateStr) return ""
  return dateStr.replace(/\//g, "-")
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

  useEffect(() => {
    // 세션 스토리지에서 회원가입 데이터 가져오기
    const signupDataStr = sessionStorage.getItem("signupData")
    if (!signupDataStr) {
      // 데이터가 없으면 회원가입 페이지로 리다이렉트
      window.location.href = "/auth/signup"
      return
    }

    try {
      const signupData: SignupData = JSON.parse(signupDataStr)
      setFormData(prev => ({
        ...prev,
        name: signupData.name,
        email: signupData.email,
        phone: signupData.phone,
      }))
    } catch (error) {
      console.error("Failed to parse signup data:", error)
      window.location.href = "/auth/signup"
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
    // 주소 검색 로직 (실제로는 외부 API 호출)
    alert("주소 검색 기능은 실제 구현 시 Daum 우편번호 API 등을 사용합니다.")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 모든 필드 유효성 검사
      if (!formData.address || !formData.addressDetail || !formData.birthdate) {
        setError("모든 필드를 입력해주세요.")
        setIsLoading(false)
        return
      }

      // 생년월일 형식 검사
      const birthdateRegex = /^\d{4}\/\d{2}\/\d{2}$/
      if (!birthdateRegex.test(formData.birthdate)) {
        setError("생년월일을 YYYY/MM/DD 형식으로 입력해주세요.")
        setIsLoading(false)
        return
      }

      // 신분증 사진 확인
      if (!idPhoto) {
        setError("신분증 사진을 업로드해주세요.")
        setIsLoading(false)
        return
      }

      // 약관 동의 확인
      if (!termsAgreed) {
        setError("이용약관 및 개인정보 수집에 동의해주세요.")
        setIsLoading(false)
        return
      }

      console.log("KYC 인증 시작")

      // 1. S3 Presigned URL 요청
      const presignedUrlResponse = await customerService.getPresignedUrl(formData.email)
      
      console.log("Presigned URL 받음:", presignedUrlResponse)

      // 2. S3에 이미지 업로드
      await customerService.uploadImageToS3(presignedUrlResponse.url, idPhoto)

      console.log("이미지 업로드 완료")

      // 세션 스토리지에서 비밀번호 가져오기
      const signupDataStr = sessionStorage.getItem("signupData")
      if (!signupDataStr) {
        throw new Error("회원가입 데이터를 찾을 수 없습니다.")
      }

      const signupData: SignupData = JSON.parse(signupDataStr)

      // 3. 회원가입 API 호출
      const response = await register({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPassword: signupData.password,
        customerPhoneNumber: formData.phone,
        customerAddress: `${formData.address} ${formData.addressDetail}`,
        customerDateOfBirth: convertToLocalDate(formData.birthdate),
        customerIdentificationUrlKey: presignedUrlResponse.key,
      })

      console.log("회원가입 응답:", response)

      if (response.success) {
        // 세션 스토리지 클리어
        sessionStorage.removeItem("signupData")
        // 홈페이지로 이동
        window.location.href = "/"
      } else {
        setError(response.error || "회원가입 중 오류가 발생했습니다.")
      }
    } catch (error) {
      console.error("KYC 인증 중 오류:", error)
      setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLater = () => {
    // 홈페이지로 이동
    window.location.href = "/"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-2">✓</div>
            <span className="font-medium">회원가입</span>
          </div>
          <div className="w-8 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">2</div>
            <span className="font-medium">KYC 인증</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">KYC 인증</h1>
        <p className="text-gray-600 mb-6">KYC 인증을 하지 않으면, 매물 청약, 매도, 매수가 불가합니다.</p>

        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              className="w-full p-3 border rounded-md bg-gray-100"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 font-medium">
              전화번호
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              className="w-full p-3 border rounded-md bg-gray-100"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-medium">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="w-full p-3 border rounded-md bg-gray-100"
              disabled
            />
          </div>

          <div className="mb-4">
            <label htmlFor="birthdate" className="block mb-2 font-medium">
              생년월일
            </label>
            <input
              type="text"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="YYYY/MM/DD"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 font-medium">
              주소
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="flex-1 p-3 border rounded-md"
                placeholder="주소를 입력하세요"
                required
              />
              <button
                type="button"
                onClick={handleSearchAddress}
                className="px-4 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
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
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="addressDetail" className="block mb-2 font-medium">
              상세 주소
            </label>
            <input
              type="text"
              id="addressDetail"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="상세 주소를 입력하세요"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">신분증 사진 업로드</label>
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
                    <span>{idPhoto.name}</span>
                  </div>
                  <button type="button" onClick={handleDeleteFile} className="text-red-600 hover:text-red-800">
                    첨부 파일 삭제
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <input type="file" id="idPhoto" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <label
                    htmlFor="idPhoto"
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

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleLater}
              className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              다음에 하기
            </button>
            <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "처리 중..." : "KYC 인증하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default KycPage
