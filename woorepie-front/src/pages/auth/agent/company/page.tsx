"use client"

import type React from "react"

import { useState } from "react"

const AgentCompanyPage = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    businessNumber: "",
    address: "",
    addressDetail: "",
    phone: "",
  })
  const [businessLicense, setBusinessLicense] = useState<File | null>(null)
  const [error, setError] = useState("")

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
    // 주소 검색 로직 (실제로는 외부 API 호출)
    alert("주소 검색 기능은 실제 구현 시 Daum 우편번호 API 등을 사용합니다.")
  }

  const handleSubmit = (e: React.FormEvent) => {
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

    // 법인 정보 등록 로직 (실제로는 API 호출)
    console.log("법인 정보 등록 성공", formData, businessLicense)
    // 다음 단계로 이동 (대행인 정보 입력)
    window.location.href = "/auth/agent/representative"
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
