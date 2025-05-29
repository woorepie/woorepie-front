"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const KAKAO_MAP_SRC = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`
const DAUM_POSTCODE_SRC = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"

const PropertyRegisterAgentPage = () => {
  const navigate = useNavigate()
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(!!window.kakao)
  const [isDaumLoaded, setIsDaumLoaded] = useState(!!(window.daum && window.daum.Postcode))
  useEffect(() => {
    // Kakao Map
    if (!window.kakao) {
      const script = document.createElement("script")
      script.src = KAKAO_MAP_SRC
      script.async = true
      script.onload = () => setIsKakaoLoaded(true)
      document.body.appendChild(script)
    } else {
      setIsKakaoLoaded(true)
    }
    // Daum Postcode
    if (!(window.daum && window.daum.Postcode)) {
      const script2 = document.createElement("script")
      script2.src = DAUM_POSTCODE_SRC
      script2.async = true
      script2.onload = () => setIsDaumLoaded(true)
      document.body.appendChild(script2)
    } else {
      setIsDaumLoaded(true)
    }
  }, [])
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
    estate_state: "",
    estate_city: "",
    estate_latitude: "",
    estate_longitude: "",
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

  // Kakao SDK 동적 로드 함수
  const loadKakaoScript = () => {
    return new Promise<void>((resolve) => {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
      script.onload = () => {
        const checkReady = setInterval(() => {
          if (window.kakao && window.kakao.maps && typeof window.kakao.maps.load === "function") {
            clearInterval(checkReady);
            resolve();
          }
        }, 50);
      };
      document.body.appendChild(script);
    });
  };

  const handleSearchAddress = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("Daum 주소 검색 스크립트가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    new window.daum.Postcode({
      oncomplete: async function (data) {
        const address = data.address;
        const state = data.sido;
        const city = data.sigungu;
        setFormData((prev) => ({
          ...prev,
          address,
          estate_state: state,
          estate_city: city,
        }));
        // Kakao SDK 동적 로드 (autoload=false)
        await loadKakaoScript();
        if (window.kakao && window.kakao.maps && typeof window.kakao.maps.load === "function") {
          window.kakao.maps.load(() => {
            if (window.kakao.maps.services) {
              const geocoder = new window.kakao.maps.services.Geocoder();
              console.log("[Kakao] addressSearch 호출 address:", address);
              geocoder.addressSearch(address, function (result, status) {
                console.log("[Kakao] addressSearch result:", result, "status:", status);
                if (status === window.kakao.maps.services.Status.OK) {
                  const latitude = result[0].y;
                  const longitude = result[0].x;
                  console.log("[Kakao] 변환된 위도/경도:", latitude, longitude);
                  setFormData((prev) => ({
                    ...prev,
                    estate_latitude: latitude,
                    estate_longitude: longitude,
                  }));
                } else {
                  console.log("[Kakao] 좌표 변환 실패");
                  setFormData((prev) => ({
                    ...prev,
                    estate_latitude: "",
                    estate_longitude: "",
                  }));
                }
              });
            } else {
              console.log("[Kakao] maps.services가 없음");
            }
          });
        } else {
          console.log("[Kakao] maps.load가 없음");
        }
      },
    }).open();
  };

  const handleNext = (e: React.FormEvent) => {
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

    // 세션스토리지에 이미지 제외한 formData 저장
    sessionStorage.setItem('estateInfo', JSON.stringify(formData))
    console.log("세션스토리지 저장 직후:", sessionStorage.getItem('estateInfo'))

    // 다음 단계로 이동 (매물 서류 업로드)
    setTimeout(() => {
      navigate("/properties/register/documents", { state: { formData, propertyImage } })
    }, 200)
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

        <form onSubmit={handleNext}>
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
                disabled={!isKakaoLoaded || !isDaumLoaded}
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
