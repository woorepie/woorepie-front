"use client"

import type React from "react"

import { useState } from "react"
import { Link } from "react-router-dom"

const PropertyRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    district: "",
    address: "",
    price: "",
    tokenAmount: "",
    tenant: "",
    expectedYield: "",
    targetPrice: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the form data to an API
    console.log(formData)
    // Redirect to the next step
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">매물 등록</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Name */}
            <div>
              <label className="block mb-2 font-medium">매물명</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="매물명을 입력하세요"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 font-medium">시</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">선택하세요</option>
                <option value="서울">서울</option>
                <option value="부산">부산</option>
                <option value="인천">인천</option>
                <option value="대구">대구</option>
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block mb-2 font-medium">구</label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                required
              >
                <option value="">선택하세요</option>
                <option value="강남구">강남구</option>
                <option value="서초구">서초구</option>
                <option value="마포구">마포구</option>
                <option value="송파구">송파구</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 font-medium">상세 주소</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="상세 주소를 입력하세요"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 font-medium">매물 가격</label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="예: 50억"
                required
              />
            </div>

            {/* Token Amount */}
            <div>
              <label className="block mb-2 font-medium">토큰 발행량</label>
              <input
                type="text"
                name="tokenAmount"
                value={formData.tokenAmount}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="예: 500,000DABS"
                required
              />
            </div>

            {/* Tenant */}
            <div>
              <label className="block mb-2 font-medium">임차인</label>
              <input
                type="text"
                name="tenant"
                value={formData.tenant}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="예: (주) ㅇㅇㅇ법무법인"
                required
              />
            </div>

            {/* Expected Yield */}
            <div>
              <label className="block mb-2 font-medium">예상 수익률</label>
              <input
                type="text"
                name="expectedYield"
                value={formData.expectedYield}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="예: 5%"
                required
              />
            </div>

            {/* Target Price */}
            <div>
              <label className="block mb-2 font-medium">목표 매각가</label>
              <input
                type="text"
                name="targetPrice"
                value={formData.targetPrice}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                placeholder="예: 60억"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block mb-2 font-medium">매물 설명</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md h-40"
              placeholder="매물에 대한 상세 설명을 입력하세요"
              required
            ></textarea>
          </div>

          {/* Property Image Upload */}
          <div className="mt-6">
            <label className="block mb-2 font-medium">매물 이미지</label>
            <div className="border-2 border-dashed border-gray-300 p-8 rounded-md text-center">
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
                className="mx-auto text-gray-400 mb-4"
              >
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <line x1="16" y1="5" x2="22" y2="5"></line>
                <line x1="19" y1="2" x2="19" y2="8"></line>
                <circle cx="9" cy="9" r="2"></circle>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <p className="text-gray-600 mb-2">이미지를 드래그하거나 클릭하여 업로드하세요</p>
              <p className="text-gray-500 text-sm">PNG, JPG, GIF 파일 (최대 10MB)</p>
              <input type="file" className="hidden" />
              <button type="button" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                파일 선택
              </button>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button type="button" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              취소
            </button>
            <Link
              to="/properties/register/documents"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              다음 단계
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyRegisterPage
