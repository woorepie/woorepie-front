"use client"

import type React from "react"

import { useState } from "react"

const PropertyRegisterAgentPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    zoning: "",
    address: "",
    addressDetail: "",
    totalArea: "",
    tradingArea: "",
    publicPrice: "",
    description: "",
    tokenAmount: "",
    tokenPrice: "",
  })
  const [propertyImage, setPropertyImage] = useState<File | null>(null)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPropertyImage(e.target.files[0])
    }
  }

  const handleDeleteFile = () => {
    setPropertyImage(null)
  }

  const handleSearchAddress = () => {
    // 주소 검색 로직 (실제로는 외부 API 호출)
    alert("주소 검색 기능은 실제 구현 시 Daum 우편번호 API 등을 사용합니다.")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // 모든 필드 유효성 검사
    const requiredFields = [
      "name",
      "zoning",
      "address",
      "addressDetail",
      "totalArea",
      "tradingArea",
      "publicPrice",
      "description",
      "tokenAmount",
      "tokenPrice",
    ]

    const emptyFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])
    if (emptyFields.length > 0) {
      setError("모든 필드를 입력해주세요.")
      return
    }

    // 매물 이미지 확인
    if (!propertyImage) {
      setError("매물 이미지를 업로드해주세요.")
      return
    }

    // 매물 기본 정보 등록 로직 (실제로는 API 호출)
    console.log("매물 기본 정보 등록 성공", formData, propertyImage)
    // 다음 단계로 이동 (매물 서류 업로드)
    window.location.href = "/properties/register/documents/upload"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2">1</div>
            <span className="font-medium">1. 매물 기본 정보 입력</span>
          </div>
          <div className="w-8 h-1 bg-gray-300 mx-2"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-2">
              2
            </div>
            <span className="text-gray-500">2. 매물 서류 업로드</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">매물 기본 정보</h1>

        <form onSubmit={handleSubmit}>
          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

          <div className="mb-4">
            <label htmlFor="name" className="block mb-2 font-medium">
              매물명
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="매물 이름을 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="zoning" className="block mb-2 font-medium">
              용도 지역
            </label>
            <input
              type="text"
              id="zoning"
              name="zoning"
              value={formData.zoning}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="용도 지역을 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block mb-2 font-medium">
              매물 주소
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="flex-1 p-3 border rounded-md"
                placeholder="매물 주소를 검색하세요"
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
              매물 상세 주소
            </label>
            <input
              type="text"
              id="addressDetail"
              name="addressDetail"
              value={formData.addressDetail}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="매물 상세 주소를 입력하세요"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="totalArea" className="block mb-2 font-medium">
                전체 대지 면적
              </label>
              <input
                type="text"
                id="totalArea"
                name="totalArea"
                value={formData.totalArea}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                placeholder="전체 대지 면적을 입력하세요 (단위 : m²)"
                required
              />
            </div>
            <div>
              <label htmlFor="tradingArea" className="block mb-2 font-medium">
                거래 대지 면적
              </label>
              <input
                type="text"
                id="tradingArea"
                name="tradingArea"
                value={formData.tradingArea}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                placeholder="거래 대지 면적을 입력하세요 (단위: m²)"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="publicPrice" className="block mb-2 font-medium">
              개별공시지가
            </label>
            <input
              type="text"
              id="publicPrice"
              name="publicPrice"
              value={formData.publicPrice}
              onChange={handleChange}
              className="w-full p-3 border rounded-md"
              placeholder="개별공시지가를 입력하세요"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">매물 이미지</label>
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
              {propertyImage ? (
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
                    <span>{propertyImage.name}</span>
                  </div>
                  <button type="button" onClick={handleDeleteFile} className="text-red-600 hover:text-red-800">
                    첨부 파일 삭제
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <input
                    type="file"
                    id="propertyImage"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="propertyImage"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer inline-block"
                  >
                    첨부파일 선택
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-2 font-medium">
              매물 설명
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border rounded-md h-32"
              placeholder="매물에 대한 설명을 입력하세요"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="tokenAmount" className="block mb-2 font-medium">
                토큰 발행 수
              </label>
              <input
                type="text"
                id="tokenAmount"
                name="tokenAmount"
                value={formData.tokenAmount}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                placeholder="발행할 토큰 수를 입력하세요"
                required
              />
            </div>
            <div>
              <label htmlFor="tokenPrice" className="block mb-2 font-medium">
                토큰당 가격
              </label>
              <input
                type="text"
                id="tokenPrice"
                name="tokenPrice"
                value={formData.tokenPrice}
                onChange={handleChange}
                className="w-full p-3 border rounded-md"
                placeholder="토큰당 가격을 입력하세요"
                required
              />
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

export default PropertyRegisterAgentPage
