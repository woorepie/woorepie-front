"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import type { Property } from "../../../types/property"
import { mockProperties } from "../../../data/mockData"

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [property, setProperty] = useState<Property | null>(null)

  useEffect(() => {
    // In a real app, you would fetch the property data from an API
    const foundProperty = mockProperties.find((p) => p.id === id)
    setProperty(foundProperty || null)
  }, [id])

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">매물을 찾을 수 없습니다</h1>
        <Link to="/properties" className="text-blue-600 hover:underline">
          매물 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="text-sm text-gray-500 mb-2">
          {property.city} &gt; {property.district}
        </div>
        <h1 className="text-3xl font-bold mb-2">{property.name}</h1>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            {property.price} / {property.tokenAmount}DABS
          </div>
          <div>임차인 {property.tenant}</div>
          <div>{property.subscriptionPeriod}</div>
          <div>{property.availableTokens} DABS 청약 가능</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Property Image */}
          <div className="bg-gray-200 h-96 rounded-lg mb-8 flex items-center justify-center">
            {property.image ? (
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400">Image caption goes here</div>
            )}
          </div>

          {/* Property Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">매물 소개</h2>
            <div className="mb-4">
              <div className="flex gap-4 mb-2">
                <div>예상 수익률 : {property.expectedYield}</div>
                <div>목표 매각가 : {property.targetPrice}</div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget
              vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate
              arcu amet, vitae nisi, tellus tincidunt. At feugiat sapien varius id.
            </p>
            <p className="text-gray-700 mb-4">
              Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed
              auctor. Porttitor fames arcu quis fusce augue enim. Quis at habitant diam at. Suscipit tristique risus, at
              donec. In turpis vel et quam imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
            </p>
          </div>

          {/* Building Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">건물 정보</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-medium mb-2">토지 건물</h3>
                <div className="text-gray-700">
                  <p>용도지역</p>
                  <p>전체 대지면적: 27평(89m2)</p>
                  <p>거래 대지면적: 27평(89m2)</p>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">공시지가</h3>
                <div className="bg-gray-100 h-40 rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">위치</h2>
            <p className="text-gray-700 mb-4">{property.address}</p>
            <div className="bg-gray-200 h-80 rounded-lg"></div>
          </div>

          {/* Nearby Information */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">주변 정보</h2>
              <button className="text-blue-600">View all</button>
            </div>
            <p className="text-gray-700 mb-6">
              공공데이터 기반 / 뉴스 크롤링 기반 정보 불러오기가 가능하다면 불러옵니다
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="border rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-2">Category 5 min read</div>
                  <h3 className="font-bold mb-2">Blog title heading will go here</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.
                  </p>
                  <a href="#" className="text-blue-600 text-sm">
                    Read more &gt;
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Documents */}
          <div>
            <h2 className="text-2xl font-bold mb-4">투자 관련 문서</h2>
            <div className="flex gap-4">
              <button className="px-4 py-2 border rounded-md">공시</button>
              <button className="px-4 py-2 border rounded-md">+</button>
              <button className="px-4 py-2 border rounded-md">+</button>
            </div>
          </div>
        </div>

        {/* Subscription Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <div className="font-medium">토큰 가격</div>
                <div>{property.tokenPrice}/1DABS</div>
              </div>
              <div className="flex justify-between mb-4">
                <div className="font-medium">잔고</div>
                <div>{property.balance}KRW</div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-medium">수량 입력하기</label>
              <input type="number" className="w-full p-3 border rounded-md mb-4" placeholder="수량을 입력하세요" />
              <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">청약 신청</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailPage
