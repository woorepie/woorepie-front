"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { agentService } from "@/api/agent"
import type { AgentCompany } from "@/types/agent/agent"
import { useNavigate } from "react-router-dom"

declare global {
  interface Window {
    daum: any
  }
}

const AgentCompanyPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    companyName: "",
    businessNumber: "",
    address: "",
    addressDetail: "",
    phone: "",
  })
  const [businessLicense, setBusinessLicense] = useState<File | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    // 카카오 주소 검색 API 스크립트 로드
    const script = document.createElement("script")
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
    script.async = true
    
    // 스크립트 로드 완료 확인
    script.onload = () => {
      console.log("Daum Postcode script loaded")
    }
    
    script.onerror = () => {
      console.error("Failed to load Daum Postcode script")
    }
    
    document.head.appendChild(script)

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
      setBusinessLicense(e.target.files[0])
    }
  }

  const handleDeleteFile = () => {
    setBusinessLicense(null)
  }

  const handleSearchAddress = () => {
    if (!window.daum?.Postcode) {
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

    // 모든 필드 유효성 검사
    if (
      !formData.companyName ||
      !formData.businessNumber ||
      !formData.address ||
      !formData.addressDetail ||
      !formData.phone
    ) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    // 사업자등록증 확인
    if (!businessLicense) {
      setError("사업자등록증을 업로드해주세요.")
      return
    }

    try {
      // 법인 정보를 세션 스토리지에 저장
      const companyData: AgentCompany = {
        companyName: formData.companyName,
        businessNumber: formData.businessNumber,
        address: formData.address,
        addressDetail: formData.addressDetail,
        phone: formData.phone,
      }

      // 파일 정보도 함께 저장
      sessionStorage.setItem('agentCompanyData', JSON.stringify(companyData))
      sessionStorage.setItem('businessLicenseName', businessLicense.name)

      // 다음 단계로 이동 (대행인 정보 입력)
      navigate("/auth/agent/representative")
    } catch (error) {
      console.error("법인 정보 저장 중 오류:", error)
      setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">1</div>
            <span className="font-medium">법인 정보 입력</span>
          </div>
          <div className="w-8 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-2">
              2
            </div>
            <span className="text-gray-500">대행인 정보 입력</span>
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
        <h1 className="text-2xl font-bold mb-6">법인 정보 입력</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <div className="mb-4">
            <label htmlFor="companyName" className="block mb-2 font-medium">
              법인명
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="법인명을 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="businessNumber" className="block mb-2 font-medium">
              사업자등록번호
            </label>
            <input
              type="text"
              id="businessNumber"
              name="businessNumber"
              value={formData.businessNumber}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="사업자등록번호를 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 font-medium">
              법인 주소
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="flex-1 p-3 border rounded-md"
                placeholder="주소를 검색하세요"
                readOnly
                required
              />
              <button
                type="button"
                onClick={handleSearchAddress}
                className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                  className="mr-1 inline-block"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                주소 검색
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="addressDetail" className="block mb-2 font-medium">
              법인 상세 주소
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

          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 font-medium">
              법인 전화번호
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="법인 전화번호를 입력하세요 (예: 02xxxxxxxx)"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">사업자 등록증</label>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
              {businessLicense ? (
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
                    <span>{businessLicense.name}</span>
                  </div>
                  <button type="button" onClick={handleDeleteFile} className="text-red-600 hover:text-red-800">
                    첨부 파일 삭제
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <input
                    type="file"
                    id="businessLicense"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="businessLicense"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                  >
                    첨부파일 선택
                  </label>
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            다음
          </button>
        </form>
      </div>
    </div>
  )
}

export default AgentCompanyPage
