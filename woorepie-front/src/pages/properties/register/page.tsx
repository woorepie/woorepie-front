"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Link } from "react-router-dom"

declare global {
  interface Window {
    kakao: any;
    daum: any;
  }
}

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
    latitude: "",
    longitude: "",
    image: null as File | null,
  })

  const [isLoading, setIsLoading] = useState(false)
  const geocoderRef = useRef<any>(null)

  const loadKakaoScript = () => {
    return new Promise<void>((resolve) => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        console.log('[Kakao] SDK already loaded:', window.kakao)
        resolve()
        return
      }
      console.log('[Kakao] Loading SDK script...')
      const script = document.createElement("script")
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`
      script.onload = () => {
        console.log('[Kakao] SDK script onload')
        const checkReady = setInterval(() => {
          if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
            clearInterval(checkReady)
            console.log('[Kakao] SDK ready:', window.kakao)
            resolve()
          }
        }, 50)
      }
      document.body.appendChild(script)
    })
  }

  const loadDaumPostcode = () => {
    return new Promise<void>((resolve) => {
      if (window.daum && window.daum.Postcode) {
        console.log('[Daum] Postcode already loaded:', window.daum)
        resolve()
        return
      }
      console.log('[Daum] Loading Postcode script...')
      const script = document.createElement("script")
      script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
      script.onload = () => {
        console.log('[Daum] Postcode script onload')
        resolve()
      }
      document.body.appendChild(script)
    })
  }

  const handleAddressSearch = async () => {
    try {
      setIsLoading(true)
      console.log('[AddressSearch] Start')
      // Load Kakao SDK if not loaded
      await loadKakaoScript()
      if (!geocoderRef.current) {
        geocoderRef.current = new window.kakao.maps.services.Geocoder()
        console.log('[Kakao] Geocoder instance created:', geocoderRef.current)
      } else {
        console.log('[Kakao] Geocoder instance already exists:', geocoderRef.current)
      }
      // Load Daum Postcode if not loaded
      await loadDaumPostcode()
      // Open Daum Postcode
      new window.daum.Postcode({
        oncomplete: (data: any) => {
          console.log('[Daum] Postcode oncomplete:', data)
          const fullAddress = data.address
          const extraAddress = data.addressType === 'R' ? data.bname : ''
          // Update form with address
          setFormData(prev => ({
            ...prev,
            address: fullAddress,
            city: data.sido,
            district: data.sigungu
          }))
          // Get coordinates using Kakao Geocoder
          if (geocoderRef.current) {
            console.log('[Kakao] addressSearch call:', fullAddress)
            geocoderRef.current.addressSearch(fullAddress, (result: any, status: any) => {
              console.log('[Kakao] addressSearch result:', result, status)
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = result[0]
                setFormData(prev => ({
                  ...prev,
                  latitude: coords.y,
                  longitude: coords.x
                }))
              }
            })
          } else {
            console.error('[Kakao] Geocoder instance is null!')
          }
        }
      }).open()
    } catch (error) {
      console.error('Error loading address search:', error)
    } finally {
      setIsLoading(false)
      console.log('[AddressSearch] End')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { image, ...estateInfoForSession } = formData
    console.log("폼 제출됨!", formData)
    sessionStorage.setItem('estateInfo', JSON.stringify(estateInfoForSession))
    console.log("세션스토리지 저장 직후:", sessionStorage.getItem('estateInfo'))
    setTimeout(() => {
      window.location.href = "/properties/register/documents"
    }, 200)
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

            {/* Address Search */}
            <div>
              <label className="block mb-2 font-medium">주소 검색</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="flex-1 p-2 border rounded-md"
                  placeholder="주소를 검색하세요"
                  readOnly
                  required
                />
                <button
                  type="button"
                  onClick={handleAddressSearch}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isLoading ? '로딩중...' : '검색'}
                </button>
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block mb-2 font-medium">시</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                readOnly
                required
              />
            </div>

            {/* District */}
            <div>
              <label className="block mb-2 font-medium">구</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
                readOnly
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="property-image"
              />
              <label htmlFor="property-image" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                파일 선택
              </label>
              {formData.image && (
                <div className="mt-2 text-sm text-gray-700">{formData.image.name}</div>
              )}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button type="button" className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              다음 단계
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyRegisterPage
